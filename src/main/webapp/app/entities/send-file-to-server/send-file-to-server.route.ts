import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { SendFileToServerComponent } from 'app/entities/send-file-to-server/send-file-to-server.component';

export const sendFileToServerModuleRoute: Routes = [
    {
        path: 'send-file-to-server',
        component: SendFileToServerComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'passusApp.convertPassusLog.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];
