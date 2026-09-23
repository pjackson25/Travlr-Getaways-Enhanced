import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-trip-card',
  imports: [],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  @Input() trip: any;

  constructor(
    private router: Router,
    private tripData: TripData
  ) {}

  editTrip(): void {
    this.router.navigate(['/edit-trip', this.trip.code]);
  }

  deleteTrip(): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${this.trip.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.tripData.deleteTrip(this.trip.code).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        console.error('Unable to delete trip:', error);
      }
    });
  }
}