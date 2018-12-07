/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { PassusTestModule } from '../../../test.module';
import { PassusLogDeleteDialogComponent } from 'app/entities/passus-log/passus-log-delete-dialog.component';
import { PassusLogService } from 'app/entities/passus-log/passus-log.service';

describe('Component Tests', () => {
    describe('PassusLog Management Delete Component', () => {
        let comp: PassusLogDeleteDialogComponent;
        let fixture: ComponentFixture<PassusLogDeleteDialogComponent>;
        let service: PassusLogService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [PassusLogDeleteDialogComponent]
            })
                .overrideTemplate(PassusLogDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PassusLogDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PassusLogService);
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
