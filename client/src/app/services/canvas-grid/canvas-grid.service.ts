import { Injectable } from '@angular/core';
import * as GridConstants from '@app/constants/canvas-grid-constants';

@Injectable({
    providedIn: 'root',
})
export class CanvasGridService {
    opacityValue: number;
    squareWidth: number;
    inUse: boolean;
    gridVisibility: boolean;
    previewCtx: CanvasRenderingContext2D;

    constructor() {
        this.inUse = true;
        this.previewCtx = (document.getElementById('previewLayer') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D;
        this.setValues();
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === 'g') {
            if (!this.inUse) {
                this.clearGridOnCanvas(this.previewCtx);
                this.inUse = true;
            } else {
                this.drawGridOnCanvas(this.previewCtx);
                this.inUse = false;
            }
        }
        if (event.key === '+' || event.key === '+') {
            this.squareWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) + GridConstants.SQUARE_WIDTH_INTERVAL;
        }
        if (event.key === '-') {
            this.squareWidth = this.squareWidth - (this.squareWidth % GridConstants.SQUARE_WIDTH_INTERVAL) - GridConstants.SQUARE_WIDTH_INTERVAL;
        }
    }

    setValues(): void {
        this.opacityValue = GridConstants.DEFAULT_OPACITY;
        this.squareWidth = GridConstants.DEFAULT_SQUARE_WIDTH;
    }

    setOpacityValue(opacityValue: number): void {
        this.opacityValue = opacityValue;
    }

    setSquareWidth(squareWidth: number): void {
        this.squareWidth = squareWidth;
    }

    setVisibility(gridVisibility: boolean): void {
        this.gridVisibility = gridVisibility;
    }

    drawGridOnCanvas(ctx: CanvasRenderingContext2D): void {
        const canvasWidth = this.previewCtx.canvas.width;
        const canvasHeight = this.previewCtx.canvas.height;

        for (let i = 0; i < canvasWidth; i++) {
            ctx.moveTo(i * this.squareWidth, 0);
            ctx.lineTo(i * this.squareWidth, canvasHeight);
        }

        for (let i = 0; i < canvasHeight; i++) {
            ctx.moveTo(0, i * this.squareWidth);
            ctx.lineTo(canvasWidth, i * this.squareWidth);
        }
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    clearGridOnCanvas(ctx: CanvasRenderingContext2D): void {
        if (this.gridVisibility) {
            ctx.strokeStyle = 'white';
            ctx.stroke();
        } else {
            return;
        }
    }
}
