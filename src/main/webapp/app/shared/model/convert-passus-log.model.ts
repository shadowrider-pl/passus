import { Moment } from 'moment';

export interface IConvertPassusLog {
    id?: string;
    time?: Moment;
    name?: string;
    value?: string;
}

export class ConvertPassusLog implements IConvertPassusLog {
    constructor(public id?: string, public time?: Moment, public name?: string, public value?: string) {}
}
