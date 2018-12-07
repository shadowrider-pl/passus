import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPassusLog } from 'app/shared/model/passus-log.model';

type EntityResponseType = HttpResponse<IPassusLog>;
type EntityArrayResponseType = HttpResponse<IPassusLog[]>;

@Injectable({ providedIn: 'root' })
export class PassusLogService {
    public resourceUrl = SERVER_API_URL + 'api/passus-logs';

    constructor(private http: HttpClient) {}

    create(passusLog: IPassusLog): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(passusLog);
        return this.http
            .post<IPassusLog>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(passusLog: IPassusLog): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(passusLog);
        return this.http
            .put<IPassusLog>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http
            .get<IPassusLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPassusLog[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(passusLog: IPassusLog): IPassusLog {
        const copy: IPassusLog = Object.assign({}, passusLog, {
            time: passusLog.time != null && passusLog.time.isValid() ? passusLog.time.toJSON() : null
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
            res.body.forEach((passusLog: IPassusLog) => {
                passusLog.time = passusLog.time != null ? moment(passusLog.time) : null;
            });
        }
        return res;
    }
}
