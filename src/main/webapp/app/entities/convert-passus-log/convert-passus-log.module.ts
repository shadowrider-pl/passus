import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PassusSharedModule } from 'app/shared';
import {
    ConvertPassusLogComponent,
    convertPassusLogRoute
    // convertPassusLogPopupRoute
} from './';

const ENTITY_STATES = [...convertPassusLogRoute];

@NgModule({
    imports: [PassusSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [ConvertPassusLogComponent],
    entryComponents: [ConvertPassusLogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassusConvertPassusLogModule {}
