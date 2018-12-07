import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';
import { ConvertPassusLogService } from './convert-passus-log.service';

@Component({
    selector: 'jhi-convert-passus-log-delete-dialog',
    templateUrl: './convert-passus-log-delete-dialog.component.html'
})
export class ConvertPassusLogDeleteDialogComponent {
    convertPassusLog: IConvertPassusLog;

    constructor(
        private convertPassusLogService: ConvertPassusLogService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.convertPassusLogService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'convertPassusLogListModification',
                content: 'Deleted an convertPassusLog'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-convert-passus-log-delete-popup',
    template: ''
})
export class ConvertPassusLogDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ convertPassusLog }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ConvertPassusLogDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.convertPassusLog = convertPassusLog;
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
