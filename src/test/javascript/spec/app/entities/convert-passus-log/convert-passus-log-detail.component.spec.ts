/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PassusTestModule } from '../../../test.module';
import { ConvertPassusLogDetailComponent } from 'app/entities/convert-passus-log/convert-passus-log-detail.component';
import { ConvertPassusLog } from 'app/shared/model/convert-passus-log.model';

describe('Component Tests', () => {
    describe('ConvertPassusLog Management Detail Component', () => {
        let comp: ConvertPassusLogDetailComponent;
        let fixture: ComponentFixture<ConvertPassusLogDetailComponent>;
        const route = ({ data: of({ convertPassusLog: new ConvertPassusLog('123') }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [PassusTestModule],
                declarations: [ConvertPassusLogDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ConvertPassusLogDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ConvertPassusLogDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.convertPassusLog).toEqual(jasmine.objectContaining({ id: '123' }));
            });
        });
    });
});
