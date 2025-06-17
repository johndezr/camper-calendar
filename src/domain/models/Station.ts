import type { Booking } from './Booking';

export interface Station {
  id: string;
  name: string;
  bookings: Booking[];
}
