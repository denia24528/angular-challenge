import { SearchComponent } from './search.component';
import { FormBuilder } from '@angular/forms';
import { AircraftService } from '../../shared/services/aircraft.service';
import { of } from 'rxjs';

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fb: FormBuilder;
    let aircraftService: jest.Mocked<AircraftService>;

    beforeEach(() => {
        fb = new FormBuilder();
        aircraftService = {
            getAircraft: jest.fn()
        } as any;
        component = new SearchComponent(fb, aircraftService);
        component.ngOnInit();
    });

    it('should initialize the form on ngOnInit', () => {
        expect(component.searchForm).toBeDefined();
        expect(component.searchForm.value).toEqual({
            selectedType: 'aircraft',
            inputValue: ''
        });
    });

    it('should clear aircrafts, flightRoutes and inputValue on type change', () => {
        component.aircrafts = [{ id: '1' } as any];
        component.flightRoutes = [{ id: '2' } as any];
        component.searchForm.patchValue({ inputValue: 'test' });
        component.onTypeChange();
        expect(component.aircrafts).toEqual([]);
        expect(component.flightRoutes).toEqual([]);
        expect(component.searchForm.value.inputValue).toBe('');
    });

    describe('fetchData', () => {
        it('should fetch aircrafts when selectedType is aircraft', (done) => {
            component.searchForm.patchValue({ inputValue: 'A1, B2', selectedType: 'aircraft' });
            const aircraft1 = { id: 'A1' } as any;
            const aircraft2 = { id: 'B2' } as any;
            aircraftService.getAircraft
                .mockReturnValueOnce(of([aircraft1]))
                .mockReturnValueOnce(of([aircraft2]));

            component.fetchData();

            setTimeout(() => {
                expect(component.aircrafts).toEqual([aircraft1, aircraft2]);
                expect(component.flightRoutes).toEqual([]);
                done();
            }, 0);
        });

        it('should fetch flightRoutes when selectedType is flightRoute', (done) => {
            component.searchForm.patchValue({ inputValue: 'R1 R2', selectedType: 'flightRoute' });
            const route1 = { id: 'R1' } as any;
            const route2 = { id: 'R2' } as any;
            aircraftService.getAircraft
                .mockReturnValueOnce(of([route1]))
                .mockReturnValueOnce(of([route2]));

            component.fetchData();

            setTimeout(() => {
                expect(component.flightRoutes).toEqual([route1, route2]);
                expect(component.aircrafts).toEqual([]);
                done();
            }, 0);
        });

        it('should filter out undefined aircrafts and flightRoutes', (done) => {
            component.searchForm.patchValue({ inputValue: 'A1, B2', selectedType: 'aircraft' });
            aircraftService.getAircraft
                .mockReturnValueOnce(of([]))
                .mockReturnValueOnce(of([{
                    id: 'B2',
                    type: '',
                    icao_type: '',
                    manufacturer: '',
                    mode_s: '',
                    registration: '',
                    operator: '',
                    operator_flag: '',
                    first_flight: '',
                    test_registration: '',
                    hex: '',
                    msn: '',
                    registered_owner_country_iso_name: '',
                    registered_owner_country_name: '',
                    registered_owner_operator_flag_code: '',
                    registered_owner: '',
                    registered_owner_country_iso_code: '',
                    url_photo: '',
                    url_photo_thumbnail: ''
                }]));

            component.fetchData();

            setTimeout(() => {
                expect(component.aircrafts).toEqual([{ id: 'B2' }]);
                done();
            }, 0);
        });
    });

    describe('onSubmit', () => {
        it('should update searchValue and call fetchData', () => {
            const spy = jest.spyOn(component, 'fetchData');
            component.searchForm.patchValue({ searchValue: 'test' });
            component.onSubmit();
            expect(component.searchValue).toBe('test');
            expect(spy).toHaveBeenCalled();
        });

        it('should default searchValue to empty string if undefined', () => {
            const spy = jest.spyOn(component, 'fetchData');
            component.searchForm.patchValue({ searchValue: undefined });
            component.onSubmit();
            expect(component.searchValue).toBe('');
            expect(spy).toHaveBeenCalled();
        });
    });
});

// We recommend installing an extension to run jest tests.