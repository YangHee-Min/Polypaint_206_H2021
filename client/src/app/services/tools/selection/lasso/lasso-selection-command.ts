import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { LassoSelectionService } from './lasso-selection';
export class LassoSelectionCommand extends Command {
    selectionWidth: number;
    selectionHeight: number;
    transformValues: Vec2;
    topLeft: Vec2;
    pathData: Vec2[];
    selectionCanvas: HTMLCanvasElement;
    isFromClipboard: boolean;

    constructor(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, lassoSelectionService: LassoSelectionService) {
        super();
        this.setValues(canvasContext, selectionCanvas, lassoSelectionService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, selectionCanvas: HTMLCanvasElement, lassoSelectionService: LassoSelectionService): void {
        this.ctx = canvasContext;
        this.selectionCanvas = this.cloneCanvas(selectionCanvas);
        this.pathData = Object.assign([], lassoSelectionService.pathData);
        this.selectionHeight = selectionCanvas.height;
        this.selectionWidth = selectionCanvas.width;
        this.transformValues = lassoSelectionService.transformValues;
        this.topLeft = lassoSelectionService.topLeft;
        this.isFromClipboard = lassoSelectionService.isFromClipboard;
    }

    execute(): void {
        if (!this.isFromClipboard) {
            this.fillLasso(this.ctx, this.pathData, 'white');
        }
        this.ctx.drawImage(
            this.selectionCanvas,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
            this.transformValues.x,
            this.transformValues.y,
            this.selectionWidth,
            this.selectionHeight,
        );
    }

    private fillLasso(ctx: CanvasRenderingContext2D, pathData: Vec2[], color: string): void {
        ctx.beginPath();
        ctx.moveTo(pathData[0].x, pathData[0].y);
        for (const point of pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.save();
        ctx.clip();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }
}
