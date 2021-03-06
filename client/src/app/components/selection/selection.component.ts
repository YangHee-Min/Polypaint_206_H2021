import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { ResizerDown } from '@app/constants/resize-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';

@Component({
    selector: 'app-selection',
    templateUrl: './selection.component.html',
    styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements AfterViewInit {
    @ViewChild('leftResizer', { static: false }) private leftResizer: ElementRef<HTMLElement>;
    @ViewChild('rightResizer', { static: false }) private rightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomResizer', { static: false }) private bottomResizer: ElementRef<HTMLElement>;
    @ViewChild('topResizer', { static: false }) private topResizer: ElementRef<HTMLElement>;
    @ViewChild('topLeftResizer', { static: false }) private topLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('topRightResizer', { static: false }) private topRightResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomLeftResizer', { static: false }) private bottomLeftResizer: ElementRef<HTMLElement>;
    @ViewChild('bottomRightResizer', { static: false }) private bottomRightResizer: ElementRef<HTMLElement>;

    @ViewChild('selectionCanvas', { static: false }) private selectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('borderCanvas', { static: false }) private borderCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewSelectionCanvas', { static: false }) private previewSelectionCanvasRef: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionBox', { static: false }) private selectionContainer: ElementRef<HTMLCanvasElement>;
    selectionCanvas: HTMLCanvasElement;
    borderCanvas: HTMLCanvasElement;
    previewSelectionCanvas: HTMLCanvasElement;
    // Not present on dom, used as reference to store outline
    private outlineSelectionCanvas: HTMLCanvasElement;

    private outlineSelectionCtx: CanvasRenderingContext2D;
    private selectionCtx: CanvasRenderingContext2D;
    private borderCtx: CanvasRenderingContext2D;
    previewSelectionCtx: CanvasRenderingContext2D;

    private resizerDown: ResizerDown;
    initialPosition: Vec2;
    bottomRight: Vec2;

    constructor(
        private magnetismService: MagnetismService,
        private drawingService: DrawingService,
        private shortcutManager: ShortcutManagerService,
        public resizerHandlerService: ResizerHandlerService,
    ) {
        this.initialPosition = { x: 0, y: 0 };
        this.bottomRight = { x: 0, y: 0 };
    }

    ngAfterViewInit(): void {
        this.assignCanvasValues();
        this.assignContextValues();
        this.propagateValuesToDrawingService();
        this.assignResizerHandlerServiceValues();
        this.drawingService.canvasSizeSubject.asObservable().subscribe((size) => {
            this.resizeContainer(size[0], size[1]);
        });

        this.magnetismService.previewSelectionCanvas = this.previewSelectionCanvas;
    }

    onCanvasMove(didCanvasMove: boolean): void {
        if (!didCanvasMove) return;
        this.setCanvasPosition();
    }

    setCanvasPosition(): void {
        const transformValues = this.getTransformValues(this.previewSelectionCanvas);
        this.magnetismService.transformValues = transformValues;
        if (this.magnetismService.isMagnetismOn) {
            const magnetizedCoords: Vec2 = this.magnetismService.magnetizeSelection();
            this.selectionCanvas.style.left = magnetizedCoords.x + 'px';
            this.selectionCanvas.style.top = magnetizedCoords.y + 'px';
        } else {
            this.selectionCanvas.style.left = parseInt(this.previewSelectionCanvas.style.left, 10) + transformValues.x + 'px';
            this.selectionCanvas.style.top = parseInt(this.previewSelectionCanvas.style.top, 10) + transformValues.y + 'px';
        }
        this.resizerHandlerService.setResizerPositions(this.selectionCanvas);
        this.borderCanvas.style.left = this.selectionCanvas.style.left;
        this.borderCanvas.style.top = this.selectionCanvas.style.top;
    }

    resetPreviewSelectionCanvas(event: CdkDragEnd): void {
        this.previewSelectionCanvas.style.left = this.borderCanvas.style.left = this.selectionCanvas.style.left;
        this.previewSelectionCanvas.style.top = this.borderCanvas.style.top = this.selectionCanvas.style.top;
        event.source._dragRef.reset();
    }

    drawPreview(event: CdkDragMove): void {
        if (this.resizerHandlerService.inUse) {
            this.resizerHandlerService.resize(event);
            this.resizerHandlerService.setResizerPositions(this.previewSelectionCanvas);
            this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);
            this.drawWithScalingFactors(this.borderCtx, this.outlineSelectionCanvas);
            this.selectionCanvas.style.visibility = 'hidden';
        }
    }

    resizeSelectionCanvas(event: CdkDragEnd): void {
        if (!this.resizerHandlerService.inUse) return;
        this.resizerHandlerService.inUse = false;
        event.source._dragRef.reset();
        this.selectionCanvas.style.visibility = 'visible';

        // Save drawing to preview canvas before drawing is wiped due to resizing
        this.drawWithScalingFactors(this.previewSelectionCtx, this.selectionCanvas);
        this.drawWithScalingFactors(this.borderCtx, this.outlineSelectionCanvas);

        this.recalibrateCanvas();

        // Clear the contents of the selectionCtx before redrawing the scaled image
        this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);

        // Canvas resize wipes drawing -> copy drawing from preview layer to base layer
        this.selectionCtx.drawImage(this.previewSelectionCanvas, 0, 0);
        this.drawWithScalingFactors(this.borderCtx, this.outlineSelectionCanvas);
        this.previewSelectionCtx.clearRect(0, 0, this.previewSelectionCanvas.width, this.previewSelectionCanvas.height);
    }

    drawWithScalingFactors(targetContext: CanvasRenderingContext2D, sourceCanvas: HTMLCanvasElement): void {
        const scalingFactors = this.getScalingFactors();
        targetContext.scale(scalingFactors[0], scalingFactors[1]);
        targetContext.drawImage(sourceCanvas, 0, 0, scalingFactors[0] * targetContext.canvas.width, scalingFactors[1] * targetContext.canvas.height);
    }

    setInitialValues(resizer: number): void {
        this.outlineSelectionCanvas.width = this.borderCanvas.width;
        this.outlineSelectionCanvas.height = this.borderCanvas.height;
        this.outlineSelectionCtx.drawImage(this.borderCanvas, 0, 0);
        this.resizerHandlerService.inUse = true;
        this.resizerDown = resizer;
        this.initialPosition = { x: parseInt(this.previewSelectionCanvas.style.left, 10), y: parseInt(this.previewSelectionCanvas.style.top, 10) };
        this.bottomRight = {
            x: this.initialPosition.x + this.previewSelectionCanvas.width,
            y: this.initialPosition.y + this.previewSelectionCanvas.height,
        };
        this.resizerHandlerService.setResizeStrategy(this.resizerDown);
    }

    applyFocusOutlineStyle(): void {
        this.borderCanvas.style.outline = '1px solid black';
    }

    applyFocusOutOutlineStyle(): void {
        this.borderCanvas.style.outline = '1px dashed black';
    }

    @HostListener('window:keydown.shift')
    onShiftKeyDown(): void {
        this.shortcutManager.selectionOnShiftKeyDown(this);
    }

    @HostListener('window:keyup.shift', ['$event'])
    onShiftKeyUp(): void {
        this.shortcutManager.selectionOnShiftKeyUp(this);
    }

    @HostListener('keyup.ArrowLeft', ['$event'])
    @HostListener('keyup.ArrowDown', ['$event'])
    @HostListener('keyup.ArrowRight', ['$event'])
    @HostListener('keyup.ArrowUp', ['$event'])
    correctPreviewCanvasPosition(): void {
        this.previewSelectionCanvas.style.left = this.borderCanvas.style.left = this.selectionCanvas.style.left;
        this.previewSelectionCanvas.style.top = this.borderCanvas.style.top = this.selectionCanvas.style.top;
    }

    private getTransformValues(element: HTMLElement): Vec2 {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        return {
            x: matrix.m41,
            y: matrix.m42,
        };
    }

    private resizeContainer(width: number, height: number): void {
        this.selectionContainer.nativeElement.style.width = width + 'px';
        this.selectionContainer.nativeElement.style.height = height + 'px';
    }

    private getScalingFactors(): number[] {
        const scalingFactors = [1, 1];
        scalingFactors[0] = this.getWidthScalingFactor();
        scalingFactors[1] = this.getHeightScalingFactor();
        return scalingFactors;
    }

    private getWidthScalingFactor(): number {
        const leftResizers = [ResizerDown.Left, ResizerDown.TopLeft, ResizerDown.BottomLeft];
        const rightResizers = [ResizerDown.Right, ResizerDown.TopRight, ResizerDown.BottomRight];
        if (rightResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.left, 10) !== this.initialPosition.x) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        } else if (leftResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.left, 10) === this.bottomRight.x) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    private getHeightScalingFactor(): number {
        const topResizers = [ResizerDown.Top, ResizerDown.TopLeft, ResizerDown.TopRight];
        const bottomResizers = [ResizerDown.Bottom, ResizerDown.BottomLeft, ResizerDown.BottomRight];
        if (bottomResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.top, 10) !== this.initialPosition.y) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        } else if (topResizers.includes(this.resizerDown) && parseInt(this.previewSelectionCanvas.style.top, 10) === this.bottomRight.y) {
            // tslint:disable-next-line:no-magic-numbers
            return -1;
        }
        return 1;
    }

    private recalibrateCanvas(): void {
        this.selectionCanvas.width = this.borderCanvas.width = this.previewSelectionCanvas.width;
        this.selectionCanvas.height = this.borderCanvas.height = this.previewSelectionCanvas.height;
        this.selectionCanvas.style.left = this.borderCanvas.style.left = this.previewSelectionCanvas.style.left;
        this.selectionCanvas.style.top = this.borderCanvas.style.top = this.previewSelectionCanvas.style.top;
    }

    private assignCanvasValues(): void {
        this.selectionCanvas = this.selectionCanvasRef.nativeElement;
        this.borderCanvas = this.borderCanvasRef.nativeElement;
        this.previewSelectionCanvas = this.previewSelectionCanvasRef.nativeElement;
        this.outlineSelectionCanvas = document.createElement('canvas');
    }

    private assignContextValues(): void {
        this.selectionCtx = this.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.borderCtx = this.borderCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.previewSelectionCtx = this.previewSelectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.outlineSelectionCtx = this.outlineSelectionCanvas.getContext('2d') as CanvasRenderingContext2D;
    }

    private propagateValuesToDrawingService(): void {
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.borderCtx = this.borderCtx;
        this.drawingService.previewSelectionCtx = this.previewSelectionCtx;
        this.drawingService.selectionCanvas = this.selectionCanvasRef.nativeElement;
        this.drawingService.previewSelectionCanvas = this.previewSelectionCanvasRef.nativeElement;
        this.drawingService.borderCanvas = this.borderCanvas;
    }

    private assignResizerHandlerServiceValues(): void {
        this.resizerHandlerService.resizers
            .set(ResizerDown.TopLeft, this.topLeftResizer.nativeElement)
            .set(ResizerDown.Left, this.leftResizer.nativeElement)
            .set(ResizerDown.BottomLeft, this.bottomLeftResizer.nativeElement)
            .set(ResizerDown.Bottom, this.bottomResizer.nativeElement)
            .set(ResizerDown.BottomRight, this.bottomRightResizer.nativeElement)
            .set(ResizerDown.Right, this.rightResizer.nativeElement)
            .set(ResizerDown.TopRight, this.topRightResizer.nativeElement)
            .set(ResizerDown.Top, this.topResizer.nativeElement);

        this.resizerHandlerService.assignComponent(this);
    }
}
