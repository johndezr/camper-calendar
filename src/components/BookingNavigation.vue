<template>
  <div
    class="md:max-w-xs bg-white md:mr-2 shadow-sm border max-h-[100px] md:max-h-[300px] overflow-y-auto border-gray-200 p-4 mb-2"
  >
    <h3 class="font-semibold mb-4 text-xs md:text-base">Booking History</h3>
    <hr />
    <div class="space-y-4">
      <template v-for="(yearData, year) in bookingsByDate" :key="year">
        <div class="space-y-2">
          <button
            class="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded-md"
            @click="toggleYear(year)"
          >
            <span class="text-xs md:text-base">{{ year }}</span>
            <ChevronDownIcon v-if="expandedYears[year]" class="w-4 h-4 text-gray-500" />
            <ChevronRightIcon v-else class="w-4 h-4 text-gray-500" />
          </button>
          <div v-if="expandedYears[year]" class="space-y-2">
            <template v-for="(monthData, month) in yearData" :key="`${year}-${month}`">
              <div
                class="flex items-center cursor-default justify-between w-full text-left hover:bg-gray-50 p-2 rounded-md"
                :class="{
                  'bg-blue-50 text-blue-700': isCurrentMonth(year, month),
                }"
              >
                <span class="text-sm mr-4">{{ getMonthName(month) }}</span>
                <span class="text-sm font-semibold text-gray-500">
                  {{ getBookingCount(monthData) }} bookings
                </span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-vue-next';
import { useCalendarStore } from '../stores/useCalendarStore';

const calendarStore = useCalendarStore();
const expandedYears = ref<Record<number, boolean>>({});

const bookingsByDate = computed(() => calendarStore.bookingsByDate);

const toggleYear = (year: number) => {
  expandedYears.value[year] = !expandedYears.value[year];
};

const getMonthName = (month: number) => {
  const date = new Date(2000, month - 1, 1);
  return date.toLocaleString('default', { month: 'long' });
};

const getBookingCount = (monthData: Record<number, any[]>) => {
  return Object.values(monthData).reduce((acc, dayBookings) => acc + dayBookings.length, 0);
};

const isCurrentMonth = (year: number, month: number) => {
  return year === calendarStore.currentYear && month === calendarStore.currentMonth + 1;
};
</script>
