import { ICore, IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import * as API from './Imports';

export interface IGlobalContext {
}

export enum EnemyState{
    Active = 0, Waiting = 1
}

export interface ZeldaCore extends ICore {
    global: IGlobalContext;
    link: API.ILink;

    roomPuzzle: number;
    currentEnemyHp: Array<number>;
    currentEnemyAlive: Array<number>;
    item: Array<number>;

    checkScrollUpdate(): boolean;
    checkRoom(): boolean;
    writeRoom(): void;
    resetItemTimer(): void;
    getItemDrop(enemy: number): number;
    setEnemyItemDrop(enemy: number, item: number): void;
    getEnemyState(enemy:number): number;
}