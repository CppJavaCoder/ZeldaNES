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
        this.header = "NZS";
        this.ModLoader = {};
        this.eventTicks = new Map();
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
        this.global = new Imports_1.GlobalContext(this.ModLoader);
    }
    onTick() {
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