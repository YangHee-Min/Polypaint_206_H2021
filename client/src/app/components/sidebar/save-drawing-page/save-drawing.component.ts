import { Component, ViewChild } from '@angular/core';
import * as SaveDrawingConstants from '@app/constants/save-drawing-constants';
import { DatabaseService } from '@app/services/database/database.service';
import { Message } from '@common/communication/message';
import { timeout } from 'rxjs/operators';
import { TagInputComponent } from './tag-input/tag-input.component';
import { TitleInputComponent } from './title-input/title-input.component';
@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent {
    @ViewChild('tagInput') private tagInput: TagInputComponent;
    @ViewChild('titleInput') private titleInput: TitleInputComponent;
    resultMessage: string = '';
    saveProgressEnum: typeof SaveDrawingConstants.SaveProgress = SaveDrawingConstants.SaveProgress;
    saveProgress: SaveDrawingConstants.SaveProgress = SaveDrawingConstants.SaveProgress.CHOOSING_SETTING;
    request: Message = { title: 'Error', body: '' };
    isTitleValid: boolean = false;
    areTagsValid: boolean = true;
    isSavePossible: boolean = false;

    constructor(private database: DatabaseService) {}

    verifyTitleValid(isTitleValid: boolean): void {
        this.isTitleValid = isTitleValid;
        this.verifySavePossible();
    }

    verifyTagsValid(areTagsValid: boolean): void {
        this.areTagsValid = areTagsValid;
        this.verifySavePossible();
    }

    private verifySavePossible(): void {
        this.isSavePossible = this.isTitleValid && this.areTagsValid;
    }

    saveDrawing(): void {
        this.saveProgress = SaveDrawingConstants.SaveProgress.SAVING;
        this.database
            .saveDrawing(this.titleInput.title, this.tagInput.tags)
            .pipe(timeout(SaveDrawingConstants.TIMEOUT_MAX_TIME))
            .subscribe({
                complete: () => {
                    if (this.request.title.includes('Success')) {
                        this.saveProgress = SaveDrawingConstants.SaveProgress.COMPLETE;
                    } else {
                        this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                        this.resultMessage = this.request.body;
                    }
                    this.resultMessage = this.request.body;
                },
                next: (result: Message) => {
                    this.request = result;
                },
                error: (error: Error) => {
                    this.saveProgress = SaveDrawingConstants.SaveProgress.ERROR;
                    if (error.message.includes('Timeout')) {
                        this.resultMessage = 'Temps de connection au serveur a expiré.';
                    }
                },
            });
    }
}
