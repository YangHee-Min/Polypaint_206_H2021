import { Component, Input } from '@angular/core';
import { SidebarToolButton } from '@app/classes/sidebar-tool-buttons';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Input() selectedTool: SidebarToolButton;
    @Input() isMagnetismOptionsDisplayed: boolean;
    isGridOptionsDisplayed: boolean;
    shouldRun: boolean;
    isUndoSelection: boolean;

    sidebarToolButtons: SidebarToolButton[] = [
        { service: 'PencilService', name: 'Crayon', icon: 'create', keyShortcut: 'c', helpShortcut: '(Touche C)' },
        { service: 'EraserService', name: 'Efface', icon: 'settings_cell', keyShortcut: 'e', helpShortcut: '(Touche E)' },
        { service: 'RectangleService', name: 'Rectangle', icon: 'crop_5_4', keyShortcut: '1', helpShortcut: '(Touche 1)' },
        { service: 'EllipseService', name: 'Ellipse', icon: 'panorama_fish_eye', keyShortcut: '2', helpShortcut: '(Touche 2)' },
        { service: 'PolygoneService', name: 'Polygone', icon: 'signal_cellular_null', keyShortcut: '3', helpShortcut: '(Touche 3)' },
        { service: 'LineService', name: 'Ligne', icon: 'remove', keyShortcut: 'l', helpShortcut: '(Touche L)' },
        { service: 'TextService', name: 'Texte', icon: 'text_format', keyShortcut: 't', helpShortcut: '(Touche T)' },
        { service: 'StampService', name: 'Étampe', icon: 'how_to_vote', keyShortcut: 'd', helpShortcut: '(Touche D)' },
        { service: 'AerosolService', name: 'Aérosol', icon: 'blur_on', keyShortcut: 'a', helpShortcut: '(Touche A)' },
        { service: 'PipetteService', name: 'Pipette', icon: 'invert_colors', keyShortcut: 'i', helpShortcut: '(Touche I)' },
        { service: 'RectangleSelectionService', name: 'Rectangle de Selection', icon: 'blur_linear', keyShortcut: 'r', helpShortcut: '(Touche R)' },
        { service: 'EllipseSelectionService', name: 'Ellipse de selection', icon: 'blur_circular', keyShortcut: 's', helpShortcut: '(Touche S)' },
        { service: 'LassoSelectionService', name: 'Lasso polygonal', icon: 'gesture', keyShortcut: 'v', helpShortcut: '(Touche V)' },
        { service: 'PaintBucketService', name: 'Sceau de peinture', icon: 'format_color_fill', keyShortcut: 'b', helpShortcut: '(Touche B)' },
    ];

    constructor(
        public toolManager: ToolManagerService,
        public undoRedoService: UndoRedoService,
        public clipboardService: ClipboardService,
        public popupManager: PopupManagerService,
    ) {
        this.shouldRun = false;
        this.isUndoSelection = false;
        this.selectedTool = this.sidebarToolButtons[0];
        this.toolManager.currentToolSubject.asObservable().subscribe((tool) => {
            this.selectedTool = this.sidebarToolButtons.find((sidebarToolButton) => {
                return sidebarToolButton.service === tool.constructor.name;
            }) as SidebarToolButton;
            this.isMagnetismOptionsDisplayed = false;
            this.isGridOptionsDisplayed = false;
        });
    }

    onSelectTool(tool: SidebarToolButton): void {
        this.toolManager.selectTool(tool.keyShortcut);
    }

    openNewDrawing(): void {
        this.popupManager.openNewDrawingPopUp();
    }

    exportDrawing(): void {
        this.popupManager.openExportPopUp();
    }

    saveDrawing(): void {
        this.popupManager.openSavePopUp();
    }

    openGridOptions(): void {
        this.isGridOptionsDisplayed = !this.isGridOptionsDisplayed;
    }

    toggleMagnetismOptions(): void {
        this.isMagnetismOptionsDisplayed = !this.isMagnetismOptionsDisplayed;
    }

    undo(): void {
        if (this.toolManager.currentTool instanceof RectangleSelectionService || this.toolManager.currentTool instanceof EllipseSelectionService) {
            if (this.toolManager.currentTool.isManipulating) {
                this.toolManager.currentTool.undoSelection();
                this.isUndoSelection = true;
            }
        }
        if (!this.isUndoSelection) {
            this.undoRedoService.undo();
        }
        this.isUndoSelection = false;
    }

    redo(): void {
        this.undoRedoService.redo();
    }

    selectAll(): void {
        this.toolManager.selectTool(RECTANGLE_SELECTION_KEY);
        if (this.toolManager.currentTool instanceof RectangleSelectionService) {
            this.toolManager.currentTool.selectAll();
        }
    }

    copySelection(): void {
        this.clipboardService.copySelection();
    }

    cutSelection(): void {
        this.clipboardService.cutSelection();
    }

    deleteSelection(): void {
        this.clipboardService.deleteSelection();
    }

    pasteSelection(): void {
        this.clipboardService.pasteSelection();
    }
}
