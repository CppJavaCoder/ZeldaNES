import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import * as CORE from './Imports';
import * as API from '../API/Imports';
import { addresses } from '../API/ILink';
import { Sprite } from './Sprite';
import { bus } from 'modloader64_api/EventHandler';
import { timeStamp } from 'console';
import { Inventory } from './Inventory';

export class Link extends JSONTemplate implements API.ILink {
    private readonly emulator: IMemory;
    sprite: API.ISprite;

    xpos: number;
    ypos: number;
    yclip: number;
    setypos: number;
    frame: number;
    inOverworld: boolean;
    goingDown: boolean;
    tunicCol: number;

    fixedClip: boolean;
    updatedVisibility: boolean;

    inventory: API.IInventory;

    blinker: number;
    stateChanged: boolean;
    state: number;
    worldPos: number;

    tunicColor: API.TunicColors;

    constructor(emulator: IMemory) {
        super();
        this.emulator = emulator
        this.sprite = new CORE.Sprite("mods/Link.bmp",16,16,4,4);
        this.sprite.showSprite(true);
        this.xpos = 0xFF;
        this.ypos = 0xFF;
        this.sprite.setPos(this.xpos,this.ypos);
        this.yclip = 0;
        this.inOverworld = true;
        this.goingDown = true;
        this.frame = 0;
        this.fixedClip = false;
        this.setypos = 0;
        this.updatedVisibility = false;
        this.tunicCol = API.TunicCol.Green;
        this.inventory = new CORE.Inventory(emulator,this);
        this.blinker = 0;
        this.state = 0;
        this.stateChanged = false;
        this.worldPos = 0;
        this.tunicColor = API.TunicColors.Green;
    }

    getWorldPos(): number {
        return this.worldPos;
    }
    getInOverworld(): boolean {
        return this.inOverworld;
    }

    getTunicColor(): API.TunicColors {
        return this.tunicColor;
    }

    update(): void {
        let changed: number = this.state;
        this.state = this.rdramRead8(addresses.GAMEMODE);
        this.stateChanged = this.state != changed;
        if(this.state <= 0x01)
        {
            this.sprite.showSprite(false);
            return;
        }
        this.inventory.refreshValues();
        this.tunicUpdate();

        this.frameUpdate();

        this.updatedVisibility = this.visibleUpdate();

        if(this.posUpdate())
        {
            this.worldPos = this.rdramRead8(addresses.WORLD_POS);
        }
        this.clipUpdate();
        //Move link off of the screen so we can draw our own
        this.clearPositionData();
    }

    tunicUpdate(): boolean {
        let oldTC = this.tunicCol;
        this.tunicCol = this.rdramRead8(addresses.TUNIC_COL);
        let bTime: number = this.blinker;
        this.blinker = this.rdramRead8(addresses.BLINKTIMER);
        if(this.rdramRead8(addresses.DEATHTIMER) >= 0x7B)
        {
            this.tunicColor = API.TunicColors.Death;
            this.sprite.replaceColor(248,240,200,128,128,128);
            this.sprite.replaceColor(0,0,0,64,64,64);
            this.sprite.replaceColor(56,224,128,96,96,96);

            return true;
        }
        if(oldTC != this.tunicCol || bTime != this.blinker || this.stateChanged)
        {

            this.sprite.replaceColor(248,240,200,248,240,200);
            this.sprite.replaceColor(0,0,0,0,0,0);
            if(this.tunicCol == API.TunicCol.Blue)
            {
                this.sprite.replaceColor(56,224,128,128,56,244);
                this.tunicColor = API.TunicColors.Blue;
            }
            else if(this.tunicCol == API.TunicCol.Red)
            {
                this.sprite.replaceColor(56,224,128,244,56,128);
                this.tunicColor = API.TunicColors.Red;
            }
            else
            {
                this.tunicColor = API.TunicColors.Green;
                this.sprite.replaceColor(56,224,128,56,224,128);
            }
            if(this.blinker > 0)
            {
                switch(((this.rdramRead8(addresses.BLINKTIMER)-1)/2) % 4)
                {
                    case 0:
                        this.tunicColor = API.TunicColors.InjuredA;
                        this.sprite.replaceColor(56,224,128,1,1,1);
                        this.sprite.replaceColor(248,240,200,128,0,0);
                        this.sprite.replaceColor(0,0,0,0,0,128);
                    break;
                    case 1:
                        this.tunicColor = API.TunicColors.InjuredB;
                        this.sprite.replaceColor(56,224,128,224,128,56);
                        this.sprite.replaceColor(0,0,0,255,255,255);
                    break;
                    case 2:
                        this.tunicColor = API.TunicColors.InjuredC;
                        this.sprite.replaceColor(56,224,128,56,128,224);
                        this.sprite.replaceColor(0,0,0,255,255,255);
                    break;
                }
            }
            return true;
        }
        return false;
    }

