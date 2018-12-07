/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PassusTestModule } from '../../../test.module';
import { ConvertPassusLogComponent } from 'app/entities/convert-passus-log/convert-passus-log.component';
import { ConvertPassusLogService } from 'app/entities/convert-passus-log/convert-passus-log.service';
import { ConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

describe('Component Tests', () => {
    describe('ConvertPassusLog Management Component', () => {
        let comp: ConvertPassusLogComponent;
        let fixture: ComponentFixture<ConvertPassusLogComponent>;
        let service: ConvertPassusLogService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [ConvertPassusLogComponent],
                providers: []
            })
                .overrideTemplate(ConvertPassusLogComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ConvertPassusLogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ConvertPassusLogService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ConvertPassusLog('123')],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.convertPassusLogs[0]).toEqual(jasmine.objectContaining({ id: '123' }));
        });
    });
});
