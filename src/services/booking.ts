import type { Booking } from '../domain/models/Booking';
import enhancedFetch from '../lib/enhacedFetch';

export const getBookings = async (): Promise<Booking[]> => {
  const bookings = await enhancedFetch('bookings');
  return bookings as Booking[];
};
