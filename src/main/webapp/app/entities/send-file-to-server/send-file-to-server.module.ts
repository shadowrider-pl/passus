import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PassusSharedModule } from 'app/shared';
import { sendFileToServerModuleRoute } from 'app/entities/send-file-to-server/send-file-to-server.route';
import { SendFileToServerComponent } from 'app/entities/send-file-to-server/send-file-to-server.component';

const ENTITY_STATES = [...sendFileToServerModuleRoute];

@NgModule({
    imports: [PassusSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [SendFileToServerComponent],
    entryComponents: [SendFileToServerComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SendFileToServerModule {}
