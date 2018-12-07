import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PassusPassusLogModule } from './passus-log/passus-log.module';
import { PassusConvertPassusLogModule } from './convert-passus-log/convert-passus-log.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        PassusPassusLogModule,
        PassusConvertPassusLogModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassusEntityModule {}
