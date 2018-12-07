import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConvertPassusLog } from 'app/shared/model/convert-passus-log.model';
import { ConvertPassusLogService } from './convert-passus-log.service';
import { ConvertPassusLogComponent } from './convert-passus-log.component';
import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

@Injectable({ providedIn: 'root' })
export class ConvertPassusLogResolve implements Resolve<IConvertPassusLog> {
    constructor(private service: ConvertPassusLogService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ConvertPassusLog> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ConvertPassusLog>) => response.ok),
                map((convertPassusLog: HttpResponse<ConvertPassusLog>) => convertPassusLog.body)
            );
        }
        return of(new ConvertPassusLog());
    }
}

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
    // {
    //     path: 'convert-passus-log/:id/view',
    //     component: ConvertPassusLogDetailComponent,
    //     resolve: {
    //         convertPassusLog: ConvertPassusLogResolve
    //     },
    //     data: {
    //         authorities: ['ROLE_USER'],
    //         pageTitle: 'passusApp.convertPassusLog.home.title'
    //     },
    //     canActivate: [UserRouteAccessService]
    // },
    // {
    //     path: 'convert-passus-log/new',
    //     component: ConvertPassusLogUpdateComponent,
    //     resolve: {
    //         convertPassusLog: ConvertPassusLogResolve
    //     },
    //     data: {
    //         authorities: ['ROLE_USER'],
    //         pageTitle: 'passusApp.convertPassusLog.home.title'
    //     },
    //     canActivate: [UserRouteAccessService]
    // },
    // {
    //     path: 'convert-passus-log/:id/edit',
    //     component: ConvertPassusLogUpdateComponent,
    //     resolve: {
    //         convertPassusLog: ConvertPassusLogResolve
    //     },
    //     data: {
    //         authorities: ['ROLE_USER'],
    //         pageTitle: 'passusApp.convertPassusLog.home.title'
    //     },
    //     canActivate: [UserRouteAccessService]
    // }
];

// export const convertPassusLogPopupRoute: Routes = [
//     {
//         path: 'convert-passus-log/:id/delete',
//         component: ConvertPassusLogDeletePopupComponent,
//         resolve: {
//             convertPassusLog: ConvertPassusLogResolve
//         },
//         data: {
//             authorities: ['ROLE_USER'],
//             pageTitle: 'passusApp.convertPassusLog.home.title'
//         },
//         canActivate: [UserRouteAccessService],
//         outlet: 'popup'
//     }
// ];
