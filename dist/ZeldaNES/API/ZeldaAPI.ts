import { ICore, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';

export interface IGlobalContext {
}

export interface ZeldaCore extends ICore {
    global: IGlobalContext;

}