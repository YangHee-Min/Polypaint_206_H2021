import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { RectangleSelectionService } from './rectangle-selection-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionCommand extends Command {
    selectionWidth: number;
    selectionHeight: number;
    transformValues: Vec2;
    cornerCoords: Vec2[] = [];
    selectionCanvas: HTMLCanvasElement;

    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, rectangleSelectionService: RectangleSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, rectangleSelectionService);
    }

    setValues(
        canvasContext: CanvasRenderingContext2D,
        selectionCanvas: HTMLCanvasElement,
        rectangleSelectionService: RectangleSelectionService,
    ): void {
        this.ctx = canvasContext;
        this.cornerCoords = Object.assign([], rectangleSelectionService.cornerCoords);
        this.selectionCanvas = this.cloneCanvas(selectionCanvas);
        this.selectionHeight = rectangleSelectionService.selectionHeight;
        this.selectionWidth = rectangleSelectionService.selectionWidth;
        this.transformValues = rectangleSelectionService.transformValues;
    }

    execute() {
        this.ctx.rect(this.cornerCoords[0].x, this.cornerCoords[0].y, this.selectionWidth, this.selectionHeight);
        this.ctx.strokeStyle = 'white';
        this.ctx.stroke();
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.cornerCoords[0] = {
            x: this.cornerCoords[0].x + this.transformValues.x,
            y: this.cornerCoords[0].y + this.transformValues.y,
        };
        // When implementing scaling, we will have to sum selectionWidth and selectionHeight to a
        // the distance scaled by the mouse
        this.ctx.drawImage(
            this.selectionCanvas,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
            this.cornerCoords[0].x,
            this.cornerCoords[0].y,
            this.selectionWidth,
            this.selectionHeight,
        );
    }

    cloneCanvas(selectionCanvas: HTMLCanvasElement) {
        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        //set dimensions
        newCanvas.width = selectionCanvas.width;
        console.log(newCanvas.width);
        newCanvas.height = selectionCanvas.height;
        console.log(newCanvas.height);
        //apply the old canvas to the new one
        context?.drawImage(selectionCanvas, 0, 0);

        //return the new canvas
        return newCanvas;
    }
}
