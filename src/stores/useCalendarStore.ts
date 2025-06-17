import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { format } from 'date-fns';
import {
  getCalendarDays,
  getCurrentWeekInfo,
  calculateNextWeek,
  calculatePrevWeek,
  getBookingsForDay,
  groupBookingsByDate,
} from '../lib/calendar';
import type { Station } from '../domain/models/Station';
import type { Booking } from '../domain/models/Booking';

export const useCalendarStore = defineStore('calendar', () => {
  // Week state
  const { week, month, year } = getCurrentWeekInfo();
  const calendarDays = ref(getCalendarDays(year, month));
  const currentMonth = ref(month);
  const currentYear = ref(year);
  const currentWeek = ref(week);

  // Station state
  const selectedStation = ref<Station | null>(null);
  const bookingsByDate = computed(() => selectedStation.value?.bookings || {});

  // Week computed properties
  const currentWeekDays = computed(() => {
    return calendarDays.value[currentWeek.value - 1];
  });
  const getSelectedStation = computed(() => selectedStation.value);

  const hasTwoMonths = computed(() => {
    if (!currentWeekDays.value) return false;

    const firstDayMonth = currentWeekDays.value[0].date.getMonth();
    const lastDayMonth = currentWeekDays.value[currentWeekDays.value.length - 1].date.getMonth();

    return firstDayMonth !== lastDayMonth;
  });

  const secondaryMonth = computed(() => {
    if (!hasTwoMonths.value) return '';
    return format(currentWeekDays.value[currentWeekDays.value.length - 1].date, 'MMMM');
  });

  // Week actions
  function prevWeek() {
    const { prevWeek, prevMonth, prevYear } = calculatePrevWeek(
      currentWeek.value,
      currentMonth.value,
      currentYear.value
    );

    currentWeek.value = prevWeek;
    currentMonth.value = prevMonth;
    currentYear.value = prevYear;
    calendarDays.value = getCalendarDays(prevYear, prevMonth);
  }

  function nextWeek() {
    const { nextWeek, nextMonth, nextYear } = calculateNextWeek(
      currentWeek.value,
      currentMonth.value,
      currentYear.value
    );

    currentWeek.value = nextWeek;
    currentMonth.value = nextMonth;
    currentYear.value = nextYear;
    calendarDays.value = getCalendarDays(nextYear, nextMonth);
  }

  function goToCurrentWeek() {
    const { week, month, year } = getCurrentWeekInfo();
    currentWeek.value = week;
    currentMonth.value = month;
    currentYear.value = year;
    calendarDays.value = getCalendarDays(year, month);
  }

  // Station actions
  function setSelectedStation(station: Station) {
    selectedStation.value = station;
    if (station?.bookings) {
      selectedStation.value.bookings = groupBookingsByDate(
        station.bookings
      ) as unknown as Booking[];
    } else {
      selectedStation.value.bookings = [];
    }
  }

  function changeCalendarDays(year: number, month: number) {
    calendarDays.value = getCalendarDays(year, month);
    currentYear.value = year;
    currentMonth.value = month;
    currentWeek.value = 1;
  }

  return {
    // Week state
    calendarDays,
    currentMonth,
    currentYear,
    currentWeek,
    currentWeekDays,
    hasTwoMonths,
    secondaryMonth,

    // Station state
    selectedStation,
    bookingsByDate,
    getSelectedStation,

    // Actions
    prevWeek,
    nextWeek,
    goToCurrentWeek,
    setSelectedStation,
    getBookingsForDay: (day: { date: Date }, type: 'start' | 'end') =>
      getBookingsForDay(bookingsByDate.value, day, type),
    changeCalendarDays,
  };
});
