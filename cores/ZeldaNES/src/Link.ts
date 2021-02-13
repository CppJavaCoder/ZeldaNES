import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import * as CORE from './Imports';
import * as API from '../API/Imports';
import { addresses, Direction, GameMode } from '../API/ILink';
import { bus } from 'modloader64_api/EventHandler';
import { timeStamp } from 'console';
import { timingSafeEqual } from 'crypto';
import { Dir } from 'fs';

export class Link extends JSONTemplate implements API.ILink {
    private readonly emulator: IMemory;
    sprite: API.ISprite;

    jsonFields: string[] = ['x', 'y'];

    xpos: number;
    ypos: number;
    yclip: number;
    setypos: number;
    frame: number;
    inOverworld: boolean;
    goingDown: boolean;
    tunicCol: number;

    fixedClip: boolean;
    wasShownChanged: boolean;

    inventory: API.IInventory;

    blinker: number;
    stateChanged: boolean;
    state: number;
    worldPos: number;

    tunicColor: API.TunicColors;

    wasTunicChanged: boolean;
    wasPosChanged: boolean;
    wasFrameChanged: boolean;
    wasInventoryChanged: boolean;
    wasClipChanged: boolean;
    wasWorldPosChange: boolean;
    scrollDirection: number;

    constructor(emulator: IMemory) {
        super();
        this.emulator = emulator
        this.sprite = new CORE.Sprite("mods/Link.bmp",16,16,4,8);
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
        this.wasShownChanged = false;
        this.tunicCol = API.TunicCol.Green;
        this.inventory = new CORE.Inventory();
        this.blinker = 0;
        this.state = 0;
        this.stateChanged = false;
        this.worldPos = 0;
        this.tunicColor = API.TunicColors.Green;
        this.wasTunicChanged = false;
        this.wasPosChanged = false;
        this.wasFrameChanged = false;
        this.wasInventoryChanged = false;
        this.wasClipChanged = false;
        this.wasWorldPosChange = false;
        this.scrollDirection = 0;
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
        this.wasTunicChanged = this.tunicUpdate();
        this.wasFrameChanged = this.frameUpdate();

        this.wasShownChanged = this.visibleUpdate();
        this.wasPosChanged = this.posUpdate();

        let thing = this.scrollDirection;

        this.scrollDirection = this.rdramRead8(addresses.SCROLL_DIR);
        if(this.wasFrameChanged || this.wasPosChanged)
        {
            if(this.inventory.refreshValues(this.emulator))
            {
                this.wasInventoryChanged = true;
                //Inventory updated
            }
        }

        if(thing != this.scrollDirection && this.scrollDirection == Direction.None)
        {
            let tmp = this.worldPos;
            this.worldPos = this.rdramRead8(addresses.WORLD_POS);
            if(this.worldPos != tmp)
                this.wasWorldPosChange = true;
        }
        this.wasClipChanged = this.clipUpdate();
        //Move link off of the screen so we can draw our own
        this.clearPositionData();
    }

    tunicColFromRing(val: number): number {
        if(val == 0)
            return API.TunicCol.Green;
        else if(val == 2)
            return API.TunicCol.Red;
        else if(val == 1)
            return API.TunicCol.Blue;
        return API.TunicCol.Green;
    }

    rewriteInventory(): void {
        this.inventory.rewriteValues(this.emulator);
    }

    tunicUpdate(): boolean {
        let oldTC = this.tunicCol;
        this.tunicCol = this.tunicColFromRing(this.rdramRead8(addresses.INV_MGCRING));
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
                this.tunicColor = API.TunicColors.Blue;
                this.sprite.replaceColor(56,224,128,128,56,244);
            }
            else if(this.tunicCol == API.TunicCol.Red)
            {
                this.tunicColor = API.TunicColors.Red;
                this.sprite.replaceColor(56,224,128,244,56,128);
            }
            else if(this.tunicCol == API.TunicCol.Green)
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

        if(this.rdramRead8(addresses.LINK_FRAME) == 0x78 || this.inOverworld || this.rdramRead8(addresses.INBASEMENT) != 0x00 || this.rdramRead8(addresses.INOVERWORLD) == 0x40)
            this.fixedClip = false;
        else
            this.fixedClip = true;

