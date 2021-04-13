import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import * as ExportDrawingConstants from '@app/constants/export-drawing-constants';
import { ImgurService } from './imgur.service';

describe('ImgurService', () => {
    let service: ImgurService;
    let httpMock: HttpTestingController;

    const STRING_IMG = 'uselessData,thisistheimage';
    const IMG = 'thisistheimage';
    const URL = 'www.url.com';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ImgurService],
        });
        service = TestBed.inject(ImgurService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('exportDrawing should send image to imgur server', () => {
        const canvas = document.createElement('canvas');
        let image = 'data,';
        image += canvas.toDataURL();
        const imageName = 'name';

        service.exportDrawing(image, imageName);
        expect(service.isSendingRequest).toEqual(false);
    });

    it('createHeaders should create and return correct header', () => {
        const headers = new Headers();
        headers.append('Authorization', 'Client-ID 7cb69a96d40be21');

        const returnValue = service.createHeaders();
        expect(returnValue).toEqual(headers);
    });

    it('createBody should create and return correct body', () => {
        const formData = new FormData();
        formData.append('image', IMG);
        formData.append('name', 'name');

        const returnValue = service.createBody(IMG, 'name');
        expect(returnValue).toEqual(formData);
    });

    it('createRequestOptions should create and return correct requestOptions', () => {
        const headers = new Headers();
        headers.append('Authorization', 'Client-ID 7cb69a96d40be21');
        const formData = new FormData();
        formData.append('image', IMG);
        formData.append('name', 'name');
        const requestOptions = {
            method: 'POST',
            headers,
            body: formData,
        };

        const returnValue = service.createRequestOptions(headers, formData);
        expect(returnValue).toEqual(requestOptions);
    });

    it('setDataFromResponse should set exportProgress and url correctly if status = 200', () => {
        const setUrlFromResponseSpy = spyOn(service, 'setUrlFromResponse');
        const setExportProgressSpy = spyOn(service, 'setExportProgress');

        service.setDataFromResponse(ExportDrawingConstants.OK_STATUS, URL);
        expect(setUrlFromResponseSpy).toHaveBeenCalledWith(URL);
        expect(setExportProgressSpy).toHaveBeenCalledWith(ExportDrawingConstants.ExportProgress.COMPLETE);
    });

    it('setDataFromResponse should set exportProgress and url correctly if status != 200', () => {
        const setUrlFromResponseSpy = spyOn(service, 'setUrlFromResponse');
        const setExportProgressSpy = spyOn(service, 'setExportProgress');

        service.setDataFromResponse(ExportDrawingConstants.BAD_REQUEST, URL);
        expect(setUrlFromResponseSpy).toHaveBeenCalledWith('none');
        expect(setExportProgressSpy).toHaveBeenCalledWith(ExportDrawingConstants.ExportProgress.ERROR);
    });

    it('setUrlFromResponse should set url correctly', () => {
        service.setUrlFromResponse(URL);
        expect(service.serviceSettings[ExportDrawingConstants.URL]).toEqual(URL);
    });

    it('setExportProgress should set exportProgress correctly', () => {
        service.setExportProgress(ExportDrawingConstants.ExportProgress.COMPLETE);
        expect(service.serviceSettings[ExportDrawingConstants.EXPORT_PROGRESS]).toEqual(ExportDrawingConstants.ExportProgress.COMPLETE);
    });

    it('imageStringSplit should split string correctly', () => {
        const result = service.imageStringSplit(STRING_IMG);
        expect(result).toEqual('thisistheimage');
    });

    it('resetServiceSettings should split string correctly', () => {
        const nextSpy = spyOn(service.serviceSettingsSource, 'next');

        service.resetServiceSettings();

        expect(nextSpy).toHaveBeenCalled();
        expect(service.serviceSettings[0]).toEqual(ExportDrawingConstants.ExportProgress.CHOOSING_SETTING);
        expect(service.serviceSettings[1]).toEqual('none');
    });
});