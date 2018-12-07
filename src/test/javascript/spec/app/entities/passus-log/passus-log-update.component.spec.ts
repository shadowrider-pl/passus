/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PassusTestModule } from '../../../test.module';
import { PassusLogUpdateComponent } from 'app/entities/passus-log/passus-log-update.component';
import { PassusLogService } from 'app/entities/passus-log/passus-log.service';
import { PassusLog } from 'app/shared/model/passus-log.model';

describe('Component Tests', () => {
    describe('PassusLog Management Update Component', () => {
        let comp: PassusLogUpdateComponent;
        let fixture: ComponentFixture<PassusLogUpdateComponent>;
        let service: PassusLogService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [PassusLogUpdateComponent]
            })
                .overrideTemplate(PassusLogUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PassusLogUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PassusLogService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PassusLog('123');
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.passusLog = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PassusLog();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.passusLog = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
