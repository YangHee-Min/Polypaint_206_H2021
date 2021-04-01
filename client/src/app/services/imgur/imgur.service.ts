import { Injectable } from '@angular/core';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ImgurService {
    private readonly IMGUR_URL: string = 'https://api.imgur.com/3/image/';
    private readonly CLIENT_ID: string = 'Client-ID 7cb69a96d40be21';

    responseStatus: number = 0;
    data: string;

    url: string;
    urlSource: Subject<string>;
    urlObservable: Observable<string>;

    exportProgressEnum: typeof ExportDrawingConstants.ExportProgress = ExportDrawingConstants.ExportProgress;
    exportProgress: ExportDrawingConstants.ExportProgress;
    exportProgressSource: Subject<number>;
    exportProgressObservable: Observable<number>;

    constructor() {
        this.url = '';
        this.urlSource = new BehaviorSubject<string>(this.url);
        this.urlObservable = this.urlSource.asObservable();

        this.exportProgress = ExportDrawingConstants.ExportProgress.CHOOSING_SETTING;
        this.exportProgressSource = new BehaviorSubject<number>(this.exportProgress);
        this.exportProgressObservable = this.exportProgressSource.asObservable();
    }

    exportDrawing(imageString: string, name: string): void {
        let img = this.imageStringSplit(imageString);
        const headers = new Headers();
        headers.append('Authorization', this.CLIENT_ID);
        const formData = new FormData();
        formData.append('image', img);

        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: formData,
        };

        fetch(this.IMGUR_URL, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    this.setUrlFromResponse(data);
                    this.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
                } else {
                    this.url = 'none';
                    this.urlSource.next(this.url);
                    this.setExportProgress(ExportDrawingConstants.ExportProgress.ERROR);
                }
            })
            .catch((error) => {
                console.log(error);
                this.setExportProgress(ExportDrawingConstants.ExportProgress.ERROR);
            });
    }

    setUrlFromResponse(data: any): void {
        this.url = data.data.link;
        this.urlSource.next(this.url);
    }

    setExportProgress(progress: number): void {
        this.exportProgress = progress;
        this.exportProgressSource.next(this.exportProgress);
    }

    imageStringSplit(img: string): string {
        let stringArray = img.split(',');
        return stringArray[1];
    }
}
