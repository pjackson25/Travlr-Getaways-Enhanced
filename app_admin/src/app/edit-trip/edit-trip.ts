import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  trip: any = {
    code: '',
    name: '',
    length: '',
    start: '',
    resort: '',
    perPerson: '',
    image: '',
    description: ''
  };

  private originalCode = '';

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private tripData: TripData,
  private changeDetector: ChangeDetectorRef
) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('tripCode');

    console.log('Trip code from URL:', code);

    if (!code) {
      console.error('Trip code is missing.');
      this.router.navigate(['/']);
      return;
    }

    this.originalCode = code;

    this.tripData.getTrip(code).subscribe({
      next: (data) => {
  console.log('Trip received:', data);

  this.trip = data;

  if (this.trip.start) {
    this.trip.start = this.trip.start.substring(0, 10);
  }

  this.changeDetector.detectChanges();
},
      error: (error) => {
        console.error('Unable to retrieve trip:', error);
      }
    });
  }

  updateTrip(): void {
  console.log('Update Trip button clicked', this.trip);

  this.tripData
    .updateTrip(this.originalCode, this.trip)
    .subscribe({
      next: () => {
        console.log('Trip updated successfully!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Unable to update trip:', error);
      }
    });
}
  cancel(): void {
    this.router.navigate(['/']);
  }
}