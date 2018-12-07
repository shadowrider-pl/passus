import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PassusSharedModule } from 'app/shared';
import {
    PassusLogComponent,
    PassusLogDetailComponent,
    PassusLogUpdateComponent,
    PassusLogDeletePopupComponent,
    PassusLogDeleteDialogComponent,
    passusLogRoute,
    passusLogPopupRoute
} from './';

const ENTITY_STATES = [...passusLogRoute, ...passusLogPopupRoute];

@NgModule({
    imports: [PassusSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PassusLogComponent,
        PassusLogDetailComponent,
        PassusLogUpdateComponent,
        PassusLogDeleteDialogComponent,
        PassusLogDeletePopupComponent
    ],
    entryComponents: [PassusLogComponent, PassusLogUpdateComponent, PassusLogDeleteDialogComponent, PassusLogDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassusPassusLogModule {}
