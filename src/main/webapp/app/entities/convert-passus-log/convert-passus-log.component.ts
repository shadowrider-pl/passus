import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';
import { Principal } from 'app/core';
import { IPassusLog } from 'app/shared/model/passus-log.model';
import { PassusLogService } from '../passus-log/passus-log.service';
import { ConvertPassusLogService } from './convert-passus-log.service';
import { Observable } from 'rxjs';
import { LogFilesService } from 'app/entities/convert-passus-log/log-files.service';

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
    selectedFiles: FileList;
    currentFileUpload: File;
    progress: { percentage: number } = { percentage: 0 };
    showFile = false;
    fileUploads: Observable<string[]>;

    constructor(
        private convertPassusLogService: ConvertPassusLogService,
        private passusLogService: PassusLogService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private logFilesService: LogFilesService
    ) {}

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    upload() {
        this.progress.percentage = 0;

        this.currentFileUpload = this.selectedFiles.item(0);
        this.logFilesService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progress.percentage = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
                console.log('File is completely uploaded!');
            }
        });

        this.selectedFiles = undefined;
        setTimeout(() => {
            this.currentFileUpload = null;
        }, 3000);
    }

    showFiles(enable: boolean) {
        this.showFile = enable;

        if (enable) {
            this.fileUploads = this.logFilesService.getFiles();
        }
    }

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
