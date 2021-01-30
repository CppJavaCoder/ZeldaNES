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

export class ZeldaNES implements ICore, API.ZeldaCore {
    header = "NES";
    @ModLoaderAPIInject()
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
    eventTicks: Map<string, Function> = new Map<string, Function>();
    global!: API.IGlobalContext;
    log!: ILogger;
    once: boolean = true;
    
    link: API.ILink;
    

	constructor() {
        this.link = null as unknown as API.ILink;
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
        this.link = new CORE.Link(this.ModLoader.emulator);
        this.log = this.ModLoader.logger;
    }

    @onTick()
    onTick() {
        this.link.update();
    }
    
    @onPostTick()
    onPostTick() {

    }
}