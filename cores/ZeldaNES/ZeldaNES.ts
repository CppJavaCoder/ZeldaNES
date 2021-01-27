import { onTick, Preinit, Init, Postinit, onPostTick } from "modloader64_api/PluginLifecycle";
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { IModLoaderAPI, ILogger, ICore, ModLoaderEvents } from "modloader64_api/IModLoaderAPI";
import { bus, EventHandler } from "modloader64_api/EventHandler";
import { PayloadType } from "modloader64_api/PayloadType";
import IMemory from "modloader64_api/IMemory";
import fs from 'fs';
import path from 'path';

import * as API from './API/Imports';
import * as CORE from './src/Imports';
import { GlobalContext } from "./src/Imports";

export class ZeldaNES implements ICore, API.ZeldaCore {
    header = "NES";
    @ModLoaderAPIInject()
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
    eventTicks: Map<string, Function> = new Map<string, Function>();
    global!: API.IGlobalContext;
    log!: ILogger;
    once: boolean = true;
    
    travelLock: boolean = true;
    first: number = 0;
    prev: number = 0;
    changed: boolean = false;
    sizeLockA: boolean = true;
    sizeLockB: boolean = true;
    _tl: number = 0;
    _low: number = 0;

	constructor() {
    }

    @Preinit()
    preinit() {

    }
    
    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
    onReset1(evt: any) {

    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_POST)
    onReset2(evt: any) {

    }
    
    @Init()
    init(): void {

    }

    @Postinit()
    postinit(): void {
        if(!this.once)
            return;
        else
            this.once = false;
        this.global = new GlobalContext(this.ModLoader);
        this.log = this.ModLoader.logger;
        
        if(this.ModLoader && this.ModLoader.emulator)
        {
            this.log.info("Creating Player Sprites...");
            bus.emit('create-sprite',"mods/Link.bmp",16,16,4,4);
            bus.emit('move-sprite',0,256,256);
        }
        this.travelLock = true;
        this.sizeLockA = false;
        this.sizeLockB = false;
    }

    @onTick()
    onTick() {
        if(this.ModLoader.emulator.rdramRead8(0x00248) == 0x00FF)
            return;
        
        if(this._tl!=this.ModLoader.emulator.rdramRead8(0x000E9))
        {
            this._tl = this.ModLoader.emulator.rdramRead8(0x000E9);
            this.travelLock = false;
        }

        if(this.travelLock || (this.ModLoader.emulator.rdramRead8(0x000E9) >= 0x016))// && this.ModLoader.emulator.rdramRead8(0x000E7) == 0
        {
            bus.emit('fg-sprite',0,true);
        }
        else if(this.ModLoader.emulator.rdramRead8(0x000E3) && this.ModLoader.emulator.rdramRead8(0x000E7) == 0)
        {
            bus.emit('fg-sprite',0,false);
            return;
        }


        let ypos = this.ModLoader.emulator.rdramRead8(0x00248) - 8;
        let xpos = this.ModLoader.emulator.rdramRead8(0x0024B);
        bus.emit('move-sprite',0,xpos,ypos);
        
        let frame1 = this.ModLoader.emulator.rdramRead8(0x00249);
        //let frame2 = this.ModLoader.emulator.rdramRead8(0x0024D);
        let actualFrame = 0;
        switch(frame1)
        {
            default:
                break;
                case 0x78://Award!
                actualFrame = 3;
            break;
            case 0x0C://Step 1 North
                actualFrame = 1;
            break;
            case 0x0D://Step 2 North
                actualFrame = 0;
            break;
            case 0x18://Attack North
                actualFrame = 2;
            break;
            case 0x00://Step 1 East
                actualFrame = 5;
            break;
            case 0x04://Step 2 East
                actualFrame = 4;
            break;
            case 0x10://Attack East
                actualFrame = 6;
            break;
            case 0x58://Step 1 South
                actualFrame = 9;
            break;
            case 0x5A://Step 2 South
                actualFrame = 8;
            break;
            case 0x14://Attack West
                actualFrame = 10;
            break;
            case 0x02://Step 1 West
                actualFrame = 13;
            break;
            case 0x06://Step 2 West
                actualFrame = 12;
            break;
            case 0x12://Attack South
                actualFrame = 14;
            break;
            }
            bus.emit('frame-sprite',0,actualFrame);

            if(this.ModLoader.emulator.rdramRead8(0x000E9) >= 0x0016)
            {
                this.sizeLockA = true;
            }
            else if(this.ModLoader.emulator.rdramRead8(0x000E3) == 0)
            {
                this.sizeLockB = true;
            }
        
            if(this.ModLoader.emulator.rdramRead8(0x00606) == 8)
            {
                if(-((ypos+8)%16) == this._low-1)
                    this._low = -((ypos+9)%16);
                bus.emit('clip-sprite',0,0,0,0,this._low);
            }
            else if(this.sizeLockA && this.sizeLockB)
            {
                bus.emit('clip-sprite',0,0,0,0,this._low);
                this._low = 0;
                this.sizeLockA = this.sizeLockB = false;
            }

        this.ModLoader.emulator.rdramWriteBuffer(0x00248,Buffer.from('ffffffffffffffff','hex'));
    }
    
    @onPostTick()
    onPostTick() {

    }
}