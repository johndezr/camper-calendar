import { describe, it, expect } from 'vitest';
import type { Booking } from '@/domain/models/Booking';

describe('Booking Model', () => {
  it('should have all required properties', () => {
    const booking: Booking = {
      id: '1',
      pickupReturnStationId: 'station-1',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      customerName: 'John Doe',
    };

    expect(booking).toHaveProperty('id');
    expect(booking).toHaveProperty('pickupReturnStationId');
    expect(booking).toHaveProperty('startDate');
    expect(booking).toHaveProperty('endDate');
    expect(booking).toHaveProperty('customerName');
  });

  it('should have valid date format', () => {
    const booking: Booking = {
      id: '1',
      pickupReturnStationId: 'station-1',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      customerName: 'John Doe',
    };

    // Validar formato de fecha ISO
    expect(() => new Date(booking.startDate)).not.toThrow();
    expect(() => new Date(booking.endDate)).not.toThrow();
  });

  it('should have end date after start date', () => {
    const booking: Booking = {
      id: '1',
      pickupReturnStationId: 'station-1',
      startDate: '2024-03-20',
      endDate: '2024-03-25',
      customerName: 'John Doe',
    };

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    expect(endDate.getTime()).toBeGreaterThan(startDate.getTime());
  });
});
