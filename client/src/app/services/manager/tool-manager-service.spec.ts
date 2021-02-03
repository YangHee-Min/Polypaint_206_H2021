import { TestBed } from '@angular/core/testing';
import { ToolManagerService } from './tool-manager-service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('select tool on c keypress should select pencil', () => {
        let keyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent)).toEqual(service.pencilService);
    });
});
