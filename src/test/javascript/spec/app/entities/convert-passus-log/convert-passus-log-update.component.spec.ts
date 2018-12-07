/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { PassusTestModule } from '../../../test.module';
import { ConvertPassusLogUpdateComponent } from 'app/entities/convert-passus-log/convert-passus-log-update.component';
import { ConvertPassusLogService } from 'app/entities/convert-passus-log/convert-passus-log.service';
import { ConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

describe('Component Tests', () => {
    describe('ConvertPassusLog Management Update Component', () => {
        let comp: ConvertPassusLogUpdateComponent;
        let fixture: ComponentFixture<ConvertPassusLogUpdateComponent>;
        let service: ConvertPassusLogService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [ConvertPassusLogUpdateComponent]
            })
                .overrideTemplate(ConvertPassusLogUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ConvertPassusLogUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ConvertPassusLogService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ConvertPassusLog('123');
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.convertPassusLog = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ConvertPassusLog();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.convertPassusLog = entity;
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
