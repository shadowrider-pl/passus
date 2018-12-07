import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPassusLog } from 'app/shared/model/passus-log.model';
import { PassusLogService } from './passus-log.service';

@Component({
    selector: 'jhi-passus-log-update',
    templateUrl: './passus-log-update.component.html'
})
export class PassusLogUpdateComponent implements OnInit {
    passusLog: IPassusLog;
    isSaving: boolean;
    time: string;

    constructor(private passusLogService: PassusLogService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ passusLog }) => {
            this.passusLog = passusLog;
            this.time = this.passusLog.time != null ? this.passusLog.time.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.passusLog.time = this.time != null ? moment(this.time, DATE_TIME_FORMAT) : null;
        if (this.passusLog.id !== undefined) {
            this.subscribeToSaveResponse(this.passusLogService.update(this.passusLog));
        } else {
            this.subscribeToSaveResponse(this.passusLogService.create(this.passusLog));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IPassusLog>>) {
        result.subscribe((res: HttpResponse<IPassusLog>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
