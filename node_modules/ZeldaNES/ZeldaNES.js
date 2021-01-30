"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeldaNES = void 0;
const PluginLifecycle_1 = require("modloader64_api/PluginLifecycle");
const ModLoaderAPIInjector_1 = require("modloader64_api/ModLoaderAPIInjector");
const IModLoaderAPI_1 = require("modloader64_api/IModLoaderAPI");
const EventHandler_1 = require("modloader64_api/EventHandler");
const CORE = __importStar(require("./src/Imports"));
const Imports_1 = require("./src/Imports");
class ZeldaNES {
    constructor() {
        this.header = "NES";
        this.ModLoader = {};
        this.eventTicks = new Map();
        this.once = true;
        this.link = null;
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
        this.link = new CORE.Link(this.ModLoader.emulator);
        this.log = this.ModLoader.logger;
    }
    onTick() {
        this.link.update();
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