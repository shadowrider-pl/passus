import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

@Component({
    selector: 'jhi-convert-passus-log-detail',
    templateUrl: './convert-passus-log-detail.component.html'
})
export class ConvertPassusLogDetailComponent implements OnInit {
    convertPassusLog: IConvertPassusLog;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ convertPassusLog }) => {
            this.convertPassusLog = convertPassusLog;
        });
    }

    previousState() {
        window.history.back();
    }
}
