/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PassusTestModule } from '../../../test.module';
import { PassusLogDetailComponent } from 'app/entities/passus-log/passus-log-detail.component';
import { PassusLog } from 'app/shared/model/passus-log.model';

describe('Component Tests', () => {
    describe('PassusLog Management Detail Component', () => {
        let comp: PassusLogDetailComponent;
        let fixture: ComponentFixture<PassusLogDetailComponent>;
        const route = ({ data: of({ passusLog: new PassusLog('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [PassusLogDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PassusLogDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PassusLogDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.passusLog).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
