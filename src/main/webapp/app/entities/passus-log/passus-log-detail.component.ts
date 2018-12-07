import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPassusLog } from 'app/shared/model/passus-log.model';

@Component({
    selector: 'jhi-passus-log-detail',
    templateUrl: './passus-log-detail.component.html'
})
export class PassusLogDetailComponent implements OnInit {
    passusLog: IPassusLog;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ passusLog }) => {
            this.passusLog = passusLog;
        });
    }

    previousState() {
        window.history.back();
    }
}
