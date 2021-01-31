import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import * as CORE from './Imports';
import * as API from '../API/Imports';
import { ILink, addresses } from '../API/ILink';
import { IInventory, TunicCol, Upgrade2, Upgrade3 } from '../API/IInventory';
import { bus } from 'modloader64_api/EventHandler';
import { timeStamp } from 'console';

export class Inventory extends JSONTemplate implements IInventory
{
    private readonly link: ILink;
    private readonly emulator: IMemory;

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

    constructor(emulator: IMemory, link: ILink) {
        super();

        this.arrow = Upgrade2.None;
        this.bombs = 0;
        this.bombBag = 0;
        this.candle = Upgrade2.None;
        this.compass = 0;
        this.containers = 3;
        this.emulator = emulator;
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
        this.hearts = 0x23;
        this.keys = 0;
        this.letter = Upgrade2.None;
        this.link = link;
        this.map = 0;
        this.pHeart = 0x7F;
        this.potion = Upgrade2.None;
        this.ring = Upgrade2.None;
        this.rupees = 0;
        this.sword = Upgrade3.None;
        this.triforces = 0;
        this.tunicCol = TunicCol.Green;
    }

    refreshValues(): void {
        this.arrow = this.rdramRead8(addresses.INV_ARROW);
        this.bombBag = this.rdramRead8(addresses.INV_MAXBOMB);
        this.bombs = this.rdramRead8(addresses.INV_BOMBS);
        this.candle = this.rdramRead8(addresses.INV_CANDLE);
        this.compass = this.rdramRead8(addresses.INV_COMPASS);
        this.containers = (this.rdramRead8(addresses.INV_HEARTS) | 0xF0) >> 4;

        this.hasBook = this.rdramRead8(addresses.INV_MGCBOOK) != 0x00;
        this.hasBoom = this.rdramRead8(addresses.INV_BOOM) != 0x00;
        this.hasBow = this.rdramRead8(addresses.INV_BOW) != 0x00;
        this.hasFood = this.rdramRead8(addresses.INV_FOOD) != 0x00;
        this.hasKey = this.rdramRead8(addresses.INV_MGCKEY) != 0x00;
        this.hasL9comp = this.rdramRead8(addresses.INV_CMPLVL9) != 0x00;
        this.hasL9map = this.rdramRead8(addresses.INV_MAPLVL9) != 0x00;
        this.hasLadder = this.rdramRead8(addresses.INV_LADDER) != 0x00;
        this.hasMagicBoom = this.rdramRead8(addresses.INV_MGCBOOM) != 0x00;
        this.hasMagicShield = this.rdramRead8(addresses.INV_MGCSHLD) != 0x00;
        this.hasPower = this.rdramRead8(addresses.INV_POWER) != 0x00;
        this.hasRaft = this.rdramRead8(addresses.INV_RAFT) != 0x00;
        this.hasRod = this.rdramRead8(addresses.INV_MAGICRD) != 0x00;
        this.hasWhistle = this.rdramRead8(addresses.INV_WHISTLE) != 0x00;

        this.hearts = (this.rdramRead8(addresses.INV_HEARTS) | 0x0F) >> 4;
        this.keys = this.rdramRead8(addresses.INV_KEYS);
        this.letter = this.rdramRead8(addresses.INV_LETTER);
        this.map = this.rdramRead8(addresses.INV_MAP);
        this.pHeart = this.rdramRead8(addresses.INV_PARTHRT);
        this.potion = this.rdramRead8(addresses.INV_POTION);
        this.ring = this.rdramRead8(addresses.INV_MGCRING);
        this.rupees = this.rdramRead8(addresses.INV_RUPEES);
        this.sword = this.rdramRead8(addresses.INV_SWORD);
        this.triforces = this.rdramRead8(addresses.INV_TRIFORCE);
        switch(this.rdramRead8(addresses.INV_MGCRING))
        {
            default:
                this.tunicCol = TunicCol.Green;
            break;
            case Upgrade2.None:
                this.tunicCol = TunicCol.Green;
            break;
            case Upgrade2.Better:
                this.tunicCol = TunicCol.Blue;
            break;
            case Upgrade2.Best:
                this.tunicCol = TunicCol.Red;
            break;
        }
    }
    rewriteValues(): void {
        this.rdramWrite8(addresses.INV_ARROW, this.arrow);
        this.rdramWrite8(addresses.INV_MAXBOMB, this.bombBag);
        this.rdramWrite8(addresses.INV_BOMBS, this.bombs);
        this.rdramWrite8(addresses.INV_CANDLE, this.candle);
        this.rdramWrite8(addresses.INV_COMPASS, this.compass);
        this.rdramWrite8(addresses.INV_HEARTS, (this.containers << 4) + this.hearts);

        this.rdramWrite8(addresses.INV_MGCBOOK, this.hasBook ? 1 : 0);
        this.rdramWrite8(addresses.INV_BOOM, this.hasBoom ? 1 : 0);
        this.rdramWrite8(addresses.INV_BOW, this.hasBow ? 1 : 0);
        this.rdramWrite8(addresses.INV_FOOD, this.hasFood ? 1 : 0);
        this.rdramWrite8(addresses.INV_MGCKEY, this.hasKey ? 1 : 0);
        this.rdramWrite8(addresses.INV_CMPLVL9, this.hasL9comp ? 1 : 0);
        this.rdramWrite8(addresses.INV_MAPLVL9, this.hasL9map ? 1 : 0);
        this.rdramWrite8(addresses.INV_LADDER, this.hasLadder ? 1 : 0);
        this.rdramWrite8(addresses.INV_MGCBOOM, this.hasMagicBoom ? 1 : 0);
        this.rdramWrite8(addresses.INV_MGCSHLD, this.hasMagicShield ? 1 : 0);
        this.rdramWrite8(addresses.INV_POWER, this.hasPower ? 1 : 0);
        this.rdramWrite8(addresses.INV_RAFT, this.hasRaft ? 1 : 0);
        this.rdramWrite8(addresses.INV_MAGICRD, this.hasRod ? 1 : 0);
        this.rdramWrite8(addresses.INV_WHISTLE, this.hasWhistle ? 1 : 0);

        this.rdramWrite8(addresses.INV_KEYS, this.keys);
        this.rdramWrite8(addresses.INV_LETTER, this.letter);
        this.rdramWrite8(addresses.INV_MAP, this.map);
        this.rdramWrite8(addresses.INV_PARTHRT, this.pHeart);
        this.rdramWrite8(addresses.INV_POTION, this.potion);
        this.rdramWrite8(addresses.INV_MGCRING, this.ring);
        this.rdramWrite8(addresses.INV_RUPEES, this.rupees);
        this.rdramWrite8(addresses.INV_SWORD, this.sword);
        this.rdramWrite8(addresses.INV_TRIFORCE, this.triforces);
    }

