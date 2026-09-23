import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCard, RouterLink],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  trips: any[] = [];

  constructor(
    private tripData: TripData,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tripData.getTrips().subscribe({
      next: (data) => {
        console.log('Trips received:', data);
        this.trips = data;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.error('Unable to retrieve trips:', error);
      }
    });
  }
}
