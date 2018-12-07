import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

type EntityResponseType = HttpResponse<IConvertPassusLog>;
type EntityArrayResponseType = HttpResponse<IConvertPassusLog[]>;

@Injectable({ providedIn: 'root' })
export class ConvertPassusLogService {
    public resourceUrl = SERVER_API_URL + 'api/convert-log';

    constructor(private http: HttpClient) {}

    update(convertPassusLog: IConvertPassusLog): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(convertPassusLog);
        return this.http
            .put<IConvertPassusLog>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http
            .get<IConvertPassusLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    protected convertDateFromClient(convertPassusLog: IConvertPassusLog): IConvertPassusLog {
        const copy: IConvertPassusLog = Object.assign({}, convertPassusLog, {
            time: convertPassusLog.time != null && convertPassusLog.time.isValid() ? convertPassusLog.time.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.time = res.body.time != null ? moment(res.body.time) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((convertPassusLog: IConvertPassusLog) => {
                convertPassusLog.time = convertPassusLog.time != null ? moment(convertPassusLog.time) : null;
            });
        }
        return res;
    }
}
