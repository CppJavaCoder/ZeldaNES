import ILink from 'modloader64_api/IMemory';
import * as CORE from '../src/Imports';
import * as API from '../API/Imports';

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

export interface IInventory extends ILink
{
    tunicCol: TunicCol;

    sword: Upgrade3;
    bombs:   number;
    arrow: Upgrade2;
    hasBow: boolean;
    candle: Upgrade2;
    hasWhistle: boolean;
    hasFood: boolean;
    potion: Upgrade2;
    hasRod: boolean;
    hasRaft: boolean;
    hasBook: boolean;
    ring: Upgrade2;
    hasLadder: boolean;
    hasKey: boolean;
    hasPower: boolean;
    letter: Upgrade2;
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

    refreshValues(): void;
    rewriteValues(): void;
}