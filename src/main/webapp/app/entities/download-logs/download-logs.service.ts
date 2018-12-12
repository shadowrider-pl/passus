import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class DownloadLogsService {
    public resourceDownloadUrl = SERVER_API_URL + 'api/get-log-file';
    // public resourceUrl = SERVER_API_URL + 'api/passus-logs';

    constructor(private http: HttpClient) {}

    download(): any {
        return this.http.get<any>(this.resourceDownloadUrl, { responseType: 'blob' as 'json' }).subscribe(res => {
            const fileBlob = new Blob([res], { type: 'text/plain' });
            const fileURL = URL.createObjectURL(fileBlob);
            window.open(fileURL);
            // const fileToSave = new File([fileBlob], 'name');
        });
    }
}
