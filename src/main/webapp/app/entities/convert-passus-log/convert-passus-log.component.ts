import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';
import { Principal } from 'app/core';
import { ConvertPassusLogService } from './convert-passus-log.service';

@Component({
    selector: 'jhi-convert-passus-log',
    templateUrl: './convert-passus-log.component.html'
})
export class ConvertPassusLogComponent implements OnInit, OnDestroy {
    convertPassusLogs: IConvertPassusLog[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private convertPassusLogService: ConvertPassusLogService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.convertPassusLogService.query().subscribe(
            (res: HttpResponse<IConvertPassusLog[]>) => {
                this.convertPassusLogs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInConvertPassusLogs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IConvertPassusLog) {
        return item.id;
    }

    registerChangeInConvertPassusLogs() {
        this.eventSubscriber = this.eventManager.subscribe('convertPassusLogListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
