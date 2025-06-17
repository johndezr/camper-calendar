import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Booking } from '@/domain/models/Booking';

vi.mock('date-fns', () => ({
  startOfWeek: vi.fn(date => {
    const result = new Date(date);
    result.setDate(result.getDate() - result.getDay());
    return result;
  }),
  endOfWeek: vi.fn(date => {
    const result = new Date(date);
    result.setDate(result.getDate() + (6 - result.getDay()));
    return result;
  }),
  startOfMonth: vi.fn(date => {
    const result = new Date(date);
    result.setDate(1);
    return result;
  }),
  endOfMonth: vi.fn(date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    return result;
  }),
  eachDayOfInterval: vi.fn(({ start, end }) => {
    const days: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }),
  format: vi.fn((date, formatStr) => {
    const d = new Date(date);
    switch (formatStr) {
      case 'MMM':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
          d.getMonth()
        ];
      case 'd':
        return d.getDate().toString();
      case 'EEE':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      default:
        return '';
    }
  }),
  parseISO: vi.fn(dateStr => new Date(dateStr)),
  getWeekOfMonth: vi.fn(date => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay();
    const diff = date.getDate() + dayOfWeek - 1;
    return Math.ceil(diff / 7);
  }),
  isSameDay: vi.fn((date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }),
}));

import {
  getCalendarDays,
  groupBookingsByDate,
  getCurrentWeekInfo,
  calculateNextWeek,
  calculatePrevWeek,
  getBookingsForDay,
} from '../../../lib/calendar';

describe('Calendar Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCalendarDays', () => {
    it('should return a 5x7 array of calendar days', () => {
      const calendarDays = getCalendarDays(2024, 2); // March 2024

      expect(calendarDays).toHaveLength(5); // 5 weeks
      expect(calendarDays[0]).toHaveLength(7); // 7 days per week

      // Verify structure of a day object
      const firstDay = calendarDays[0][0];
      expect(firstDay).toHaveProperty('date');
      expect(firstDay).toHaveProperty('month');
      expect(firstDay).toHaveProperty('dayNumber');
      expect(firstDay).toHaveProperty('dayName');
    });

    it('should start with the first day of the week containing the first day of the month', () => {
      const calendarDays = getCalendarDays(2024, 2); // March 2024
      const firstDay = calendarDays[0][0].date;

      // March 1, 2024 is a Friday, so the calendar should start on Sunday, Feb 25
      expect(firstDay.getDate()).toBe(25);
      expect(firstDay.getMonth()).toBe(1); // February
    });
  });

  describe('groupBookingsByDate', () => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        pickupReturnStationId: 'station-1',
        startDate: '2024-03-20',
        endDate: '2024-03-25',
        customerName: 'John Doe',
      },
      {
        id: '2',
        pickupReturnStationId: 'station-2',
        startDate: '2024-03-20',
        endDate: '2024-03-21',
        customerName: 'Jane Smith',
      },
    ];

    it('should group bookings by date correctly', () => {
      const groupedBookings = groupBookingsByDate(mockBookings);

      // Check start date (March 20)
      expect(groupedBookings[2024][3][20]).toHaveLength(2);
      // Check end date (March 25)
      expect(groupedBookings[2024][3][25]).toHaveLength(1);
    });

    it('should handle bookings spanning multiple days', () => {
      const groupedBookings = groupBookingsByDate(mockBookings);

      // First booking spans March 20-25
      expect(groupedBookings[2024][3][20]).toContainEqual(mockBookings[0]);
      expect(groupedBookings[2024][3][25]).toContainEqual(mockBookings[0]);
    });
  });

  describe('getCurrentWeekInfo', () => {
    it('should return current week, month and year', () => {
      const mockDate = new Date('2024-03-15');
      vi.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const weekInfo = getCurrentWeekInfo();

      expect(weekInfo).toHaveProperty('week');
      expect(weekInfo).toHaveProperty('month');
      expect(weekInfo).toHaveProperty('year');
      expect(weekInfo.year).toBe(2024);
      expect(weekInfo.month).toBe(2); // March
    });
  });

  describe('calculateNextWeek', () => {
    it('should calculate next week within same month', () => {
      const result = calculateNextWeek(1, 2, 2024); // Week 1 of March 2024

      expect(result).toEqual({
        nextWeek: 2,
        nextMonth: 2,
        nextYear: 2024,
      });
    });

    it('should handle month transition', () => {
      const result = calculateNextWeek(4, 2, 2024); // Last week of March 2024

      expect(result).toEqual({
        nextWeek: 1,
        nextMonth: 3,
        nextYear: 2024,
      });
    });

    it('should handle year transition', () => {
      const result = calculateNextWeek(4, 11, 2024); // Last week of December 2024

      expect(result).toEqual({
        nextWeek: 1,
        nextMonth: 0,
        nextYear: 2025,
      });
    });
  });

  describe('calculatePrevWeek', () => {
    it('should calculate previous week within same month', () => {
      const result = calculatePrevWeek(2, 2, 2024); // Week 2 of March 2024

      expect(result).toEqual({
        prevWeek: 1,
        prevMonth: 2,
        prevYear: 2024,
      });
    });

    it('should handle month transition', () => {
      const result = calculatePrevWeek(1, 2, 2024); // First week of March 2024

      expect(result).toEqual({
        prevWeek: 4,
        prevMonth: 1,
        prevYear: 2024,
      });
    });

    it('should handle year transition', () => {
      const result = calculatePrevWeek(1, 0, 2024); // First week of January 2024

      expect(result).toEqual({
        prevWeek: 4,
        prevMonth: 11,
        prevYear: 2023,
      });
    });
  });

  describe('getBookingsForDay', () => {
    const mockBookingsByDate = {
      2024: {
        3: {
          15: [
            {
              id: '1',
              pickupReturnStationId: 'station-1',
              startDate: '2024-03-20',
              endDate: '2024-03-25',
              customerName: 'John Doe',
            },
          ],
        },
      },
    };
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return start bookings for a day', () => {
      const day = {
        date: new Date(2024, 2, 15),
      };

      const bookings = getBookingsForDay(mockBookingsByDate, day, 'start');

      expect(bookings).toHaveLength(1);
      expect(bookings[0].id).toBe('1');
    });

    it('should return empty array for day with no bookings', () => {
      const day = {
        date: new Date(1884, 12, 31),
      };

      const bookings = getBookingsForDay(mockBookingsByDate, day, 'start');

      expect(bookings).toHaveLength(0);
    });

    it('should handle undefined bookingsByDate', () => {
      const day = {
        date: new Date('2024-03-20'),
      };

      const bookings = getBookingsForDay(undefined, day, 'start');

      expect(bookings).toHaveLength(0);
    });
  });
});
