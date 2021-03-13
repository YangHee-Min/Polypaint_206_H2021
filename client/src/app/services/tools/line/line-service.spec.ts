import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LineService } from './line-service';

// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // let drawLineSpy: jasmine.Spy<any>;
    let rotateLineSpy: jasmine.Spy<any>;

    let getImageDataSpy: jasmine.Spy<any>;
    let putImageDataSpy: jasmine.Spy<any>;
    let ctxArcSpy: jasmine.Spy<any>;

    let executeSpy: jasmine.Spy;
    let previewExecuteSpy: jasmine.Spy;
    let setPreviewValuesSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineService);
        rotateLineSpy = spyOn<any>(service, 'rotateLine').and.callThrough();

        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand');
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');
        setPreviewValuesSpy = spyOn(service.previewCommand, 'setValues');

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        getImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'getImageData').and.callThrough();
        putImageDataSpy = spyOn<any>(service['drawingService'].baseCtx, 'putImageData').and.callThrough();
        ctxArcSpy = spyOn<any>(service['drawingService'].baseCtx, 'arc').and.callThrough();

        service.linePathData = [
            { x: 133, y: 256 },
            { x: 257, y: 399 },
        ];
        service.mousePosition = { x: 289, y: 400 };
        service.initialPoint = { x: 394, y: 432 };

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setPrimaryColor should correctly set primary color to wanted color', () => {
        const EXPECTED_COLOR = 'blue';
        service.setPrimaryColor(EXPECTED_COLOR);
        expect(service.primaryColor).toEqual(EXPECTED_COLOR);
    });

    it('setLineWidth should correctly set the services internal lineWidth attribute', () => {
        const newLineWidth = 50;
        service.setLineWidth(newLineWidth);
        expect(service.lineWidth).toEqual(newLineWidth);
    });

    it('setLineWidth should set to maximum value if user enters value bigger than max', () => {
        const newLineWidth = 250;
        service.setLineWidth(newLineWidth);
        expect(service.lineWidth).toEqual(LineConstants.MAX_LINE_WIDTH);
    });

    it('setLineWith should set to 1 if user enters 0', () => {
        const newLineWidth = 0;
        service.setLineWidth(newLineWidth);
        expect(service.lineWidth).toEqual(LineConstants.MIN_LINE_WIDTH);
    });

    it('setLineWidth should set to minimum value if user enters negative value', () => {
        const newLineWidth = -50;
        service.setLineWidth(newLineWidth);
        expect(service.lineWidth).toEqual(LineConstants.MIN_LINE_WIDTH);
    });

    it('setLineWidth should dynamically modify the junctionRadius size if lineWidth > junctionRadius', () => {
        const newLineWidth = 160;
        const TEST_JUNCTION_RADIUS = 90;
        service.junctionRadius = TEST_JUNCTION_RADIUS;
        service.setLineWidth(newLineWidth);
        expect(service.junctionRadius).toEqual(newLineWidth / LineConstants.MIN_JUNCTION_TO_LINE_FACTOR);
    });

    it('setJunctionRadius should set to MAX_JUNCTION if entered setting is bigger than max', () => {
        const newJunctionRadius = 250;
        service.setJunctionRadius(newJunctionRadius);
        expect(service.junctionRadius).toEqual(LineConstants.MAX_JUNCTION_RADIUS);
    });

    it('setJunctionRadius should set to lineWidth * minjunction factor if smaller than lineWidth * min_factor', () => {
        const TEST_JUNCTION_RADIUS = 40;
        service.lineWidth = TEST_JUNCTION_RADIUS;
        const newJunctionRadius = 5;
        service.setJunctionRadius(newJunctionRadius);
        expect(service.junctionRadius).toEqual(service.lineWidth / LineConstants.MIN_JUNCTION_TO_LINE_FACTOR);
    });

    it('setJunctionRadius should set to lineWidth * minjunction factor if negative value', () => {
        const TEST_JUNCTION_RADIUS = -10;
        const newJunctionRadius = TEST_JUNCTION_RADIUS;
        const TEST_LINE_WIDTH = 40;
        service.lineWidth = TEST_LINE_WIDTH;
        service.setJunctionRadius(newJunctionRadius);
        expect(service.junctionRadius).toEqual(service.lineWidth / LineConstants.MIN_JUNCTION_TO_LINE_FACTOR);
    });

    it('setJunctionRadius will set junctionRadius to max if max value exceeded', () => {
        const newJunctionRadius = 500;
        service.setJunctionRadius(newJunctionRadius);
        expect(service.junctionRadius).toEqual(LineConstants.MAX_JUNCTION_RADIUS);
    });

    it('setJunctionRadius will set junction radius to correct value', () => {
        const newJunctionRadius = 20;
        service.setJunctionRadius(newJunctionRadius);
        expect(service.junctionRadius).toEqual(newJunctionRadius);
    });

    it('setWithJunction should set to false if entered value is false', () => {
        service.withJunction = true;
        service.setWithJunction(false);
        expect(service.withJunction).toBeFalsy();
    });

    it('setWithJunction should set to true if entered value is true', () => {
        service.withJunction = false;
        service.setWithJunction(true);
        expect(service.withJunction).toBeTruthy();
    });

    it(' mouseClick should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseClick(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('keyboard down events should not do anything if user is not drawing', () => {
        const keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.inUse = false;
        expect((): void => {
            service.onKeyboardDown(keyboardEvent);
        }).not.toThrow();
    });

    it('on shift keyboard down event should call rotate line if shift key is not down and is drawing', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.shiftDown = false;
        service.inUse = true;
        service.onKeyboardDown(shiftKeyboardEvent);
        expect(rotateLineSpy).toHaveBeenCalled();
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });
    it('on shift keyboard down event should not rotateline if shift key is already pressed', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.shiftDown = true;
        service.inUse = true;
        service.onKeyboardDown(shiftKeyboardEvent);
        expect(rotateLineSpy).not.toHaveBeenCalled();
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('on shift keyup should set preview line back to mouse position only if user is drawing', () => {
        const shiftKeyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.inUse = true;
        service.shiftDown = true;
        service.onKeyboardUp(shiftKeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('keyboard up events should not trigger if user is not drawing', () => {
        const keyboardEvent = {
            key: 'Shift',
        } as KeyboardEvent;
        service.inUse = false;
        expect((): void => {
            service.onKeyboardUp(keyboardEvent);
        }).not.toThrow();
    });

    it('on escape keyboard down event should set internal attribute isEscapeKeyDown to true if user is drawing', () => {
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;

        service.inUse = true;
        service.onKeyboardDown(escapeKeyboardEvent);
        expect(service.isEscapeKeyDown).toBeTruthy();
    });

    it('on escape keyboard up should cancel the line currently being drawn', () => {
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;

        service.inUse = true;
        service.isEscapeKeyDown = true;
        service.onKeyboardUp(escapeKeyboardEvent);
        expect(service.isEscapeKeyDown).toBeFalsy();
        expect(service.inUse).toBeFalsy();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('on backspace keyboard down should set internal attribute isBackspaceDown to true', () => {
        const backspaceKeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        service.inUse = true;
        service.onKeyboardDown(backspaceKeyboardEvent);
        expect(service.isBackspaceKeyDown).toBeTruthy();
    });

    it('on backspace keyboard up should restore the state of the canvas to delete the last drawn line', () => {
        const backspaceKeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        const canvasWidth = 350;
        const canvasHeight = 350;
        service.inUse = true;
        service.isBackspaceKeyDown = true;
        service.canvasState = drawServiceSpy.baseCtx.getImageData(0, 0, canvasWidth, canvasHeight);
        service.onKeyboardUp(backspaceKeyboardEvent);
        expect(putImageDataSpy).toHaveBeenCalledWith(service.canvasState, 0, 0);
    });

    it('on backspace up should not trigger if the backspace key was not down', () => {
        const backspaceKeyboardEvent = {
            key: 'Backspace',
        } as KeyboardEvent;
        service.inUse = true;
        service.isBackspaceKeyDown = false;
        service.onKeyboardUp(backspaceKeyboardEvent);
        expect(putImageDataSpy).not.toHaveBeenCalled();
    });

    it('on mouse click should start drawing if user has not started a drawing yet', () => {
        service.onMouseClick(mouseEvent);
        expect(service.inUse).toBeTruthy();
        expect(service.mouseDownCoord).toEqual({ x: 25, y: 25 });
        expect(service.linePathData[0]).toEqual({ x: 25, y: 25 });
    });

    it('on mouse click, canvas should save its state to allow undo', () => {
        service.inUse = true;
        service.onMouseClick(mouseEvent);
        expect(getImageDataSpy).toHaveBeenCalled();
    });

    it('on mouse click, if withJunction is set to false, will only draw line and not draw arcs', () => {
        const mouseMoveEvent = {
            offsetX: 399,
            offsetY: 420,
        } as MouseEvent;
        service.inUse = true;
        service.withJunction = false;
        service.onMouseMove(mouseMoveEvent);
        service.onMouseClick(mouseMoveEvent);
        expect(ctxArcSpy).not.toHaveBeenCalled();
    });

    it('on mouse click should draw a line to the mouse position when user has started a drawing', () => {
        service.inUse = true;
        service.onMouseClick(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
        expect(service.linePathData[0]).toEqual({ x: 257, y: 399 });
    });

    it('on mouse click, drawn line ending point should connect to initial point if distance is within 20px', () => {
        const mouseMoveEvent = {
            offsetX: 399,
            offsetY: 425,
        } as MouseEvent;
        service.inUse = true;
        service.onMouseMove(mouseMoveEvent);
        service.onMouseClick(mouseMoveEvent);
        expect(executeSpy).toHaveBeenCalled();
    });

    it('on mouse click, should call executeCommand only if point is different from previous', () => {
        service.inUse = true;
        service.onMouseClick(mouseEvent);
        service.onMouseClick(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('on mouse dblclick should clear linePathData and stop drawing', () => {
        service.inUse = true;
        service.onMouseDoubleClick(mouseEvent);
        expect(service.linePathData).toEqual([]);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.inUse).toBeFalsy();
    });

    it('mouse double click should not do anything if user is not drawing', () => {
        service.inUse = false;
        expect((): void => {
            service.onMouseDoubleClick(mouseEvent);
        }).not.toThrow();
    });

    it('on mouse move should not draw if user is not drawing', () => {
        service.inUse = false;
        expect((): void => {
            service.onMouseMove(mouseEvent);
        }).not.toThrow();
    });

    /**
     * Test: calculateDistance
     * Cases, assuming dx = (currentPoint.x - initialPoint.x) and dy = (currentPoint.y - initialPoint.y)
     * 1. +dx, +dy
     * 2. +dx, -dy,
     * 3. -dx, +dy
     * 4. -dx, -dy
     */

    it('calculateDistance with +dx and +dy gives accurate euclidean distance', () => {
        const currentPoint = {
            x: 450,
            y: 500,
        } as Vec2;

        const expectedDistance = 88;

        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(expectedDistance);
    });

    it('calculateDistance with +dx and -dy gives accurate euclidea distance', () => {
        const currentPoint = {
            x: 420,
            y: 350,
        } as Vec2;

        const expectedDistance = 86;

        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(expectedDistance);
    });

    it('calculateDistance with -dx and +dy gives accurate euclidea distance', () => {
        const currentPoint = {
            x: 250,
            y: 500,
        } as Vec2;

        const expectedDistance = 159;

        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(expectedDistance);
    });

    it('calculateDistance with -dx and -dy gives accurate euclidea distance', () => {
        const currentPoint = {
            x: 250,
            y: 190,
        } as Vec2;

        const expectedDistance = 282;

        expect(Math.round(service.calculateDistance(service.initialPoint, currentPoint))).toEqual(expectedDistance);
    });

    /**
     * Test: calculateAngle
     * Cases:
     * 1. 1st quadrant
     * 2. 2nd quadrant
     * 3. 3rd quadrant
     * 4. 4th quadrant
     * 5. 0 degrees
     * 6. 90 degrees
     * 7. 180 degrees
     * 8. 270 degrees
     * 9. same points
     */

    it('calculate angle of two points should return correct angle in 1st quadrant', () => {
        const currentPoint = {
            x: 420,
            y: 500,
        };

        const expectedAngle = 291;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle in 2nd quadrant', () => {
        const currentPoint = {
            x: 220,
            y: 500,
        };

        const expectedAngle = 201;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle in 3rd quadrant', () => {
        const currentPoint = {
            x: 250,
            y: 350,
        };

        const expectedAngle = 150;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle in 4th quadrant', () => {
        const currentPoint = {
            x: 420,
            y: 293,
        };

        const expectedAngle = 79;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle when points are 90deg', () => {
        const currentPoint = {
            x: 394,
            y: 490,
        };

        const expectedAngle = 270;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle when points are 180deg ', () => {
        const currentPoint = {
            x: 250,
            y: 432,
        };

        const expectedAngle = 180;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle when points are 270deg', () => {
        const currentPoint = {
            x: 394,
            y: 293,
        };

        const expectedAngle = 90;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return correct angle when points are 0deg', () => {
        const currentPoint = {
            x: 420,
            y: 432,
        };

        const expectedAngle = 0;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    it('calculate angle of two points should return 0deg angle when points are the same', () => {
        const currentPoint = {
            x: 394,
            y: 432,
        };

        const expectedAngle = 0;

        expect(Math.round(service.calculateAngle(service.initialPoint, currentPoint))).toEqual(expectedAngle);
    });

    /**
     * Test: roundAngleToNearestMultiple
     * Cases:
     * 1. 22.4 -> 0
     * 2. 22.5 -> 45
     * 4. 67.4 -> 45
     * 5. 67.5 -> 90
     * 6. 112.4 -> 90
     * 7. 112.5 -> 135
     * 8. 157.4 -> 135
     * 9. 157.5 -> 180
     * 10. 202.4 -> 180
     * 11. 202.5 -> 225
     * 12. 247.4 -> 225
     * 13. 247.5 -> 270
     * 14. 292.4 -> 270
     * 15. 292.5 -> 315
     * 16. 337.4 -> 315
     * 17. 337.5 -> 360/0
     */

    it('rounding 22.4deg angle with a multiple of 45 should round down to 0', () => {
        const angle = 22.4;
        const multiple = 45;
        const expectedAngle = 0;
        expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
    });

    it('rounding edges 22.5deg and 67.4 with a multiple of 45 should round to 45', () => {
        const lowerBound = 22.5;
        const upperBound = 67.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 45;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 67.5deg and 112.4 with a multiple of 45 should round to 90', () => {
        const lowerBound = 67.5;
        const upperBound = 112.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 90;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 67.5deg and 112.4 with a multiple of 45 should round to 90', () => {
        const lowerBound = 67.5;
        const upperBound = 112.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 90;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 112.5deg and 157.4 with a multiple of 45 should round to 135', () => {
        const lowerBound = 112.5;
        const upperBound = 157.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 135;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 157.5deg and 200.4 with a multiple of 45 should round to 180', () => {
        const lowerBound = 157.5;
        const upperBound = 202.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 180;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 200.5deg and 247.4 with a multiple of 45 should round to 225', () => {
        const lowerBound = 202.5;
        const upperBound = 247.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 225;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 247.5deg and 292.4 with a multiple of 45 should round to 270', () => {
        const lowerBound = 247.5;
        const upperBound = 292.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 270;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding edges 292.5deg and 337.4 with a multiple of 45 should round to 315', () => {
        const lowerBound = 292.5;
        const upperBound = 337.4;
        const angles = [lowerBound, upperBound];
        const multiple = 45;
        const expectedAngle = 315;
        angles.forEach((angle) => {
            expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
        });
    });

    it('rounding 337.5 with a multiple of 45 should round up to 360 degrees', () => {
        const angle = 337.5;
        const multiple = 45;
        const expectedAngle = 360;
        expect(service.roundAngleToNearestMultiple(angle, multiple)).toEqual(expectedAngle);
    });

    it('calculate length of rotated line with intercardinal degree angle returns correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 255,
            y: 270,
        } as Vec2;

        const expectedPoint = {
            x: 303,
            y: 270,
        };
        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_135)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_45)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_315)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_225)).toEqual(expectedPoint);
    });

    it(' calculate length of rotated line with 270 degrees angle return correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        } as Vec2;

        const expectedPoint = {
            x: 260,
            y: 270,
        };

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_270)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_90)).toEqual(expectedPoint);
    });

    it('calculate length of rotated line with 180 degrees angle return correctly flattened line with correct length', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        } as Vec2;

        const expectedPoint = {
            x: 289,
            y: 270,
        };

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_180)).toEqual(expectedPoint);

        expect(service.calculateLengthAndFlatten(initialPoint, service.mousePosition, LineConstants.DEGREES_0)).toEqual(expectedPoint);
    });

    it('rotate with 45 degrees returns correct calculated value', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 242,
            y: 158,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_45)).toEqual(expectedPoint);
    });

    it('rotate with 135 degrees returns correct calculated end point', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 18,
            y: 158,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_135)).toEqual(expectedPoint);
    });

    it('rotate with 225 degrees returns correct calculated end point', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 18,
            y: 382,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_225)).toEqual(expectedPoint);
    });

    it('rotate with 315 degrees returns correct calculated end point', () => {
        const initialPoint = {
            x: 130,
            y: 270,
        };

        const currentPoint = {
            x: 289,
            y: 270,
        };

        const expectedPoint = {
            x: 242,
            y: 382,
        };

        expect(service.rotateLine(initialPoint, currentPoint, LineConstants.DEGREES_315)).toEqual(expectedPoint);
    });
});