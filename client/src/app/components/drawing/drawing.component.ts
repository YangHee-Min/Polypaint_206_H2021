import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CursorManagerService } from '@app/services/manager/cursor-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, OnDestroy {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: CanvasConstants.DEFAULT_WIDTH, y: CanvasConstants.DEFAULT_HEIGHT };
    private previewCanvasSize: Vec2 = { x: CanvasConstants.DEFAULT_WIDTH, y: CanvasConstants.DEFAULT_HEIGHT };
    private gridCanvasSize: Vec2 = { x: CanvasConstants.DEFAULT_WIDTH, y: CanvasConstants.DEFAULT_HEIGHT };

    @Input() currentTool: Tool;
    constructor(
        private drawingService: DrawingService,
        public toolManager: ToolManagerService,
        public canvasGridService: CanvasGridService,
        public cursorManager: CursorManagerService,
    ) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.gridCtx = this.gridCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.drawingService.canvas.width = CanvasConstants.DEFAULT_WIDTH;
        this.drawingService.canvas.height = CanvasConstants.DEFAULT_HEIGHT;
        this.drawingService.previewCtx.canvas.width = CanvasConstants.DEFAULT_WIDTH;
        this.drawingService.previewCtx.canvas.height = CanvasConstants.DEFAULT_HEIGHT;
        this.drawingService.gridCtx.canvas.width = CanvasConstants.DEFAULT_WIDTH;
        this.drawingService.gridCtx.canvas.height = CanvasConstants.DEFAULT_HEIGHT;
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        this.canvasGridService.gridCtx = this.gridCtx;

        this.drawingService.canvasSizeSubject = new BehaviorSubject<number[]>([this.drawingService.canvas.width, this.drawingService.canvas.height]);
        this.drawingService.canvasSizeSubject.asObservable().subscribe((size) => {
            this.canvasGridService.resize(size[0], size[1]);
        });

        this.cursorManager.previewCanvas = this.previewCanvas.nativeElement;
        this.toolManager.currentToolSubject.asObservable().subscribe((tool) => {
            this.currentTool = tool;
            this.cursorManager.changeCursor(tool);
        });
    }

    ngOnDestroy(): void {
        this.drawingService.imageURL = '';
    }

    @HostListener('keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        this.currentTool.onKeyboardDown(event);
    }

    @HostListener('keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        this.currentTool.onKeyboardUp(event);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDoubleClick(event: MouseEvent): void {
        this.currentTool.onMouseDoubleClick(event);
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
        this.cursorManager.onMouseMove(this.currentTool.getPositionFromMouse(event));
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    @HostListener('mouseleave', ['$event'])
    onMouseLeave(event: MouseEvent): void {
        this.currentTool.onMouseLeave(event);
    }

    @HostListener('mouseenter', ['$event'])
    onMouseEnter(event: MouseEvent): void {
        this.currentTool.onMouseEnter(event);
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        this.currentTool.onMouseWheel(event);
    }

    @HostListener('contextmenu', ['$event'])
    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }

    get baseWidth(): number {
        return this.canvasSize.x;
    }

    get baseHeight(): number {
        return this.canvasSize.y;
    }

    get previewWidth(): number {
        return this.previewCanvasSize.x;
    }

    get previewHeight(): number {
        return this.previewCanvasSize.y;
    }

    get gridWidth(): number {
        return this.gridCanvasSize.y;
    }

    get gridHeight(): number {
        return this.gridCanvasSize.x;
    }
}
