import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import * as CORE from './Imports';
import * as API from '../API/Imports';
import { bus } from 'modloader64_api/EventHandler';


export class Sprite implements API.ISprite {
    xpos: number;
    ypos: number;
    rows: number;
    cols: number;
    w: number;
    h: number;
    frame: number;
    shown: boolean;

    id: number;
    private static _id: number = 0;

    clipX: number;
    clipY: number;
    clipW: number;
    clipH: number;

    constructor(fname: string, w: number, h: number, cols: number, rows:number)
    {
        this.w = w;
        this.h = h;
        this.xpos = 0;
        this.ypos = 0;
        this.rows = rows;
        this.cols = cols;
        this.frame = 0;
        this.shown = false;
        this.clipX = this.clipY = this.clipW = this.clipH = 0;
        this.id = Sprite._id;
        Sprite._id++;
        bus.emit("create-sprite",fname,w,h,cols,rows);
    }
    showSprite(show: boolean): void {
        this.shown = show;
        bus.emit("fg-sprite",this.id,show)
    }
    setPos(x: number, y: number): void {
        this.xpos = x;
        this.ypos = y;
        bus.emit("move-sprite",this.id,x,y);
    }
    setFrame(frame: number): void {
        this.frame = frame;
        bus.emit("frame-sprite",this.id,frame)
    }
    clip(x: number, y: number, w: number, h: number)
    {
        this.clipX = x;
        this.clipY = y;
        this.clipW = w;
        this.clipH = h;
        bus.emit("clip-sprite",this.id,x,y,w,h);
    }
    isShown(): boolean
    {
        return this.shown;
    }
    getX(): number
    {
        return this.xpos;
    }
    getY(): number
    {
        return this.ypos;
    }
    getW(): number
    {
        return this.w;
    }
    getH(): number
    {
        return this.h;
    }
    getFrame(): number
    {
        return this.frame;
    }
    getClipX(): number
    {
        return this.clipX;
    }
    getClipY(): number
    {
        return this.clipY;
    }
    getClipW(): number
    {
        return this.clipW;
    }
    getClipH(): number
    {
        return this.clipH;
    }
    replaceColor(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): void {
        bus.emit("recolor-sprite",this.id,r1,g1,b1,r2,g2,b2);
    }
}