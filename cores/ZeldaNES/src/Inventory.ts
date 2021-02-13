import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import * as CORE from './Imports';
import * as API from '../API/Imports';
import { addresses } from '../API/ILink';
import { IInventory, TunicCol, Upgrade2, Upgrade3 } from '../API/IInventory';
import { bus } from 'modloader64_api/EventHandler';
import { timeStamp } from 'console';

export class Inventory implements IInventory
{
    //private readonly link: ILink;
    //private readonly emulator: IMemory;
    
    tunicCol: TunicCol;

    sword: number;
    bombs:   number;
    arrow: number;
    hasBow: boolean;
    candle: number;
    hasWhistle: boolean;
    hasFood: boolean;
    potion: number;
    hasRod: boolean;
    hasRaft: boolean;
    hasBook: boolean;
    ring: number;
    hasLadder: boolean;
    hasKey: boolean;
    hasPower: boolean;
    letter: number;
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

    constructor(/*link: ILink*/) {
        this.arrow = Upgrade2.None as number;
        this.bombs = 0;
        this.bombBag = 0;
        this.candle = Upgrade2.None as number;
        this.compass = 0;
        this.containers = 2;
        //this.emulator = emulator;
        this.hasBook = false;
        this.hasBoom = false;
        this.hasBow = false;
        this.hasFood = false;
        this.hasKey = false;
        this.hasL9comp = false;
        this.hasL9map = false;
        this.hasLadder = false;
        this.hasMagicBoom = false;
        this.hasMagicShield = false;
        this.hasPower = false;
        this.hasRaft = false;
        this.hasRod = false;
        this.hasWhistle = false;
        this.hearts = 0x22;
        this.keys = 0;
        this.letter = Upgrade2.None as number;
        //this.link = link;
        this.map = 0;
        this.pHeart = 0xFF;
        this.potion = Upgrade2.None as number;
        this.ring = Upgrade2.None as number;
        this.rupees = 0;
        this.sword = Upgrade3.None as number;
        this.triforces = 0;
        this.tunicCol = TunicCol.Green as number;
        //this.refreshValues();
    }

