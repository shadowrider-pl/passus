import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SendFileToServerComponent } from 'app/entities/send-file-to-server/send-file-to-server.component';

// @Injectable({ providedIn: 'root' })
// export class SendFileToServerModuleResolve implements Resolve<IConvertPassusLog> {
//     constructor(private service: ConvertPassusLogService) {}

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ConvertPassusLog> {
//         const id = route.params['id'] ? route.params['id'] : null;
//         if (id) {
//             return this.service.find(id).pipe(
//                 filter((response: HttpResponse<ConvertPassusLog>) => response.ok),
//                 map((convertPassusLog: HttpResponse<ConvertPassusLog>) => convertPassusLog.body)
//             );
//         }
//         return of(new ConvertPassusLog());
//     }
// }

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
