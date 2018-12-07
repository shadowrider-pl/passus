import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPassusLog } from 'app/shared/model/passus-log.model';
import { Principal } from 'app/core';
import { PassusLogService } from './passus-log.service';

@Component({
    selector: 'jhi-passus-log',
    templateUrl: './passus-log.component.html'
})
export class PassusLogComponent implements OnInit, OnDestroy {
    passusLogs: IPassusLog[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private passusLogService: PassusLogService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.passusLogService.query().subscribe(
            (res: HttpResponse<IPassusLog[]>) => {
                this.passusLogs = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPassusLogs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPassusLog) {
        return item.id;
    }

    registerChangeInPassusLogs() {
        this.eventSubscriber = this.eventManager.subscribe('passusLogListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
