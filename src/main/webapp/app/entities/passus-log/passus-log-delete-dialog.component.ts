import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPassusLog } from 'app/shared/model/passus-log.model';
import { PassusLogService } from './passus-log.service';

@Component({
    selector: 'jhi-passus-log-delete-dialog',
    templateUrl: './passus-log-delete-dialog.component.html'
})
export class PassusLogDeleteDialogComponent {
    passusLog: IPassusLog;

    constructor(private passusLogService: PassusLogService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.passusLogService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'passusLogListModification',
                content: 'Deleted an passusLog'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-passus-log-delete-popup',
    template: ''
})
export class PassusLogDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ passusLog }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PassusLogDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.passusLog = passusLog;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
