import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import * as DirectionalMovementConstants from '@app/constants/directional-movement-constants';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';

@Directive({
    selector: '[appDirectionalMovement]',
})
export class DirectionalMovementDirective {
    keyPressed: Map<string, number>;
    hasMovedOnce: boolean;
    @Output() canvasMovement: EventEmitter<boolean>;

    constructor(private element: ElementRef, public shortcutManager: ShortcutManagerService) {
        this.keyPressed = new Map();
        this.hasMovedOnce = false;
        this.canvasMovement = new EventEmitter();
    }

    @HostListener('keydown.ArrowLeft', ['$event'])
    @HostListener('keydown.ArrowDown', ['$event'])
    @HostListener('keydown.ArrowRight', ['$event'])
    @HostListener('keydown.ArrowUp', ['$event'])
    async onKeyboardDown(event: KeyboardEvent): Promise<void> {
        await this.shortcutManager.selectionMovementOnArrowDown(event, this);
    }

    @HostListener('keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        this.shortcutManager.selectionMovementOnKeyboardUp(event, this);
    }

    private translateLeft(numPixels: number): void {
        this.element.nativeElement.style.left = parseInt(this.element.nativeElement.style.left, 10) - numPixels + 'px';
    }

    private translateRight(numPixels: number): void {
        this.element.nativeElement.style.left = parseInt(this.element.nativeElement.style.left, 10) + numPixels + 'px';
    }

    private translateUp(numPixels: number): void {
        this.element.nativeElement.style.top = parseInt(this.element.nativeElement.style.top, 10) - numPixels + 'px';
    }

    private translateDown(numPixels: number): void {
        this.element.nativeElement.style.top = parseInt(this.element.nativeElement.style.top, 10) + numPixels + 'px';
    }

    async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    translateSelection(numPixels: number = DirectionalMovementConstants.NUM_PIXELS): void {
        if (this.keyPressed.get('ArrowLeft')) {
            this.translateLeft(numPixels);
        }
        if (this.keyPressed.get('ArrowUp')) {
            this.translateUp(numPixels);
        }
        if (this.keyPressed.get('ArrowRight')) {
            this.translateRight(numPixels);
        }
        if (this.keyPressed.get('ArrowDown')) {
            this.translateDown(numPixels);
        }
        this.canvasMovement.emit(true);
    }
}
