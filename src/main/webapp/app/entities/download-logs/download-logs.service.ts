import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';
import { saveAs } from '../../../../../../node_modules/file-saver/dist/FileSaver';

@Injectable({ providedIn: 'root' })
export class DownloadLogsService {
    public resourceDownloadUrl = SERVER_API_URL + 'api/get-log-file';

    constructor(private http: HttpClient) {}

    download(): any {
        return this.http.get<any>(this.resourceDownloadUrl, { responseType: 'blob' as 'json' }).subscribe(res => {
            const fileBlob = new Blob([res], { type: 'text/plain' });
            saveAs(fileBlob, 'log.txt');
        });
    }
}
