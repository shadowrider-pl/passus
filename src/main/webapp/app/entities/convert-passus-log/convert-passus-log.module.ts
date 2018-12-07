import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PassusSharedModule } from 'app/shared';
import {
    ConvertPassusLogComponent,
    ConvertPassusLogDetailComponent,
    ConvertPassusLogUpdateComponent,
    ConvertPassusLogDeletePopupComponent,
    ConvertPassusLogDeleteDialogComponent,
    convertPassusLogRoute,
    convertPassusLogPopupRoute
} from './';

const ENTITY_STATES = [...convertPassusLogRoute, ...convertPassusLogPopupRoute];

@NgModule({
    imports: [PassusSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ConvertPassusLogComponent,
        ConvertPassusLogDetailComponent,
        ConvertPassusLogUpdateComponent,
        ConvertPassusLogDeleteDialogComponent,
        ConvertPassusLogDeletePopupComponent
    ],
    entryComponents: [
        ConvertPassusLogComponent,
        ConvertPassusLogUpdateComponent,
        ConvertPassusLogDeleteDialogComponent,
        ConvertPassusLogDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassusConvertPassusLogModule {}
