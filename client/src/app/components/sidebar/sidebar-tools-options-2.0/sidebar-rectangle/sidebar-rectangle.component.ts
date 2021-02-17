import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
  selector: 'app-sidebar-rectangle',
  templateUrl: './sidebar-rectangle.component.html',
  styleUrls: ['./sidebar-rectangle.component.scss']
})
export class SidebarRectangleComponent implements OnInit {
  max: number = 200;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  fillMode: number | undefined;
  currentTool: Tool;

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();

  constructor(public settingsManager: SettingsManagerService) {}

  ngOnInit(): void{
    this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
    this.fillModeChanged.subscribe((newFillMode: number) => this.settingsManager.setFillMode(newFillMode));
  }

  setMax(numberInput: number) {
    return numberInput;
  }

  emitToolSize() {
    this.toolSizeChanged.emit(this.toolSize);
  }

  emitFillMode(newFillMode: number) {
    this.fillModeChanged.emit(newFillMode);
  }
}
