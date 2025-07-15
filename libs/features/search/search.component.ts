import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Aircraft, FlightRoute } from '../../shared/models/aircraft.model';
import { FormBuilder } from '@angular/forms';
import { AircraftService } from '@shared/services/aircraft.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'feature-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  providers: [AircraftService],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm!: ReturnType<FormBuilder['group']>;
  aircrafts: Aircraft[] = [];
  flightRoutes: FlightRoute[] = [];
  searchValue = '';
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private aircraftService: AircraftService) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      selectedType: ['aircraft'],
      inputValue: ['']
    });
  }

  /**
   * Fetches aircraft or flight route data based on user input from the search form.
   * 
   * - Splits the input string into an array of trimmed, non-empty codes.
   * - For each code, sends a request to fetch data using `aircraftService.getAircraft`.
   * - Uses `forkJoin` to wait for all requests to complete.
   * - Depending on the selected type (`aircraft` or `flightRoute`), updates the corresponding component property (`aircrafts` or `flightRoutes`)
   *   with the fetched results, filtering out any undefined values.
   *
   * @remarks
   * This method assumes that `searchForm.value` contains `inputValue` (string) and `selectedType` (string).
   * The `selectedType` determines whether aircraft or flight route data is fetched and stored.
   */
  fetchData(): void {
    const { inputValue, selectedType } = this.searchForm.value;
    // Splits the given input string into an array of trimmed, non-empty codes.
    const codes = inputValue
      .split(/[\s,]+/)
      .map((code: string) => code.trim())
      .filter(Boolean);

    // An array of observables representing requests to fetch aircraft data for each code in the `codes` array
    const requests = codes.map((code: string) =>
      this.aircraftService.getAircraft(code, selectedType)
    );
    console.log('Requests:', requests);

    /** This block executes all API requests in parallel using forkJoin.
     * When all requests complete, it checks the selected search type.
     * If 'aircraft' is selected, it extracts and filters valid aircraft objects from the results.
     * If 'flightRoute' is selected, it extracts and filters valid flight route objects.
     * Any errors during the requests are logged and a user-friendly error message is set.
     */
    forkJoin<{ response: { aircraft?: Aircraft; flightroute?: FlightRoute } }[]>(requests).subscribe({
      next: (results) => {
        if (selectedType === 'aircraft') {
          // Map to extract the nested aircraft object
          this.aircrafts = results
            .map(res => res?.response?.aircraft)
            .filter((aircraft): aircraft is Aircraft => Boolean(aircraft));
        } else {
          // Map to extract the nested flightRoute object
          this.flightRoutes = results
            .map(res => res?.response?.flightroute)
            .filter((route): route is FlightRoute => Boolean(route));
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.errorMessage = err.error.response + '. Failed to fetch data. Please try again.';
      }
    });
  }

  /**
   * Handles the form submission event.
   * Updates the `searchValue` property with the value from the search form,
   * defaulting to an empty string if undefined, and triggers data fetching.
   */
  onSubmit(): void {
    this.searchValue = this.searchForm.value.searchValue ?? '';
    this.fetchData();
  }

  /** Clear results and input field if needed */
  onTypeChange(): void {
    this.aircrafts = [];
    this.flightRoutes = [];
    this.searchForm.patchValue({ inputValue: '' });
  }

}
