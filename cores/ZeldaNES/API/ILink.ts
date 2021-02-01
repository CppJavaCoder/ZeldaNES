import { ISprite } from './ISprite';
import IMemory from 'modloader64_api/IMemory';
import * as CORE from '../src/Imports';
import * as API from '../API/Imports';
import { IInventory } from './IInventory';

export enum addresses
{
    GAMEMODE    = 0x0012,
    INLEVEL     = 0x0010,// 0 if you're in the overworld or any caves within it
    INOVERWORLD = 0x0609,// Wether or not we're in the overworld
    INBASEMENT  = 0x0351,
    ONSTAIRS    = 0x0606,// Moving down or up stairs, will equal 0x08
    LINK_FRAME  = 0x0249,
    LINK_X      = 0x0070,// Character's XPOS
    LINK_Y      = 0x0084,// Character's YPOS
    ISDRAWING   = 0x00FE,// Is the game drawing?
    BLINKTIMER  = 0x04F0,// If zero, green tunic, else based off of (universalt-1)/2 == (0 black red) (1 red white) (2 blue white)
    UNIVERSALT  = 0x0015,// Timer for various functions, probably break as soon as you touch it 
    TUNIC_COL   = 0x6804,// 0x29 = green, 0x32 = blue, 0x16 = red
    HEARTS      = 0x0670,
    DEATHTIMER  = 0x0618,// >= 0x7B Link uses a grey palette
    WORLD_POS   = 0x00EB,// 0x$% where $ is the Y and % is the X
    //These are pretty self explanitory, but might as well write out the details
    INV_SWORD   = 0x0657,// 0x00 = None, 0x01 = Normal, 0x02 = White, 0x03 = Magical sword 
    INV_BOMBS   = 0x0658,// Number of bombs
    INV_ARROW   = 0x0659,// 0x00 = None, 0x01 = Arrow, 0x02 = Silver
    INV_BOW     = 0x065A,// Bow in inventory, 0x00 = false, 0x01 = true
    INV_CANDLE  = 0x065B,// 0x00 = None, 0x01 = Blue, 0x02 = Red
    INV_WHISTLE = 0x065C,// 0x00 = false, 0x01 = true
    INV_FOOD    = 0x065D,// 0x00 = false, 0x01 = true
    INV_POTION  = 0x065E,// 0x00 = None/Letter, 0x01 = Life potion, 0x02 = 2nd potion
    INV_MAGICRD = 0x065F,// 0x00 = false, 0x01 = true
    INV_RAFT    = 0x0660,// 0x00 = false, 0x01 = true
    INV_MGCBOOK = 0x0661,// 0x00 = false, 0x01 = true
    INV_MGCRING = 0x0662,// 0x00 = None, 0x01 = Blue, 0x02 = Red // Note changing this doesn't change tunic color
    INV_LADDER  = 0x0663,// 0x00 = false, 0x01 = true
    INV_MGCKEY  = 0x0664,// 0x00 = false, 0x01 = true
    INV_POWER   = 0x0665,// 0x00 = false, 0x01 = true
    INV_LETTER  = 0x0666,// 0x00 = false, 0x01 = true, You can buy potions if 0x02
    INV_COMPASS = 0x0667,// One bit per level
    INV_MAP     = 0x0668,// One bit per level
    INV_CMPLVL9 = 0x0669,// We need room for level 9
    INV_MAPLVL9 = 0x066A,// We need room for level 9
    INV_CLOCK   = 0x066C,// Clock possessed, 0x00 = false, 0x01 = true
    INV_RUPEES  = 0x066D,// Number of rupees
    INV_KEYS    = 0x066E,// Number of keys
    INV_HEARTS  = 0x066F,// Heart containers, num | 11110000 == num heart containers-1 | 00001111 = num filled hearts Ex: 0x10 = two container's no hearts
    INV_PARTHRT = 0x0670,// That last part of a heart, 0x00 = empty, 0x01 to 0x7F = half heart, 0x80 = 0xFF = full heart
    INV_TRIFORCE= 0x0671,// One bit per peice
    INV_EXTRA_T = 0x0672,// Gannon's triforce ???
    INV_BOOM    = 0x0674,// Boomerang in inventory
    INV_MGCBOOM = 0x0675,// Magic boomerang in inventory
    INV_MGCSHLD = 0x0676,// Magic shield in inventory
    INV_MAXBOMB = 0x067C // Max number of bombs
}

export enum TunicColors
{
    Green, Blue, Red,
    InjuredA, InjuredB, InjuredC,
    Death
}

export interface ILink extends IMemory {
    sprite: API.ISprite;
    inventory: IInventory;
    getWorldPos(): number;
    getInOverworld(): boolean;
    getTunicColor(): TunicColors;
    update(): void;
}