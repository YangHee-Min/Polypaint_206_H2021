import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { END_ANGLE, ROTATION, START_ANGLE } from '@app/constants/ellipse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';

export class EllipseClipboardCommand extends Command {
    pathData: Vec2[];
    isCircle: boolean;

    constructor(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService) {
        super();
        this.setValues(canvasContext, clipboardService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, clipboardService: ClipboardService): void {
        this.ctx = canvasContext;
        this.pathData = Object.assign([], clipboardService.pathData);
        this.isCircle = clipboardService.isCircle;
    }

    execute(): void {
        this.fillEllipse(this.ctx, this.pathData, this.isCircle);
    }

    private fillEllipse(ctx: CanvasRenderingContext2D, pathData: Vec2[], isCircle: boolean): void {
        const ellipseCenter = this.getEllipseCenter(pathData[SelectionConstants.START_INDEX], pathData[SelectionConstants.END_INDEX], isCircle);
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;
        const radiiXAndY = this.getRadiiXAndY(this.pathData);
        const xRadius = radiiXAndY[0];
        const yRadius = radiiXAndY[1];
        ctx.beginPath();
        ctx.ellipse(startX, startY, xRadius, yRadius, ROTATION, START_ANGLE, END_ANGLE);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    private getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[SelectionConstants.END_INDEX].x - path[SelectionConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[SelectionConstants.END_INDEX].y - path[SelectionConstants.START_INDEX].y) / 2;
        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = shortestSide;
        }
        return [xRadius, yRadius];
    }

    private getEllipseCenter(start: Vec2, end: Vec2, isCircle: boolean): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;
        if (isCircle) {
            const shortestSide = Math.min(radiusX, radiusY);
            displacementX = displacementY = shortestSide;
        } else {
            displacementX = radiusX;
            displacementY = radiusY;
        }
        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }
}