        if(this.fixedClip && this.rdramRead8(addresses.HEARTS) != 0)
        {
            this.yclip = (this.setypos - this.ypos)+3;
            if(this.yclip > 0)
                this.yclip = 0;
        }
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
        
        if(oyclip != this.yclip || xclip != this.sprite.clipX || wclip != this.sprite.clipW)
        {
            this.sprite.clip(xclip,0,wclip-xclip,this.yclip);
            return true;
        }

        return false;
    }

    posUpdate(): boolean {
        if(this.rdramRead8(0x00248) == 0xFF)
            return this.wasPosChanged;
        
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
        let altered: boolean = this.sprite.shown;
        if(this.rdramRead8(addresses.ISDRAWING) > 0x00 && this.rdramRead8(0xE1) == 0 && this.rdramRead8(addresses.DEATHTIMER) != 0x7E && 
        this.state != API.GameMode.Elimination && this.state != API.GameMode.FileSelect &&
        this.state != API.GameMode.NameWriting && this.state != API.GameMode.StartScreen &&
        this.state != API.GameMode.Loading && this.state != API.GameMode.GameOver && 
        (this.scrollDirection == 0 || this.rdramRead8(addresses.INLEVEL) == 0))
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
            return this.wasFrameChanged;
        this.frame = this.rdramRead8(addresses.LINK_FRAME);
        let otherFrame: number = this.rdramRead8(addresses.LINK_FRAME+4);
        let sprFrame: number = 0;
        let hasShield: boolean = this.inventory.hasMagicShield;
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
                sprFrame = 1 + (hasShield ? 16 : 0);
            break;
            case 0x0D://Step 2 North
                sprFrame = 0 + (hasShield ? 16 : 0);
            break;
            case 0x18://Attack North
                sprFrame = 2;
            break;
            case 0x00://Step 1 East
                sprFrame = 5 + (hasShield ? 16 : 0);
            break;
            case 0x04://Step 2 East
                sprFrame = 4 + (hasShield ? 16 : 0);
            break;
            case 0x10://Attack East
                sprFrame = 6;
            break;
            case 0x58://Step 1 South
                sprFrame = 9 + (hasShield ? 16 : 0);
            break;
            case 0x5A://Step 2 South
                sprFrame = 8 + (hasShield ? 16 : 0);
            break;
            case 0x60:
                if(otherFrame == 0x0A)
                    sprFrame = 9 + (hasShield ? 16 : 0);
                if(otherFrame == 0x08)
                    sprFrame = 8 + (hasShield ? 16 : 0);
            break;
            case 0x14://Attack West
                sprFrame = 10;
            break;
            case 0x02://Step 1 West
            case 0x54:
                sprFrame = 13 + (hasShield ? 16 : 0);
            break;
            case 0x06://Step 2 West
            case 0x80:
                sprFrame = 12 + (hasShield ? 16 : 0);
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

    move(x: number, y: number): void
    {
        let trueX: number = this.xpos+x;
        let trueY: number = this.ypos+y;

        if(trueY < 0x3D-8)
            trueY = 0x3D-8;
        else if(trueY > 0xDD-8)
            trueY = 0xDD-8;
        if(trueX < 0x00)
            trueX = 0x00;
        else if(trueX > 0xF0)
            trueX = 0xF0;
        this.setPos(trueX,trueY);
    }
    setPos(x: number, y: number): void
    {
        let numb: number = 0x0394;
        let dir: number = this.rdramRead8(addresses.LINK_DIR);
        if(dir==API.Direction.Right||dir==API.Direction.Left)
            this.rdramWrite8(numb,x%8);
        else if(dir==API.Direction.Down||dir==API.Direction.Up)
            this.rdramWrite8(numb,((y+8)%8)-5);
        this.rdramWrite8(addresses.LINK_X,x);
        this.rdramWrite8(addresses.LINK_Y,y+8);
    }
    getCurrentLevel(): number {
        return this.rdramRead8(addresses.INLEVEL);
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