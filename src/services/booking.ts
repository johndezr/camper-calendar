import type { Booking } from '../domain/models/Booking';
import enhancedFetch from '../lib/enhacedFetch';

export const getBookings = async (): Promise<Booking[]> => {
  const bookings = await enhancedFetch('bookings');
  return bookings as Booking[];
};

export const getBookingById = async (id: string): Promise<Booking> => {
  const booking = await enhancedFetch(`bookings/${id}`);
  return booking as Booking;
};
