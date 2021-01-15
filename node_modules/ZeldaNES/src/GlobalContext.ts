import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import * as API from '../API/Imports';
import * as CORE from '../src/Imports';

export class GlobalContext {

    ModLoader: IModLoaderAPI;
    
    constructor(ModLoader: IModLoaderAPI) {
        this.ModLoader = ModLoader;
    }
    
}