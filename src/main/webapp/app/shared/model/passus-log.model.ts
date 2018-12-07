import { Moment } from 'moment';

export interface IPassusLog {
    id?: string;
    time?: Moment;
    name?: string;
    value?: string;
}

export class PassusLog implements IPassusLog {
    constructor(public id?: string, public time?: Moment, public name?: string, public value?: string) {}
}
