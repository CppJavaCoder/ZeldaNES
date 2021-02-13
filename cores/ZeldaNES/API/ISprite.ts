import IMemory from 'modloader64_api/IMemory';
import * as CORE from '../src/Imports';
import * as API from '../API/Imports';

export interface ISprite {
    xpos: number;
    ypos: number;
    w: number;
    h: number;
    frame: number;

    clipX: number;
    clipY: number;
    clipW: number;
    clipH: number;

    shown: boolean;

    showSprite(show: boolean): void;
    setPos(x: number, y: number): void;
    setFrame(frame: number): void;
    clip(x: number, y: number, w: number, h: number): void;
    replaceColor(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): void;
}