    bitCount8(value: number): number {
        return this.emulator.bitCount8(value);
    }
    bitCount16(value: number): number {
        return this.emulator.bitCount16(value);
    }
    bitCount32(value: number): number {
        return this.emulator.bitCount32(value);
    }
    bitCountBuffer(buf: Buffer, off: number, len: number): number {
        return this.emulator.bitCountBuffer(buf, off, len);
    }
    getRdramBuffer(): Buffer {
        return this.emulator.getRdramBuffer() as Buffer;
    }

    invalidateCachedCode(): void {
    }

    rdramRead8(addr: number): number {
        return this.emulator.rdramRead8(addr);
    }
    rdramWrite8(addr: number, value: number): void {
        this.emulator.rdramWrite8(addr, value);
    }
    rdramRead16(addr: number): number {
        return this.emulator.rdramRead16(addr);
    }
    rdramWrite16(addr: number, value: number): void {
        this.emulator.rdramWrite16(addr, value);
    }
    rdramWrite32(addr: number, value: number): void {
        this.emulator.rdramWrite32(addr, value);
    }
    rdramRead32(addr: number): number {
        return this.emulator.rdramRead32(addr);
    }
    rdramReadBuffer(addr: number, size: number): Buffer {
        return this.emulator.rdramReadBuffer(addr, size);
    }
    rdramWriteBuffer(addr: number, buf: Buffer): void {
        this.emulator.rdramWriteBuffer(addr, buf);
    }
    dereferencePointer(addr: number): number {
        return this.emulator.dereferencePointer(addr);
    }
    rdramReadS8(addr: number): number {
        return this.emulator.rdramReadS8(addr);
    }
    rdramReadS16(addr: number): number {
        return this.emulator.rdramReadS16(addr);
    }
    rdramReadS32(addr: number): number {
        return this.emulator.rdramReadS32(addr);
    }
    rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
        return this.emulator.rdramReadBitsBuffer(addr, bytes);
    }
    rdramReadBits8(addr: number): Buffer {
        return this.emulator.rdramReadBits8(addr);
    }
    rdramReadBit8(addr: number, bitoffset: number): boolean {
        return this.emulator.rdramReadBit8(addr, bitoffset);
    }
    rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
        this.emulator.rdramWriteBitsBuffer(addr, buf);
    }
    rdramWriteBits8(addr: number, buf: Buffer): void {
        this.emulator.rdramWriteBits8(addr, buf);
    }
    rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
        this.emulator.rdramWriteBit8(addr, bitoffset, bit);
    }
    rdramReadPtr8(addr: number, offset: number): number {
        return this.emulator.rdramReadPtr8(addr, offset);
    }
    rdramWritePtr8(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtr8(addr, offset, value);
    }
    rdramReadPtr16(addr: number, offset: number): number {
        return this.emulator.rdramReadPtr16(addr, offset);
    }
    rdramWritePtr16(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtr16(addr, offset, value);
    }
    rdramWritePtr32(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtr32(addr, offset, value);
    }
    rdramReadPtr32(addr: number, offset: number): number {
        return this.emulator.rdramReadPtr32(addr, offset);
    }
    rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
        return this.emulator.rdramReadPtrBuffer(addr, offset, size);
    }
    rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
        this.emulator.rdramWritePtrBuffer(addr, offset, buf);
    }
    rdramReadPtrS8(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrS8(addr, offset);
    }
    rdramReadPtrS16(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrS16(addr, offset);
    }
    rdramReadPtrS32(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrS32(addr, offset);
    }
    rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
        return this.emulator.rdramReadPtrBitsBuffer(
            addr,
            offset,
            bytes
        );
    }
    rdramReadPtrBits8(addr: number, offset: number): Buffer {
        return this.emulator.rdramReadPtrBits8(addr, offset);
    }
    rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
        return this.emulator.rdramReadPtrBit8(
            addr,
            offset,
            bitoffset
        );
    }
    rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
        this.emulator.rdramWritePtrBitsBuffer(addr, offset, buf);
    }
    rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
        this.emulator.rdramWritePtrBits8(addr, offset, buf);
    }
    rdramWritePtrBit8(
        addr: number,
        offset: number,
        bitoffset: number,
        bit: boolean
    ): void {
        this.emulator.rdramWritePtrBit8(
            addr,
            offset,
            bitoffset,
            bit
        );
    }
    rdramReadF32(addr: number): number {
        return this.emulator.rdramReadF32(addr);
    }
    rdramReadPtrF32(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrF32(addr, offset);
    }
    rdramWriteF32(addr: number, value: number): void {
        this.emulator.rdramWriteF32(addr, value);
    }
    rdramWritePtrF32(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtrF32(addr, offset, value);
    }

    memoryDebugLogger(bool: boolean): void { }
}