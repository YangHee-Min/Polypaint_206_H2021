import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
  selector: 'app-sidebar-tools-options',
  templateUrl: './sidebar-tools-options.component.html',
  styleUrls: ['./sidebar-tools-options.component.scss']
})
export class SidebarToolsOptionsComponent {
  max: number = 300;
  min: number = 1;
  tickInterval: number = 1;
  toolSize: number | undefined;
  fillMode: number | undefined;
  withJunction: boolean;
  junctionRadius: number | undefined;
  currentTool: Tool;

  radioGroup = document.getElementById('radioGroup');

  @Input() newTool: Tool; // INPUT FROM SIDEBAR
  @Input() selected: number;

  currentToolName: string = 'outil selectionné';


  constructor(public settingsManager: SettingsManagerService, public toolManagerService: ToolManagerService) {
    this.toolSizeChanged.subscribe((newSize: number) => settingsManager.setLineWidth(newSize));
    this.fillModeChanged.subscribe((newFillMode: number) => settingsManager.setFillMode(newFillMode));
    this.withJunctionChanged.subscribe((newWithJunction: boolean) => settingsManager.setWithJunction(newWithJunction));
    this.junctionRadiusChanged.subscribe((newJunctionRadius: number) => settingsManager.setJunctionRadius(newJunctionRadius));

  }

  @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
  @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();
  @Output() withJunctionChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() junctionRadiusChanged: EventEmitter<number> = new EventEmitter();

  setMax(muberInput: number) {
    if (muberInput >= 200) {
      return Math.round(muberInput / 200) + 'k';
    }
    return muberInput;
  }

  setToolSize() {
    this.toolSizeChanged.emit(this.toolSize);
  }

  setFillMode(newFillMode: number) {
    this.fillModeChanged.emit(newFillMode);
  }

  setWithJunction() {
    this.withJunctionChanged.emit(this.withJunction);
  }

  setJunctionRadius() {
    this.junctionRadiusChanged.emit(this.junctionRadius);
  }

}
