import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as ShapeConstants from '@app/constants/shapes-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-ellipse',
    templateUrl: './sidebar-ellipse.component.html',
    styleUrls: ['./sidebar-ellipse.component.scss'],
})
export class SidebarEllipseComponent implements OnInit {
    max: number;
    min: number;
    tickInterval: number;
    toolSize: number | undefined;
    fillMode: number | undefined;

    @Output() private toolSizeChanged: EventEmitter<number>;
    @Output() private fillModeChanged: EventEmitter<number>;

    constructor(public settingsManager: SettingsManagerService) {
        this.max = ShapeConstants.MAX_BORDER_WIDTH;
        this.min = ShapeConstants.MIN_BORDER_WIDTH;
        this.tickInterval = ShapeConstants.TICK_INTERVAL;
        this.toolSizeChanged = new EventEmitter();
        this.fillModeChanged = new EventEmitter();
        this.toolSize = settingsManager.toolManager.ellipseService.lineWidth;
        this.fillMode = settingsManager.toolManager.ellipseService.fillMode;
    }

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
        this.fillModeChanged.subscribe((newFillMode: number) => this.settingsManager.setFillMode(newFillMode));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }

    emitFillMode(newFillMode: number): void {
        this.fillModeChanged.emit(newFillMode);
    }
}
