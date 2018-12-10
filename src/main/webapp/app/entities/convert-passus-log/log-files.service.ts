import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

type EntityResponseType = HttpEvent<{}>;
type EntityArrayResponseType = HttpResponse<IConvertPassusLog[]>;

@Injectable({ providedIn: 'root' })
export class LogFilesService {
    public resourceUrl = SERVER_API_URL + 'api/log-files';

    constructor(private http: HttpClient) {}

    pushFileToStorage(file: File): Observable<EntityResponseType> {
        const formdata: FormData = new FormData();

        formdata.append('file', file);

        const req = new HttpRequest('POST', this.resourceUrl, formdata, {
            reportProgress: true,
            responseType: 'text'
        });

        return this.http.request(req);
    }

    getFiles(): Observable<any> {
        return this.http.get(this.resourceUrl);
    }
}
