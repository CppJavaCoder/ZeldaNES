import ILink from 'modloader64_api/IMemory';
import * as CORE from '../src/Imports';
import * as API from '../API/Imports';
import IMemory from 'modloader64_api/IMemory';

export enum Upgrade2
{
    None   = 0x00,
    Better = 0x01,
    Best   = 0x02
}
export enum Upgrade3
{
    None   = 0x00,
    Ok     = 0x01,
    Better = 0x02,
    Best   = 0x03
}
export enum TunicCol
{
    Green = 0x29,
    Blue  = 0x32,
    Red   = 0x16
}

export interface IInventory
{
    tunicCol: TunicCol;

    sword: number; // Upgrade 3
    bombs:   number;
    arrow: number; // Upgrade 2
    hasBow: boolean;
    candle: number; // Upgrade 2
    hasWhistle: boolean;
    hasFood: boolean;
    potion: number; // Upgrade 2
    hasRod: boolean;
    hasRaft: boolean;
    hasBook: boolean;
    ring: number; // Upgrade 2
    hasLadder: boolean;
    hasKey: boolean;
    hasPower: boolean;
    letter: number; // Upgrade 2
    compass: number;
    map: number;
    hasL9comp: boolean;
    hasL9map: boolean;
    rupees: number;
    keys: number;
    containers: number;
    hearts: number;
    pHeart: number;
    triforces: number;
    hasBoom: boolean;
    hasMagicBoom: boolean;
    hasMagicShield: boolean;
    bombBag: number;

    refreshValues(emulator: IMemory): boolean;
    rewriteValues(emulator: IMemory): void;
}