import { Aircraft, FlightRoute } from '../models/aircraft.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/environment';

@Injectable()
export class AircraftService {
  constructor(private http: HttpClient) {}

  getAircraft(searchValue: string, selectedType: string): Observable<Aircraft[]> | Observable<FlightRoute[]> {
    if (selectedType === 'aircraft') {
      return this.http.get<Aircraft[]>(
        `${API_URL}aircraft/${searchValue}`
      );
    } else {
      return this.http.get<FlightRoute[]>(
        `${API_URL}callsign/${searchValue}`
      );
    }
  }
}
