import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Principal } from 'app/core';
import { IPassusLog } from 'app/shared/model/passus-log.model';
import { PassusLogService } from '../passus-log/passus-log.service';
import { SendFileToServerService } from 'app/entities/send-file-to-server/send-file-to-server.service';

@Component({
    selector: 'jhi-send-file-to-server',
    templateUrl: './send-file-to-server.component.html'
})
export class SendFileToServerComponent implements OnInit, OnDestroy {
    currentAccount: any;
    eventSubscriber: Subscription;
    isSaving: boolean;
    selectedFiles: FileList;
    currentFileUpload: File;
    progress: { percentage: number } = { percentage: 0 };
    showFile = false;
    fileUploads: String[];

    constructor(
        private passusLogService: PassusLogService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private sendFileToServerService: SendFileToServerService
    ) {}

    addLogsFromFile(file) {
        const lastIndex = file.lastIndexOf('/');
        file = file.substring(lastIndex + 1);
        this.sendFileToServerService.addLogs(file).subscribe(response => {
            this.eventManager.broadcast({
                name: 'filesListModification',
                content: 'Deleted an file'
            });
        });
    }

    deleteFile(file) {
        const lastIndex = file.lastIndexOf('/');
        file = file.substring(lastIndex + 1);
        this.sendFileToServerService.delete(file).subscribe(response => {
            this.eventManager.broadcast({
                name: 'filesListModification',
                content: 'Deleted an file'
            });
        });
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    upload() {
        this.progress.percentage = 0;

        this.currentFileUpload = this.selectedFiles.item(0);
        this.sendFileToServerService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progress.percentage = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
                console.log('File is completely uploaded!');
                this.eventManager.broadcast({
                    name: 'filesListModification',
                    content: 'Added file'
                });
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
            this.fileUploads = null;
            this.sendFileToServerService.getFiles().subscribe(
                (res: HttpResponse<String[]>) => {
                    this.fileUploads = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        }
    }

    loadAll() {
        this.showFiles(true);
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInLogFilesList();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPassusLog) {
        return item.id;
    }

    registerChangeInLogFilesList() {
        this.eventSubscriber = this.eventManager.subscribe('filesListModification', response => this.showFiles(true));
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.eventManager.broadcast({
            name: 'filesListModification',
            content: 'Deleted an file'
        });
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
