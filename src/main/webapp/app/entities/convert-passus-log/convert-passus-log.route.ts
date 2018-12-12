import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { ConvertPassusLogComponent } from './convert-passus-log.component';

export const convertPassusLogRoute: Routes = [
    {
        path: 'convert-passus-log',
        component: ConvertPassusLogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'passusApp.convertPassusLog.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
