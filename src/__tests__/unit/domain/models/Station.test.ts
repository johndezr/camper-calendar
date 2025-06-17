import { describe, it, expect } from 'vitest';
import type { Station } from '@/domain/models/Station';
import type { Booking } from '@/domain/models/Booking';

describe('Station Model', () => {
  it('should have all required properties', () => {
    const station: Station = {
      id: 'station-1',
      name: 'Station A',
      bookings: [],
    };

    expect(station).toHaveProperty('id');
    expect(station).toHaveProperty('name');
    expect(station).toHaveProperty('bookings');
    expect(Array.isArray(station.bookings)).toBe(true);
  });

  it('should be able to have bookings', () => {
    const booking: Booking = {
      id: '1',
      pickupReturnStationId: 'station-1',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      customerName: 'John Doe',
    };

    const station: Station = {
      id: 'station-1',
      name: 'Station A',
      bookings: [booking],
    };

    expect(station.bookings).toHaveLength(1);
    expect(station.bookings[0]).toEqual(booking);
  });

  it('should have a non-empty name', () => {
    const station: Station = {
      id: 'station-1',
      name: 'Station A',
      bookings: [],
    };

    expect(station.name).toBeTruthy();
    expect(typeof station.name).toBe('string');
    expect(station.name.length).toBeGreaterThan(0);
  });
});