    refreshValues(emulator: IMemory): boolean {
        let thing: number = 0;
        let changed: boolean = false;

        thing = this.arrow;
        this.arrow = emulator.rdramRead8(addresses.INV_ARROW);
        if(thing != this.arrow)
            changed = true;

        thing = this.bombBag;
        this.bombBag = emulator.rdramRead8(addresses.INV_MAXBOMB);
        if(thing != this.bombBag)
            changed = true;

        thing = this.bombs;
        this.bombs = emulator.rdramRead8(addresses.INV_BOMBS);
        if(thing != this.bombs)
            changed = true;

        thing = this.candle;
        this.candle = emulator.rdramRead8(addresses.INV_CANDLE);
        if(thing != this.candle)
            changed = true;

        thing = this.compass;
        this.compass = emulator.rdramRead8(addresses.INV_COMPASS);
        if(thing != this.compass)
            changed = true;

        thing = this.containers;
        this.containers = (emulator.rdramRead8(addresses.INV_HEARTS) & 0xF0) >> 4;
        if(thing != this.containers)
            changed = true;

        thing = this.hasBook ? 1 : 0;
        this.hasBook = emulator.rdramRead8(addresses.INV_MGCBOOK) != 0x00;
        if(thing != (this.hasBook ? 1 : 0))
            changed = true;

        thing = this.hasBoom ? 1 : 0;
        this.hasBoom = emulator.rdramRead8(addresses.INV_BOOM) != 0x00;
        if(thing != (this.hasBoom ? 1 : 0))
            changed = true;

        thing = this.hasBow ? 1 : 0;
        this.hasBow = emulator.rdramRead8(addresses.INV_BOW) != 0x00;
        if(thing != (this.hasBow ? 1 : 0))
            changed = true;

        thing = this.hasKey ? 1 : 0;
        this.hasKey = emulator.rdramRead8(addresses.INV_MGCKEY) != 0x00;
        if(thing != (this.hasKey ? 1 : 0))
            changed = true;

        thing = this.hasFood ? 1 : 0;
        this.hasFood = emulator.rdramRead8(addresses.INV_FOOD) != 0x00;
        if(thing != (this.hasFood ? 1 : 0))
            changed = true;

        thing = this.hasL9comp ? 1 : 0;
        this.hasL9comp = emulator.rdramRead8(addresses.INV_CMPLVL9) != 0x00;
        if(thing != (this.hasL9comp ? 1 : 0))
            changed = true;

        thing = this.hasL9map ? 1 : 0;
        this.hasL9map = emulator.rdramRead8(addresses.INV_MAPLVL9) != 0x00;
        if(thing != (this.hasL9map ? 1 : 0))
            changed = true;

        thing = this.hasLadder ? 1 : 0;
        this.hasLadder = emulator.rdramRead8(addresses.INV_LADDER) != 0x00;
        if(thing != (this.hasLadder ? 1 : 0))
            changed = true;

        thing = this.hasMagicBoom ? 1 : 0;
        this.hasMagicBoom = emulator.rdramRead8(addresses.INV_MGCBOOM) != 0x00;
        if(thing != (this.hasMagicBoom ? 1 : 0))
            changed = true;

        thing = this.hasMagicShield ? 1 : 0;
        this.hasMagicShield = emulator.rdramRead8(addresses.INV_MGCSHLD) != 0x00;
        if(thing != (this.hasMagicShield ? 1 : 0))
            changed = true;

        thing = this.hasPower ? 1 : 0;
        this.hasPower = emulator.rdramRead8(addresses.INV_POWER) != 0x00;
        if(thing != (this.hasPower ? 1 : 0))
            changed = true;

        thing = this.hasRaft ? 1 : 0;
        this.hasRaft = emulator.rdramRead8(addresses.INV_RAFT) != 0x00;
        if(thing != (this.hasRaft ? 1 : 0))
            changed = true;

        thing = this.hasRod ? 1 : 0;
        this.hasRod = emulator.rdramRead8(addresses.INV_MAGICRD) != 0x00;
        if(thing != (this.hasRod ? 1 : 0))
            changed = true;

        thing = this.hasWhistle ? 1 : 0;
        this.hasWhistle = emulator.rdramRead8(addresses.INV_WHISTLE) != 0x00;
        if(thing != (this.hasWhistle ? 1 : 0))
            changed = true;

        
        thing = this.hearts;
        this.hearts = (emulator.rdramRead8(addresses.INV_HEARTS) & 0x0F);
        if(thing != this.hearts)
            changed = true;
        
        thing = this.keys;
        this.keys = emulator.rdramRead8(addresses.INV_KEYS);
        if(thing != this.keys)
            changed = true;

        thing = this.letter;
        this.letter = emulator.rdramRead8(addresses.INV_LETTER);
        if(thing != this.letter)
            changed = true;                
        
        thing = this.map;
        this.map = emulator.rdramRead8(addresses.INV_MAP);
        if(thing != this.map)
            changed = true;                

        thing = this.pHeart;
        this.pHeart = emulator.rdramRead8(addresses.INV_PARTHRT);
        if(thing != this.pHeart)
            changed = true;                

        thing = this.potion;
        this.potion = emulator.rdramRead8(addresses.INV_POTION);
        if(thing != this.potion)
            changed = true;

        thing = this.ring;
        this.ring = emulator.rdramRead8(addresses.INV_MGCRING);
        if(thing != this.ring)
            changed = true;
        
        thing = this.rupees;
        this.rupees = emulator.rdramRead8(addresses.INV_RUPEES);
        if(thing != this.rupees)
            changed = true;

        thing = this.sword;
        this.sword = emulator.rdramRead8(addresses.INV_SWORD);
        if(thing != this.sword)
            changed = true;

        thing = this.triforces;
        this.triforces = emulator.rdramRead8(addresses.INV_TRIFORCE);
        if(thing != this.triforces)
            changed = true;
        
        switch(emulator.rdramRead8(addresses.INV_MGCRING))
        {
            default:
                this.tunicCol = TunicCol.Green as number;
            break;
            case Upgrade2.None as number:
                this.tunicCol = TunicCol.Green as number;
            break;
            case Upgrade2.Better as number:
                this.tunicCol = TunicCol.Blue as number;
            break;
            case Upgrade2.Best as number:
                this.tunicCol = TunicCol.Red as number;
            break;
        }
        return changed;
    }
    rewriteValues(emulator: IMemory): void {
        emulator.rdramWrite8(addresses.INV_ARROW, this.arrow);
        emulator.rdramWrite8(addresses.INV_MAXBOMB, this.bombBag);
        emulator.rdramWrite8(addresses.INV_BOMBS, this.bombs);
        emulator.rdramWrite8(addresses.INV_CANDLE, this.candle);
        emulator.rdramWrite8(addresses.INV_COMPASS, this.compass);
        emulator.rdramWrite8(addresses.INV_HEARTS, (this.containers << 4) + this.hearts);

        emulator.rdramWrite8(addresses.INV_MGCBOOK, this.hasBook ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_BOOM, this.hasBoom ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_BOW, this.hasBow ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_FOOD, this.hasFood ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_MGCKEY, this.hasKey ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_CMPLVL9, this.hasL9comp ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_MAPLVL9, this.hasL9map ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_LADDER, this.hasLadder ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_MGCBOOM, this.hasMagicBoom ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_MGCSHLD, this.hasMagicShield ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_POWER, this.hasPower ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_RAFT, this.hasRaft ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_MAGICRD, this.hasRod ? 1 : 0);
        emulator.rdramWrite8(addresses.INV_WHISTLE, this.hasWhistle ? 1 : 0);

        emulator.rdramWrite8(addresses.INV_KEYS, this.keys);
        emulator.rdramWrite8(addresses.INV_LETTER, this.letter);
        emulator.rdramWrite8(addresses.INV_MAP, this.map);
        emulator.rdramWrite8(addresses.INV_PARTHRT, this.pHeart);
        emulator.rdramWrite8(addresses.INV_POTION, this.potion);
        emulator.rdramWrite8(addresses.INV_MGCRING, this.ring);
        emulator.rdramWrite8(addresses.INV_RUPEES, this.rupees);
        emulator.rdramWrite8(addresses.INV_SWORD, this.sword);
        emulator.rdramWrite8(addresses.INV_TRIFORCE, this.triforces);
    }
}