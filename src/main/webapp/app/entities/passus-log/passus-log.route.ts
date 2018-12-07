import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PassusLog } from 'app/shared/model/passus-log.model';
import { PassusLogService } from './passus-log.service';
import { PassusLogComponent } from './passus-log.component';
import { PassusLogDeletePopupComponent } from './passus-log-delete-dialog.component';
import { IPassusLog } from 'app/shared/model/passus-log.model';

@Injectable({ providedIn: 'root' })
export class PassusLogResolve implements Resolve<IPassusLog> {
    constructor(private service: PassusLogService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PassusLog> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PassusLog>) => response.ok),
                map((passusLog: HttpResponse<PassusLog>) => passusLog.body)
            );
        }
        return of(new PassusLog());
    }
}

export const passusLogRoute: Routes = [
    {
        path: 'passus-log',
        component: PassusLogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'passusApp.passusLog.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const passusLogPopupRoute: Routes = [
    {
        path: 'passus-log/:id/delete',
        component: PassusLogDeletePopupComponent,
        resolve: {
            passusLog: PassusLogResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'passusApp.passusLog.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
