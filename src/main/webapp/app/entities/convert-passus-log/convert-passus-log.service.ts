import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

type EntityResponseType = HttpResponse<IConvertPassusLog>;
type EntityArrayResponseType = HttpResponse<IConvertPassusLog[]>;

@Injectable({ providedIn: 'root' })
export class ConvertPassusLogService {
    public resourceUrl = SERVER_API_URL + 'api/convert-passus-logs';

    constructor(private http: HttpClient) {}

    create(convertPassusLog: IConvertPassusLog): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(convertPassusLog);
        return this.http
            .post<IConvertPassusLog>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

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

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IConvertPassusLog[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
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
