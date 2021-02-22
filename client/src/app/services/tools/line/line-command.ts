import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { ENDING_POINT, STARTING_POINT } from '@app/constants/line-constants';
import { LineService } from './line-service';

export class LineCommand extends Command {
    private withJunction: boolean;
    private junctionRadius: number;
    private lineWidth: number;
    private primaryColor: string;
    private path: Vec2[] = [];

    constructor(canvasContext: CanvasRenderingContext2D, private lineService: LineService) {
        super(canvasContext);
        this.path[LineConstants.STARTING_POINT] = lineService.linePathData[STARTING_POINT];
        this.path[LineConstants.ENDING_POINT] = lineService.linePathData[ENDING_POINT];

        this.withJunction = lineService.withJunction;
        this.junctionRadius = lineService.junctionRadius;
        this.lineWidth = lineService.lineWidth;
        this.primaryColor = lineService.primaryColor;
    }

    execute(): void {
        this.lineService.drawLine(this.ctx, this.path, this.withJunction, this.junctionRadius, this.lineWidth, this.primaryColor);
    }

    /*private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        if (this.withJunction) {
            ctx.arc(
                path[LineConstants.ENDING_POINT].x,
                path[LineConstants.ENDING_POINT].y,
                this.junctionRadius,
                LineConstants.DEGREES_0,
                LineConstants.DEGREES_360,
            );
            ctx.fillStyle = this.primaryColor;
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(path[LineConstants.STARTING_POINT].x, path[LineConstants.STARTING_POINT].y);
        ctx.lineTo(path[LineConstants.ENDING_POINT].x, path[LineConstants.ENDING_POINT].y);
        ctx.strokeStyle = this.primaryColor;
        ctx.stroke();
    }*/
}
