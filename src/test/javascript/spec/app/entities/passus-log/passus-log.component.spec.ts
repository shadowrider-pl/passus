/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PassusTestModule } from '../../../test.module';
import { PassusLogComponent } from 'app/entities/passus-log/passus-log.component';
import { PassusLogService } from 'app/entities/passus-log/passus-log.service';
import { PassusLog } from 'app/shared/model/passus-log.model';

describe('Component Tests', () => {
    describe('PassusLog Management Component', () => {
        let comp: PassusLogComponent;
        let fixture: ComponentFixture<PassusLogComponent>;
        let service: PassusLogService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [PassusLogComponent],
                providers: []
            })
                .overrideTemplate(PassusLogComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PassusLogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PassusLogService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new PassusLog('123')],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.passusLogs[0]).toEqual(jasmine.objectContaining({ id: '123' }));
        });
    });
});
