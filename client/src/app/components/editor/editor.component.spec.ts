import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SaveDrawingComponent } from '@app/components/sidebar/save-drawing-page/save-drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { MAX_HEIGHT_FORM, MAX_WIDTH_FORM } from '@app/constants/popup-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Observable, Subject } from 'rxjs';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:no-string-literal
// tslint:disable:max-file-line-count
describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let keyboardEventSpy: jasmine.Spy;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let undoSpy: jasmine.Spy;
    let redoSpy: jasmine.Spy;
    let savePopUpSpy: jasmine.Spy;
    let exportPopUpSpy: jasmine.Spy;
    let newDrawingPopUpSpy: jasmine.Spy;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        toolStub = new ToolStub(drawServiceSpy as DrawingService, {} as UndoRedoService);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['getTool', 'selectTool', 'setPrimaryColorTools', 'setSecondaryColorTools']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'closeAll', '_getAfterAllClosed'], ['afterAllClosed', '_afterAllClosedAtThisLevel']);
        (Object.getOwnPropertyDescriptor(dialogSpy, '_afterAllClosedAtThisLevel')?.get as jasmine.Spy<() => Subject<any>>).and.returnValue(
            new Subject<any>(),
        );
        (Object.getOwnPropertyDescriptor(dialogSpy, 'afterAllClosed')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(
            dialogSpy['_afterAllClosedAtThisLevel'].asObservable(),
        );

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
                { provide: Tool, useValue: toolStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        component.newDialog = dialogSpy;
        drawServiceSpy.imageURL = '';
        fixture.detectChanges();
        keyboardEventSpy = spyOn(component, 'onKeyboardDown').and.callThrough();
        component.currentTool = toolStub;

        undoSpy = spyOn(component.undoRedoService, 'undo');
        redoSpy = spyOn(component.undoRedoService, 'redo');

        savePopUpSpy = spyOn(component, 'openSavePopUp').and.callThrough();
        exportPopUpSpy = spyOn(component, 'openExportPopUp').and.callThrough();
        newDrawingPopUpSpy = spyOn(component, 'openNewDrawingPopUp').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should call subscribe', () => {
        const subscribeSpy = spyOn(component.newDialog.afterAllClosed, 'subscribe').and.callThrough();
        component.ngOnInit();

        expect(subscribeSpy).toHaveBeenCalled();
    });

    it('should not call select tool,undo,redo, openExportModalPopUp or openNewDrawingPopUp when isPopUpOpen', () => {
        component.isPopUpOpen = true;
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '1' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
        expect(exportPopUpSpy).not.toHaveBeenCalled();
        expect(newDrawingPopUpSpy).not.toHaveBeenCalled();
    });

    it("should call select tool when '1' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '1' });
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when '2' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '2' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'c' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'c' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'l' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'l' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'e' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'e' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it('should prevent keydown default when ctrl+relevant key is down', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onCtrlZKeyDown(eventSpy);
        component.onCtrlOKeyDown(eventSpy);
        component.onCtrlEKeyDown(eventSpy);
        component.onCtrlShiftZKeyDown(eventSpy);

        expect(eventSpy.preventDefault).toHaveBeenCalled();
    });

    it("'ctrl+o' should call openNewDrawingPopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: '' });
        component.onCtrlOKeyDown(eventSpy);

        expect(newDrawingPopUpSpy).toHaveBeenCalled();
        expect(eventSpy['preventDefault']).toHaveBeenCalled();
    });

    it("should not call openExportPopUp or openNewDrawingPopUp when only 'ctrl' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(exportPopUpSpy).not.toHaveBeenCalled();
        expect(newDrawingPopUpSpy).not.toHaveBeenCalled();
    });

    it("should not call openNewDrawingPopUp when only 'o' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'KeyO', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(newDrawingPopUpSpy).not.toHaveBeenCalled();
    });

    it("should call undo when 'ctrl+z' keys are down and tool isn't used and no popups open", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });
        component.currentTool.mouseDown = false;
        component.onCtrlZKeyDown(eventSpy);

        expect(undoSpy).toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should call redo when 'ctrl+shift+z' keys are down and tool isn't used and no popups open", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' });
        component.currentTool.mouseDown = false;
        component.onCtrlShiftZKeyDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).toHaveBeenCalled();
    });

    it("should not call undo when 'ctrl+z' keys are down and tool is used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });

        component.currentTool.inUse = true;
        component.onCtrlZKeyDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call redo when 'ctrl+shift+z' keys are down and tool is used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' });
        component.currentTool.inUse = true;
        component.onCtrlShiftZKeyDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'z' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'KeyZ', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'ctrl' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'shift' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, shiftKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it('updateToolFromSidebarClick should set current tool', () => {
        component.updateToolFromSidebarClick(toolStub);
        expect(component.currentTool).toBe(toolStub);
    });

    it("openNewDrawingPopUp should open NewDrawingBoxComponent if canvas isn't empty and pop up isn't open", () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return false;
        });
        component.isPopUpOpen = false;
        component.openNewDrawingPopUp();

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(NewDrawingBoxComponent);
        expect(component.isPopUpOpen).toBeTrue();
    });

    it('openNewDrawingPopUp should not open anything if canvas is empty and pop up is not open', () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return true;
        });
        component.isPopUpOpen = false;
        component.openNewDrawingPopUp();

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(component.isPopUpOpen).toBeFalse();
    });

    it('openNewDrawingPopUp should not open anything if pop up is open and canvas is empty', () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return true;
        });
        component.isPopUpOpen = true;
        component.openNewDrawingPopUp();

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(component.isPopUpOpen).toBeTrue();
    });

    it("'ctrl+e' should call openExportPopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyE', key: '' });
        component.onCtrlEKeyDown(eventSpy);

        expect(exportPopUpSpy).toHaveBeenCalled();
        expect(eventSpy['preventDefault']).toHaveBeenCalled();
    });

    it("openExportPopUp should open export pop up if pop up isn't open", () => {
        const mockConfig = { maxWidth: MAX_WIDTH_FORM + 'px', maxHeight: MAX_HEIGHT_FORM + 'px' };
        component.isPopUpOpen = false;
        component.openExportPopUp();

        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(ExportDrawingComponent, mockConfig);
        expect(component.isPopUpOpen).toBeTrue();
    });

    it('openExportPopUp should not open anything if pop up is open', () => {
        component.isPopUpOpen = true;
        component.openExportPopUp();

        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(component.isPopUpOpen).toBeTrue();
    });

    it("'ctrl+s' should call openSavePopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyS', key: '' });
        component.onCtrlSKeyDown(eventSpy);

        expect(savePopUpSpy).toHaveBeenCalled();
        expect(eventSpy['preventDefault']).toHaveBeenCalled();
    });

    it("openSavePopUp should open SaveDrawingComponent if canvas isn't empty and pop up isn't open", () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return false;
        });

        component.isPopUpOpen = false;
        component.openSavePopUp();

        expect(savePopUpSpy).toHaveBeenCalled();
        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(SaveDrawingComponent);
        expect(component.isPopUpOpen).toBeTrue();
    });

    it('openSavePopUp should not open anything if canvas is empty', () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return true;
        });
        component.openSavePopUp();

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(component.isPopUpOpen).toBeFalse();
    });

    it("openSavePopUp should not open anything if pop up is open and canvas isn't empty", () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return true;
        });
        component.isPopUpOpen = true;
        component.openSavePopUp();

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).not.toHaveBeenCalled();
        expect(component.isPopUpOpen).toBeTrue();
    });

    it('should not call selectTool if a non tool key is down.', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'u' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
    });

    it('isCanvasEmpty should return true if canvas only white', () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const isCanvasEmptySpy = spyOn(component, 'isCanvasEmpty').and.callThrough();

        const returnValue = component.isCanvasEmpty();

        expect(isCanvasEmptySpy).toHaveBeenCalled();
        expect(returnValue).toBeTrue();
    });

    it('isCanvasEmpty should return false if something has been drawn', () => {
        const isCanvasEmptySpy = spyOn(component, 'isCanvasEmpty').and.callThrough();
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 1, 1);

        const returnValue = component.isCanvasEmpty();

        expect(isCanvasEmptySpy).toHaveBeenCalled();
        expect(returnValue).toBeFalse();
    });

    it('when all popups are closed, isPopUpOpen is set to false', () => {
        dialogSpy._getAfterAllClosed.and.callFake(() => {
            return component.newDialog['_afterAllClosedAtThisLevel'];
        });
        component.isPopUpOpen = true;

        component.newDialog._getAfterAllClosed().next();

        expect(component.isPopUpOpen).toBeFalse();
    });
});
