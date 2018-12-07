/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PassusTestModule } from '../../../test.module';
import { ConvertPassusLogDeleteDialogComponent } from 'app/entities/convert-passus-log/convert-passus-log-delete-dialog.component';
import { ConvertPassusLogService } from 'app/entities/convert-passus-log/convert-passus-log.service';

describe('Component Tests', () => {
    describe('ConvertPassusLog Management Delete Component', () => {
        let comp: ConvertPassusLogDeleteDialogComponent;
        let fixture: ComponentFixture<ConvertPassusLogDeleteDialogComponent>;
        let service: ConvertPassusLogService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [ConvertPassusLogDeleteDialogComponent]
            })
                .overrideTemplate(ConvertPassusLogDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ConvertPassusLogDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ConvertPassusLogService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete('123');
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith('123');
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
