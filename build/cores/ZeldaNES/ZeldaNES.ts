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
    header = "NZS";
    @ModLoaderAPIInject()
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
    eventTicks: Map<string, Function> = new Map<string, Function>();
    global!: API.IGlobalContext;
    log!: ILogger;
	
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
        this.global = new GlobalContext(this.ModLoader);
        this.log = this.ModLoader.logger;
        

    }

    @onTick()
    onTick() {
        //this.log.info("OnTick");
    }
    
    @onPostTick()
    onPostTick() {

    }
}