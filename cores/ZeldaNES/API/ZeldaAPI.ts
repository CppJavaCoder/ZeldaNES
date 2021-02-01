import { ICore, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import * as API from './Imports';

export interface IGlobalContext {
}

export interface ZeldaCore extends ICore {
    global: IGlobalContext;
    link: API.ILink;

}