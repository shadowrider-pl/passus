import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';
import { Principal } from 'app/core';
import { IPassusLog } from 'app/shared/model/passus-log.model';
import { PassusLogService } from '../passus-log/passus-log.service';
import { ConvertPassusLogService } from './convert-passus-log.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'jhi-convert-passus-log',
    templateUrl: './convert-passus-log.component.html'
})
export class ConvertPassusLogComponent implements OnInit, OnDestroy {
    passusLogs: IPassusLog[];
    convertPassusLog: IConvertPassusLog;
    currentAccount: any;
    eventSubscriber: Subscription;
    time: string;
    isSaving: boolean;

    constructor(
        private convertPassusLogService: ConvertPassusLogService,
        private passusLogService: PassusLogService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    convertLog(log) {
        this.isSaving = false;
        if (log.id !== undefined) {
            this.subscribeToSaveResponse(this.convertPassusLogService.update(log));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IConvertPassusLog>>) {
        result.subscribe((res: HttpResponse<IConvertPassusLog>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

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
        this.registerChangeInConvertPassusLogs();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPassusLog) {
        return item.id;
    }

    registerChangeInConvertPassusLogs() {
        this.eventSubscriber = this.eventManager.subscribe('convertPassusLogListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.eventManager.broadcast({
            name: 'convertPassusLogListModification',
            content: 'Deleted an passusLog'
        });
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
