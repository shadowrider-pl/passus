import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';
import { ConvertPassusLogService } from './convert-passus-log.service';

@Component({
    selector: 'jhi-convert-passus-log-update',
    templateUrl: './convert-passus-log-update.component.html'
})
export class ConvertPassusLogUpdateComponent implements OnInit {
    convertPassusLog: IConvertPassusLog;
    isSaving: boolean;
    time: string;

    constructor(private convertPassusLogService: ConvertPassusLogService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ convertPassusLog }) => {
            this.convertPassusLog = convertPassusLog;
            this.time = this.convertPassusLog.time != null ? this.convertPassusLog.time.format(DATE_TIME_FORMAT) : null;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.convertPassusLog.time = this.time != null ? moment(this.time, DATE_TIME_FORMAT) : null;
        if (this.convertPassusLog.id !== undefined) {
            this.subscribeToSaveResponse(this.convertPassusLogService.update(this.convertPassusLog));
        } else {
            this.subscribeToSaveResponse(this.convertPassusLogService.create(this.convertPassusLog));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IConvertPassusLog>>) {
        result.subscribe((res: HttpResponse<IConvertPassusLog>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