    clipUpdate(): boolean {
        let oyclip: number = this.yclip;

        let oio: boolean = this.inOverworld;
        this.inOverworld = this.rdramRead8(addresses.INOVERWORLD) == 0x01;

        if(oio != this.inOverworld)
        {
            this.setypos = this.ypos;
        }

        if(this.rdramRead8(addresses.LINK_FRAME) == 0x78 || this.inOverworld || this.rdramRead8(addresses.INBASEMENT) == 0x40 || this.rdramRead8(addresses.INOVERWORLD) == 0x40)
            this.fixedClip = false;
        else
            this.fixedClip = true;

        if(this.fixedClip && this.rdramRead8(addresses.HEARTS) != 0)
            this.yclip = (this.setypos - this.ypos)+1;
        else
            this.yclip = 0;

        let xclip: number = 0;
        let wclip: number = 0;

        //If we're not in the overworld, do sidewall clipping
        if(this.rdramRead8(addresses.INLEVEL) != 0x00)
        {
            if(this.xpos < 16)
                xclip = (16-this.xpos);
            if(this.xpos > 256-32)
                wclip = -(this.xpos - (256 - 32));
        }
        
        if(oyclip != this.yclip || xclip != this.sprite.getClipX() || wclip != this.sprite.getClipW())
        {
            this.sprite.clip(xclip,0,wclip-xclip,this.yclip);
            return true;
        }

        return false;
    }

    posUpdate(): boolean {
        if(this.rdramRead8(0x00248) == 0xFF)
            return false;
        
        this.xpos = this.rdramRead8(addresses.LINK_X)
        this.ypos = this.rdramRead8(addresses.LINK_Y) - 8;

        if(this.xpos != this.sprite.xpos || this.ypos != this.sprite.ypos)
        {
            this.sprite.setPos(this.xpos,this.ypos);
            return true;
        }

        return false;
    }

    clearPositionData(): void {
        this.rdramWriteBuffer(0x00248,Buffer.from('ffffffffffffffff','hex'));
    }

    visibleUpdate(): boolean {
        let altered: boolean = this.sprite.isShown();
        if(this.rdramRead8(addresses.ISDRAWING) > 0x00)
        {
            if(altered != true)
            {
                this.sprite.showSprite(true);
                return true;
            }
        }
        else
        {
            if(altered != false)
            {
                this.sprite.showSprite(false);
                return true;
            }
        }
        return false;
    }

    frameUpdate(): boolean {
        if(this.rdramRead8(addresses.LINK_FRAME) == 0xFF)
            return false;
        this.frame = this.rdramRead8(addresses.LINK_FRAME);
        let sprFrame: number = 0;
        switch(this.frame)
        {
            default:
            break;
            case 0x78://Award!
                sprFrame = 3;
            break;
            case 0x62://Death 1
                sprFrame = 7;
            break;
            case 0x64://Death2
                sprFrame = 11;
            break;
            case 0x0C://Step 1 North
                sprFrame = 1;
            break;
            case 0x0D://Step 2 North
                sprFrame = 0;
            break;
            case 0x18://Attack North
                sprFrame = 2;
            break;
            case 0x00://Step 1 East
                sprFrame = 5;
            break;
            case 0x04://Step 2 East
                sprFrame = 4;
            break;
            case 0x10://Attack East
                sprFrame = 6;
            break;
            case 0x58://Step 1 South
                sprFrame = 9;
            break;
            case 0x5A://Step 2 South
                sprFrame = 8;
            break;
            case 0x14://Attack West
                sprFrame = 10;
            break;
            case 0x02://Step 1 West
                sprFrame = 13;
            break;
            case 0x06://Step 2 West
                sprFrame = 12;
            break;
            case 0x12://Attack South
                sprFrame = 14;
            break;
            }
        if(sprFrame != this.sprite.frame)
        {
            this.sprite.setFrame(sprFrame);
            return true;
        }

        return false;
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