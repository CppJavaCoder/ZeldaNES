import { onTick, Preinit, Init, Postinit, onPostTick } from "modloader64_api/PluginLifecycle";
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { IModLoaderAPI, ILogger, ICore, ModLoaderEvents } from "modloader64_api/IModLoaderAPI";
import { bus, EventHandler } from "modloader64_api/EventHandler";
import { PayloadType } from "modloader64_api/PayloadType";
import IMemory from "modloader64_api/IMemory";
import fs, { link } from 'fs';
import path from 'path';

import * as API from './API/Imports';
import * as CORE from './src/Imports';
import { GlobalContext } from "./src/Imports";
import { ILink } from "./API/Imports";

/*
export enum Item
{

}*/


export class ZeldaNES implements ICore, API.ZeldaCore {
    header = "NES";
    @ModLoaderAPIInject()
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
    eventTicks: Map<string, Function> = new Map<string, Function>();
    global!: API.IGlobalContext;
    log!: ILogger;
    
    link: API.ILink = null as unknown as API.ILink;
    
    roomPuzzle: number = 0;
    currentEnemyHp: Array<number> = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF];
    currentEnemyAlive: Array<number> = [0xFF,0xFF,0xFF,0xFF,0xFF,0xFF];
    item: Array<number> = [];

    scrollDir: number = API.Direction.None;

	constructor() {
        for(let n: number = 0; n < 0x100; n++)
            this.item.push(0);
    }

    resetItemTimer(): void {
        for(let n: number = 0; n < 0x06; n++)
            this.ModLoader.emulator.rdramWrite8(API.addresses.ITEM_TIMER+n,0xFF);
    }

    setEnemyItemDrop(enemy: number, item: number): void
    {
        this.ModLoader.emulator.rdramWrite8(API.addresses.ENEMY_DROP + enemy, item);
    }
    getItemDrop(enemy: number): number
    {
        return this.ModLoader.emulator.rdramRead8(API.addresses.ENEMY_DROP + enemy);
    }


    checkScrollUpdate(): boolean {
        let thing: number = this.scrollDir;
        this.scrollDir = this.ModLoader.emulator.rdramRead8(API.addresses.SCROLL_DIR);
        if(thing != this.scrollDir && this.scrollDir == API.Direction.None)
            return true;
        return false;
    }    
    checkRoom(): boolean {
        let changed: boolean = false;
        if(this.checkCurrentPuzzle())
            changed = true;
        if(this.checkCurrentEnemies())
            changed = true;
        return changed;
    }
    checkCurrentPuzzle(): boolean {
        let change: boolean = false;
        /*
        let thing: number = this.roomPuzzle;
        this.roomPuzzle = this.ModLoader.emulator.rdramRead8(API.addresses.ROOM_PUZZLE);
        if(this.link.getInOverworld() || this.link.getCurrentLevel() == 0)
        {
            this.roomPuzzle = 0;
        }
        if(thing != this.roomPuzzle)
            change = true;*/

        if(!this.link.getInOverworld() || this.link.getCurrentLevel() != 0)
        {
            let thing: number = this.item[this.link.getWorldPos()];
            this.item[this.link.getWorldPos()] = this.ModLoader.emulator.rdramRead8(API.addresses.SOLVEDROOMS + this.link.getWorldPos());
            if(thing != this.item[this.link.getWorldPos()])
            {
                //global.ModLoader.logger.info("Hey! Listen... " + this.item[this.link.getWorldPos()].toString(16) + " " + this.link.getWorldPos().toString(16))
                change = true;
            }  
        }

        return change;
    }
    checkCurrentEnemies(): boolean {
        let changed: boolean = false;
        for(let n: number = 0; n < 6; n++)
            if(this.checkCurrentEnemy(n))
            {
                //global.ModLoader.logger.info("Enemy " + n + " was changed");
                changed = true;
            }
        return changed;
    }
    checkCurrentEnemy(enemy: number): boolean {
        let changed: boolean = false;
        let thing: number = this.currentEnemyHp[enemy];
        this.currentEnemyHp[enemy] = this.ModLoader.emulator.rdramRead8(API.addresses.ENEMY_HP + enemy);
        if(thing != this.currentEnemyHp[enemy])
            changed = true;
        thing = this.currentEnemyAlive[enemy];
        this.currentEnemyAlive[enemy] = this.ModLoader.emulator.rdramRead8(API.addresses.ENEMY_ALIVE + enemy);
        if(thing != this.currentEnemyAlive[enemy])
            changed = true;
        return changed;
    }
    writeRoom(): void {
        this.writeCurrentPuzzle();
        this.writeCurrentEnemies();
    }
    writeCurrentPuzzle(): void {
        //this.ModLoader.emulator.rdramWrite8(API.addresses.ROOM_PUZZLE, this.roomPuzzle);
        if(!this.link.getInOverworld())
            this.ModLoader.emulator.rdramWrite8(API.addresses.SOLVEDROOMS + this.link.getWorldPos(), this.item[this.link.getWorldPos()]);
    }
    writeCurrentEnemies(): void {
        for(let n: number = 0; n < 6; n++)
            this.writeCurrentEnemy(n);
    }
    writeCurrentEnemy(enemy: number): void {
        this.ModLoader.emulator.rdramWrite8(API.addresses.ENEMY_HP + enemy, this.currentEnemyHp[enemy]);
        this.ModLoader.emulator.rdramWrite8(API.addresses.ENEMY_ALIVE + enemy, this.currentEnemyAlive[enemy]);
    }
    getEnemyState(enemy:number): number {
        return this.ModLoader.emulator.rdramRead8(API.addresses.ENEMY_STATE + enemy);
    }

    @Preinit()
    preinit() {
        this.log = this.ModLoader.logger;
        this.log.info("Preinit");
    }
    
    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
    onReset1(evt: any) {
        this.log.info("Reset pre");
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_POST)
    onReset2(evt: any) {
        this.log.info("Reset post");
    }
    
    @Init()
    init(): void {
        this.log.info("Init");
    }

    @Postinit()
    postinit(): void {
        this.log.info("Postinit");
        this.global = new GlobalContext(this.ModLoader);
        this.link = new CORE.Link(this.ModLoader.emulator);
    }

    @onTick()
    onTick() {
        //this.log.info("onTick");
        this.link.update();
    }
    
    @onPostTick()
    onPostTick() {
        //this.log.info("onPostTick");
    }
}