import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/constants/mouse-constants';
import { DEFAULT_TOLERANCE_VALUE } from '@app/constants/paint-bucket-constants';
import { PaintBucketCommand } from './paint-bucket-command';
import { ColorRgba, PaintBucketService } from './paint-bucket-service';

describe('PaintBucketCommand', () => {
    let command: PaintBucketCommand;
    let paintBucketService: PaintBucketService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let floodFillSpy: jasmine.Spy;
    let fillSpy: jasmine.Spy;

    const RED_VALUE = 110;
    const GREEN_VALUE = 225;
    const BLUE_VALUE = 202;
    const OPACITY = 255;
    const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
    const TEST_TOLERANCE_VALUE = DEFAULT_TOLERANCE_VALUE;
    const DEFAULT_MOUSE_BUTTON = MouseButton.Left;
    const DEFAULT_START_X = 150;
    const DEFAULT_START_Y = 150;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        paintBucketService = TestBed.inject(PaintBucketService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        paintBucketService.setPrimaryColor(TEST_PRIMARY_COLOR);
        paintBucketService.setToleranceValue(TEST_TOLERANCE_VALUE);
        paintBucketService.mouseButtonClicked = DEFAULT_MOUSE_BUTTON;
        paintBucketService.startX = DEFAULT_START_X;
        paintBucketService.startY = DEFAULT_START_Y;

        command = new PaintBucketCommand(baseCtxStub, paintBucketService);

        floodFillSpy = spyOn(command, 'floodFill');
        fillSpy = spyOn(command, 'fill');
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call floodfill if left mouse button', () => {
        command.mouseButtonClicked = MouseButton.Left;
        command.execute();
        expect(floodFillSpy).toHaveBeenCalled();
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('execute should call floodfill if right mouse button', () => {
        command.mouseButtonClicked = MouseButton.Right;
        command.execute();
        expect(fillSpy).toHaveBeenCalled();
        expect(floodFillSpy).not.toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, paintBucketService);
        expect(command.primaryColorRgba).toEqual(paintBucketService.primaryColorRgba);
        expect(command.primaryColor).toEqual(paintBucketService.primaryColor);
        expect(command.startX).toEqual(paintBucketService.startX);
        expect(command.startY).toEqual(paintBucketService.startY);
        expect(command.toleranceValue).toEqual(paintBucketService.toleranceValue);
        expect(command.mouseButtonClicked).toEqual(paintBucketService.mouseButtonClicked);
    });

    it('number2rgba should correctly convert white hex color into rgba interface', () => {
        // White -> #FF000000 -> 4278190080
        const hexColor = 4278190080;
        const expectedColor = { red: 0, green: 0, blue: 0, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert black hex color into rgba interface', () => {
        // Black -> #FF000000 -> 4294967295
        const hexColor = 4294967295;
        const expectedColor = { red: 255, green: 255, blue: 255, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert red hex color into rgba interface', () => {
        // Red -> #FF0000FF -> 4278190335
        const hexColor = 4278190335;
        const expectedColor = { red: 255, green: 0, blue: 0, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert green hex color into rgba interface', () => {
        // Green -> #FF00FF00 -> 4278255360
        const hexColor = 4278255360;
        const expectedColor = { red: 0, green: 255, blue: 0, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert blue hex color into rgba interface', () => {
        // Blue -> #FFFF0000 -> 4294901760
        const hexColor = 4294901760;
        const expectedColor = { red: 0, green: 0, blue: 255, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert hex color into rgba interface', () => {
        // Light blue -> #FFCDC21C -> 4291674652
        const hexColor = 4291674652;
        const expectedColor = { red: 28, green: 194, blue: 205, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert hex color with fractional opacity into rgba interface', () => {
        // Light blue -> #FFCDC21C -> 4291674652
        const hexColor = 4291674652;
        const expectedColor = { red: 28, green: 194, blue: 205, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('calculateColorDistance should correctly calculate max euclidian distance between two colors', () => {
        const blackRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const whiteRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const expectedDistance = 510;
        const distance = command.calculateColorDistance(blackRgba, whiteRgba);
        expect(distance).toEqual(expectedDistance);
    });

    it('calculateColorDistance should correctly calculate same max euclidian distance between two colors if inversed param', () => {
        const blackRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const whiteRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const expectedDistance = 510;
        const distance = command.calculateColorDistance(whiteRgba, blackRgba);
        expect(distance).toEqual(expectedDistance);
    });

    it('calculateColorDistance should correctly calculate min euclidian distance between two colors', () => {
        const blackRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const whiteRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const expectedDistance = 0;
        const distance = command.calculateColorDistance(whiteRgba, blackRgba);
        expect(distance).toEqual(expectedDistance);
    });

    it('calculateColorDistance should correctly calculate distance between two colors', () => {
        const blackRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const whiteRgba = {
            red: 84,
            green: 123,
            blue: 214,
            alpha: 125,
        } as ColorRgba;
        const expectedDistance = 150;
        const distance = command.calculateColorDistance(whiteRgba, blackRgba);
        expect(distance).toEqual(expectedDistance);
    });

    // Start of tests to validate the tolerance value
    // The following strategy will be used:
    // We scale the tolerance value to fit a 4d space (RGBA) where max tolerance is sqrt(255**2 * 4)
    // which is max euclidian distance
    // We calculate the euclidian distance between colors compare it to the tolerance value
    // Return true if valid, false if not.

    it('should return true if both colors are the same and if tolerance is 0', () => {
        command.toleranceValue = 0;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    it('should return false if both colors are not the same and if tolerance is 0', () => {
        command.toleranceValue = 0;
        const currentRgba = {
            red: 127,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 25/100 -> 64/255 -> 128/512
    it('should return true if both colors distance of 0 and if tolerance is 25', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255 / 4), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 128
    it('should return true if both colors distance of 25 and if tolerance is 25', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255 / 4), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 97,
            green: 72,
            blue: 170,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 129
    it('should return false if both colors distance of 26 and if tolerance is 25', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255 / 4), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 97,
            green: 71,
            blue: 170,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 50/100 -> 128/255 -> 256/512
    it('should return true if both colors distance of 0 and if tolerance is 50', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255 / 2), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 256
    it('should return true if both colors distance of 50 and if tolerance is 50', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255 / 2), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 72,
            blue: 95,
            alpha: 84,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 257
    it('should return false if both colors distance of 51 and if tolerance is 50', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255 / 2), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 72,
            blue: 95,
            alpha: 83,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 75/100 -> 191/255 -> 382/512
    it('should return true if both colors distance of 0 and if tolerance is 75', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(191), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 384, tolerance = 382
    it('should return true if both colors distance of 75 and if tolerance is 75', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(191), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 41,
            blue: 85,
            alpha: 84,
        } as ColorRgba;
        const targetRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 385, tolerance 384
    it('should return false if both colors distance of 76 and if tolerance is 76', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(191), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 30,
            blue: 85,
            alpha: 84,
        } as ColorRgba;
        const targetRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 100/100 -> 255/255 -> 512/512
    it('should return true if both colors distance of 0 and if tolerance is 100', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 510, tolerance = 510
    it('should return true if both colors distance of 100 and if tolerance is 100', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(Math.round(255), 2) * 4));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const targetRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });
});
