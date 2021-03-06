import { Injectable } from '@angular/core';
import { DirectionalMovementDirective } from '@app/components/selection/selection-directives/directional-movement.directive';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as DirectionalMovementConstants from '@app/constants/directional-movement-constants';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ShortcutManagerService {
    isTextInput: boolean;

    constructor(
        public popupManager: PopupManagerService,
        public undoRedoService: UndoRedoService,
        public canvasGridService: CanvasGridService,
        public toolManager: ToolManagerService,
        public magnetismService: MagnetismService,
        public clipboardService: ClipboardService,
    ) {
        this.isTextInput = false;
    }

    private isShortcutAllowed(): boolean {
        return !this.isTextInput && !this.popupManager.isPopUpOpen && !this.toolManager.textService.lockKeyboard;
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (!this.isShortcutAllowed()) return;
        if (event.key.match(/^(1|2|3|a|b|c|d|e|i|l|r|s|t|v)$/)) {
            this.toolManager.selectTool(event.key);
        }
    }

    onGKeyDown(): void {
        if (!this.isShortcutAllowed()) return;
        this.canvasGridService.toggleGrid();
    }

    selectionOnShiftKeyDown(selectionComponent: SelectionComponent): void {
        if (!this.isShortcutAllowed()) return;
        if (selectionComponent.resizerHandlerService.inUse) {
            selectionComponent.resizerHandlerService.resizeSquare();
            selectionComponent.resizerHandlerService.setResizerPositions(selectionComponent.previewSelectionCanvas);
            selectionComponent.drawWithScalingFactors(selectionComponent.previewSelectionCtx, selectionComponent.selectionCanvas);
        }
        selectionComponent.resizerHandlerService.isShiftDown = true;
    }

    selectionOnShiftKeyUp(selectionComponent: SelectionComponent): void {
        if (!this.isShortcutAllowed()) return;
        if (selectionComponent.resizerHandlerService.inUse) {
            selectionComponent.resizerHandlerService.restoreLastDimensions();
            selectionComponent.resizerHandlerService.setResizerPositions(selectionComponent.previewSelectionCanvas);
            selectionComponent.drawWithScalingFactors(selectionComponent.previewSelectionCtx, selectionComponent.selectionCanvas);
        }
        selectionComponent.resizerHandlerService.isShiftDown = false;
    }

    onCtrlAKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.toolManager.selectTool(RECTANGLE_SELECTION_KEY);
        (this.toolManager.currentTool as RectangleSelectionService).selectAll();
    }

    onCtrlEKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.popupManager.openExportPopUp();
    }

    onCtrlGKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.popupManager.openCarrouselPopUp();
    }

    onCtrlOKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.popupManager.openNewDrawingPopUp();
    }

    onCtrlSKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.popupManager.openSavePopUp();
    }

    onCtrlShiftZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.undoRedoService.redo();
    }

    onCtrlZKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        if (this.toolManager.currentTool instanceof ToolSelectionService && this.toolManager.currentTool.isManipulating) {
            this.toolManager.currentTool.undoSelection();
        } else {
            this.undoRedoService.undo();
        }
    }

    onCtrlCKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.clipboardService.copySelection();
    }

    onCtrlVKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.clipboardService.pasteSelection();
    }

    onCtrlXKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        this.clipboardService.cutSelection();
    }

    onDeleteKeyDown(event: KeyboardEvent): void {
        if (!this.isShortcutAllowed()) return;
        if (!(this.toolManager.currentTool instanceof ToolSelectionService)) return;
        event.preventDefault();
        this.clipboardService.deleteSelection();
    }

    onMinusKeyDown(): void {
        if (!this.isShortcutAllowed()) return;
        this.canvasGridService.reduceGridSize();
    }

    onEqualKeyDown(): void {
        if (!this.isShortcutAllowed()) return;
        this.canvasGridService.increaseGridSize();
    }

    onPlusKeyDown(): void {
        if (!this.isShortcutAllowed()) return;
        this.canvasGridService.increaseGridSize();
    }

    onMKeyDown(): void {
        if (!this.isShortcutAllowed()) return;
        this.magnetismService.toggleMagnetism();
    }

    onAltDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolManager.currentTool instanceof StampService) {
            this.toolManager.currentTool.changeRotationAngleOnAlt();
        }
    }

    onAltUp(): void {
        if (this.toolManager.currentTool instanceof StampService) {
            this.toolManager.currentTool.changeRotationAngleNormal();
        }
    }

    onEscapeKeyDown(): void {
        if (this.popupManager.isPopUpOpen) return;
        this.toolManager.currentTool.onEscapeKeyDown();
    }

    async selectionMovementOnArrowDown(event: KeyboardEvent, directive: DirectionalMovementDirective): Promise<void> {
        event.preventDefault();
        if (!this.isShortcutAllowed()) return;
        if (!directive.keyPressed.get(event.key)) {
            directive.keyPressed.set(event.key, event.timeStamp);
            if (this.magnetismService.isMagnetismOn) {
                directive.translateSelection(this.canvasGridService.squareWidth / 2 + 1);
                this.magnetismService.magnetizeSelection();
            } else {
                directive.translateSelection();
            }
            await directive.delay(DirectionalMovementConstants.FIRST_PRESS_DELAY_MS);
        }

        if (directive.hasMovedOnce) return;

        directive.hasMovedOnce = true;
        await directive.delay(DirectionalMovementConstants.CONTINUOUS_PRESS_DELAY_MS);
        const numPixels = this.magnetismService.isMagnetismOn ? this.canvasGridService.squareWidth : DirectionalMovementConstants.NUM_PIXELS;
        directive.translateSelection(numPixels);
        directive.hasMovedOnce = false;
    }

    selectionMovementOnKeyboardUp(event: KeyboardEvent, directive: DirectionalMovementDirective): void {
        if (!this.isShortcutAllowed()) return;
        directive.keyPressed.set(event.key, 0);
    }
}
