import { CdkDragMove } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeTopLeft } from './resize-top-left';

// tslint:disable: no-string-literal
describe('ResizeTopLeftService', () => {
    let service: ResizeTopLeft;
    let mockComponent: SelectionComponent;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeTopLeft);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        mockComponent = {
            bottomRight: { x: 20, y: 20 },
            initialPosition: { x: 10, y: 10 },
            previewSelectionCanvas: canvasTestHelper.previewSelectionCanvas,
            borderCanvas: canvasTestHelper.borderCanvas,
        } as SelectionComponent;
        service.selectionComponent = mockComponent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resize should set oppositePoint if isShiftDown true', () => {
        spyOn(service['resizeWidth'], 'resizeWidth');
        spyOn(service['resizeHeight'], 'resizeHeight');

        service.resize({} as CdkDragMove, true);

        expect(service['oppositePoint']).toBeTruthy();
        expect(service['oppositePoint'].x).toBe(service.selectionComponent.bottomRight.x);
        expect(service['oppositePoint'].y).toBe(service.selectionComponent.bottomRight.y);
    });

    it('resize should call resizeWidth/Height methods of resizeWidth and resizeHeight if isShiftDown true', () => {
        const resizeWidthSpy = spyOn(service['resizeWidth'], 'resizeWidth');
        const resizeHeightSpy = spyOn(service['resizeHeight'], 'resizeHeight');

        service.resizePreview({} as CdkDragMove, true);

        expect(resizeWidthSpy).toHaveBeenCalled();
        expect(resizeHeightSpy).toHaveBeenCalled();
    });

    it('resize should call resize methods of resizeWidth and resizeHeight if isShiftDown false', () => {
        const resizeWidthSpy = spyOn(service['resizeWidth'], 'resizePreview');
        const resizeHeightSpy = spyOn(service['resizeHeight'], 'resizePreview');

        service.resizePreview({} as CdkDragMove, false);

        expect(resizeWidthSpy).toHaveBeenCalled();
        expect(resizeHeightSpy).toHaveBeenCalled();
    });

    it('resizeSquare should call resizeSquare methods of super,resizeWidth and resizeHeight with true', () => {
        const resizeWidthSpy = spyOn(service['resizeWidth'], 'resizeSquare');
        const resizeHeightSpy = spyOn(service['resizeHeight'], 'resizeSquare');
        const superSpy = spyOn(ResizeStrategy.prototype, 'resizeSquare');

        service.resizeSquare();

        expect(resizeWidthSpy).toHaveBeenCalled();
        expect(resizeWidthSpy).toHaveBeenCalledWith(true);
        expect(resizeHeightSpy).toHaveBeenCalled();
        expect(resizeHeightSpy).toHaveBeenCalledWith(true);
        expect(superSpy).toHaveBeenCalled();
    });

    it('assignComponent should set selectionComponent', () => {
        service.selectionComponent = {} as SelectionComponent;
        spyOn(service['resizeWidth'], 'assignComponent');
        spyOn(service['resizeHeight'], 'assignComponent');

        service.assignComponent(mockComponent);

        expect(service.selectionComponent).toBe(mockComponent);
    });

    it('assignComponent should call assignComponent methods of resizeWidth and resizeHeight', () => {
        const resizeWidthSpy = spyOn(service['resizeWidth'], 'assignComponent');
        const resizeHeightSpy = spyOn(service['resizeHeight'], 'assignComponent');

        service.assignComponent(mockComponent);

        expect(resizeWidthSpy).toHaveBeenCalled();
        expect(resizeWidthSpy).toHaveBeenCalledWith(mockComponent);
        expect(resizeHeightSpy).toHaveBeenCalled();
        expect(resizeHeightSpy).toHaveBeenCalledWith(mockComponent);
    });

    it('restoreLastDimensions should call restoreLastDimensions methods of resizeWidth and resizeHeight', () => {
        const resizeWidthSpy = spyOn(service['resizeWidth'], 'restoreLastDimensions');
        const resizeHeightSpy = spyOn(service['resizeHeight'], 'restoreLastDimensions');

        service.restoreLastDimensions();

        expect(resizeWidthSpy).toHaveBeenCalled();
        expect(resizeHeightSpy).toHaveBeenCalled();
    });
});
