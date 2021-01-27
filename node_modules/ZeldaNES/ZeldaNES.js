"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeldaNES = void 0;
const PluginLifecycle_1 = require("modloader64_api/PluginLifecycle");
const ModLoaderAPIInjector_1 = require("modloader64_api/ModLoaderAPIInjector");
const IModLoaderAPI_1 = require("modloader64_api/IModLoaderAPI");
const EventHandler_1 = require("modloader64_api/EventHandler");
const Imports_1 = require("./src/Imports");
class ZeldaNES {
    constructor() {
        this.header = "NES";
        this.ModLoader = {};
        this.eventTicks = new Map();
        this.once = true;
        this.travelLock = true;
        this.first = 0;
        this.prev = 0;
        this.changed = false;
        this.sizeLockA = true;
        this.sizeLockB = true;
        this._tl = 0;
        this._low = 0;
    }
    preinit() {
    }
    onReset1(evt) {
    }
    onReset2(evt) {
    }
    init() {
    }
    postinit() {
        if (!this.once)
            return;
        else
            this.once = false;
        this.global = new Imports_1.GlobalContext(this.ModLoader);
        this.log = this.ModLoader.logger;
        if (this.ModLoader && this.ModLoader.emulator) {
            this.log.info("Creating Player Sprites...");
            EventHandler_1.bus.emit('create-sprite', "mods/Link.bmp", 16, 16, 4, 4);
            EventHandler_1.bus.emit('move-sprite', 0, 256, 256);
        }
        this.travelLock = true;
        this.sizeLockA = false;
        this.sizeLockB = false;
    }
    onTick() {
        if (this.ModLoader.emulator.rdramRead8(0x00248) == 0x00FF)
            return;
        if (this._tl != this.ModLoader.emulator.rdramRead8(0x000E9)) {
            this._tl = this.ModLoader.emulator.rdramRead8(0x000E9);
            this.travelLock = false;
        }
        if (this.travelLock || (this.ModLoader.emulator.rdramRead8(0x000E9) >= 0x016)) // && this.ModLoader.emulator.rdramRead8(0x000E7) == 0
         {
            EventHandler_1.bus.emit('fg-sprite', 0, true);
        }
        else if (this.ModLoader.emulator.rdramRead8(0x000E3) && this.ModLoader.emulator.rdramRead8(0x000E7) == 0) {
            EventHandler_1.bus.emit('fg-sprite', 0, false);
            return;
        }
        let ypos = this.ModLoader.emulator.rdramRead8(0x00248) - 8;
        let xpos = this.ModLoader.emulator.rdramRead8(0x0024B);
        EventHandler_1.bus.emit('move-sprite', 0, xpos, ypos);
        let frame1 = this.ModLoader.emulator.rdramRead8(0x00249);
        //let frame2 = this.ModLoader.emulator.rdramRead8(0x0024D);
        let actualFrame = 0;
        switch (frame1) {
            default:
                break;
            case 0x78: //Award!
                actualFrame = 3;
                break;
            case 0x0C: //Step 1 North
                actualFrame = 1;
                break;
            case 0x0D: //Step 2 North
                actualFrame = 0;
                break;
            case 0x18: //Attack North
                actualFrame = 2;
                break;
            case 0x00: //Step 1 East
                actualFrame = 5;
                break;
            case 0x04: //Step 2 East
                actualFrame = 4;
                break;
            case 0x10: //Attack East
                actualFrame = 6;
                break;
            case 0x58: //Step 1 South
                actualFrame = 9;
                break;
            case 0x5A: //Step 2 South
                actualFrame = 8;
                break;
            case 0x14: //Attack West
                actualFrame = 10;
                break;
            case 0x02: //Step 1 West
                actualFrame = 13;
                break;
            case 0x06: //Step 2 West
                actualFrame = 12;
                break;
            case 0x12: //Attack South
                actualFrame = 14;
                break;
        }
        EventHandler_1.bus.emit('frame-sprite', 0, actualFrame);
        if (this.ModLoader.emulator.rdramRead8(0x000E9) >= 0x0016) {
            this.sizeLockA = true;
        }
        else if (this.ModLoader.emulator.rdramRead8(0x000E3) == 0) {
            this.sizeLockB = true;
        }
        if (this.ModLoader.emulator.rdramRead8(0x00606) == 8) {
            if (-((ypos + 8) % 16) == this._low - 1)
                this._low = -((ypos + 9) % 16);
            EventHandler_1.bus.emit('clip-sprite', 0, 0, 0, 0, this._low);
        }
        else if (this.sizeLockA && this.sizeLockB) {
            EventHandler_1.bus.emit('clip-sprite', 0, 0, 0, 0, this._low);
            this._low = 0;
            this.sizeLockA = this.sizeLockB = false;
        }
        this.ModLoader.emulator.rdramWriteBuffer(0x00248, Buffer.from('ffffffffffffffff', 'hex'));
    }
    onPostTick() {
    }
}
__decorate([
    ModLoaderAPIInjector_1.ModLoaderAPIInject()
], ZeldaNES.prototype, "ModLoader", void 0);
__decorate([
    PluginLifecycle_1.Preinit()
], ZeldaNES.prototype, "preinit", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_SOFT_RESET_PRE)
], ZeldaNES.prototype, "onReset1", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_SOFT_RESET_POST)
], ZeldaNES.prototype, "onReset2", null);
__decorate([
    PluginLifecycle_1.Init()
], ZeldaNES.prototype, "init", null);
__decorate([
    PluginLifecycle_1.Postinit()
], ZeldaNES.prototype, "postinit", null);
__decorate([
    PluginLifecycle_1.onTick()
], ZeldaNES.prototype, "onTick", null);
__decorate([
    PluginLifecycle_1.onPostTick()
], ZeldaNES.prototype, "onPostTick", null);
exports.ZeldaNES = ZeldaNES;
//# sourceMappingURL=ZeldaNES.js.map