import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
  getWeekOfMonth,
  isSameDay,
} from 'date-fns';
import type { Booking } from '../domain/models/Booking';

type BookingsByDate = {
  [year: number]: {
    [month: number]: {
      [day: number]: Booking[];
    };
  };
};

function getCalendarDays(year = new Date().getFullYear(), month = new Date().getMonth()) {
  const start = startOfWeek(startOfMonth(new Date(year, month)));
  const end = endOfWeek(endOfMonth(new Date(year, month)));
  const intervalDays = eachDayOfInterval({ start, end });

  let count = -1;
  return new Array(5).fill([]).map(() => {
    return new Array(7).fill([]).map(() => {
      count++;
      return {
        date: intervalDays[count],
        month: format(intervalDays[count], 'MMM'),
        dayNumber: format(intervalDays[count], 'd'),
        dayName: format(intervalDays[count], 'EEE'),
      };
    });
  });
}

export function groupBookingsByDate(bookings: Booking[]): BookingsByDate {
  const result: BookingsByDate = {};

  bookings.forEach(booking => {
    const start = parseISO(booking.startDate);
    const startYear = start.getFullYear();
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();

    if (!result[startYear]) result[startYear] = {};
    if (!result[startYear][startMonth]) result[startYear][startMonth] = {};
    if (!result[startYear][startMonth][startDay]) result[startYear][startMonth][startDay] = [];
    result[startYear][startMonth][startDay].push(booking);

    const end = parseISO(booking.endDate);
    if (
      end.getFullYear() !== startYear ||
      end.getMonth() + 1 !== startMonth ||
      end.getDate() !== startDay
    ) {
      const endYear = end.getFullYear();
      const endMonth = end.getMonth() + 1;
      const endDay = end.getDate();

      if (!result[endYear]) result[endYear] = {};
      if (!result[endYear][endMonth]) result[endYear][endMonth] = {};
      if (!result[endYear][endMonth][endDay]) result[endYear][endMonth][endDay] = [];
      result[endYear][endMonth][endDay].push(booking);
    }
  });

  return result;
}

export function getCurrentWeekInfo() {
  const now = new Date();
  return {
    week: getWeekOfMonth(now),
    month: now.getMonth(),
    year: now.getFullYear(),
  };
}

export function calculateNextWeek(currentWeek: number, currentMonth: number, currentYear: number) {
  const MONTHS_IN_YEAR = 12;
  const WEEKS_IN_MONTH = 4;

  let nextWeek = currentWeek + 1;
  let nextMonth = currentMonth;
  let nextYear = currentYear;

  if (nextWeek > WEEKS_IN_MONTH) {
    nextWeek = 1;
    nextMonth++;
    if (nextMonth >= MONTHS_IN_YEAR) {
      nextMonth = 0;
      nextYear++;
    }
  }

  return { nextWeek, nextMonth, nextYear };
}

export function calculatePrevWeek(currentWeek: number, currentMonth: number, currentYear: number) {
  const MONTHS_IN_YEAR = 12;
  const WEEKS_IN_MONTH = 4;

  let prevWeek = currentWeek - 1;
  let prevMonth = currentMonth;
  let prevYear = currentYear;

  if (prevWeek < 1) {
    prevWeek = WEEKS_IN_MONTH;
    prevMonth--;
    if (prevMonth < 0) {
      prevMonth = MONTHS_IN_YEAR - 1;
      prevYear--;
    }
  }

  return { prevWeek, prevMonth, prevYear };
}

export function getBookingsForDay(
  bookingsByDate: BookingsByDate | undefined,
  day: any,
  type: 'start' | 'end'
) {
  if (!bookingsByDate) return [];
  const year = day.date?.getFullYear();
  const month = day.date?.getMonth() + 1;
  const dayNum = day.date?.getDate();

  const bookings = bookingsByDate[year]?.[month]?.[dayNum] || [];

  if (type === 'start') {
    return bookings.filter(b => isSameDay(parseISO(b.startDate), day.date));
  } else {
    return bookings.filter(b => isSameDay(parseISO(b.endDate), day.date));
  }
}

export { getCalendarDays };
