<template>
  <section>
    <div class="flex flex-col h-[calc(100vh-150px)] pb-10">
      <div class="flex overflow-x-auto justify-between md:hidden border-b border-t border-gray-300">
        <div
          v-for="(day, idx) in calendarStore.currentWeekDays"
          :key="day.dayNumber"
          class="w-full text-center py-2 font-semibold border-r border-l border-gray-300 cursor-pointer"
          :class="selectedDayIndex === idx ? 'bg-blue-100 text-blue-700' : ''"
          @click="selectedDayIndex = idx"
        >
          <div class="text-xs">{{ day.month }}</div>
          <div class="text-xs">{{ day.dayNumber }}</div>
        </div>
      </div>
      <div class="hidden md:grid md:grid-cols-7 border-b border-t border-gray-300">
        <div
          v-for="day in calendarStore.currentWeekDays"
          :key="day.dayNumber"
          class="text-center py-2 font-semibold border-r border-l border-gray-300"
        >
          {{ day.month }}<br />{{ day.dayNumber }}
        </div>
      </div>

      <div class="flex flex-1 overflow-auto mt-2">
        <div class="flex-1 md:hidden">
          <div
            class="border-l border-r border-gray-300 rounded-lg border-t border-b p-1 min-h-[100px] h-full flex flex-col overflow-y-auto"
          >
            <template v-if="!isNotBookingsByDate">
              <router-link
                v-for="booking in calendarStore.getBookingsForDay(
                  calendarStore.currentWeekDays[selectedDayIndex],
                  'start'
                )"
                :key="'start-' + booking.id"
                :to="`/booking/${booking.id}`"
              >
                <div class="bg-green-500 text-white rounded px-2 py-1 text-xs mb-1">
                  Inicio: {{ booking.customerName }}
                </div>
              </router-link>
              <div
                v-for="booking in calendarStore.getBookingsForDay(
                  calendarStore.currentWeekDays[selectedDayIndex],
                  'end'
                )"
                :key="'end-' + booking.id"
              >
                <div class="bg-red-500 text-white rounded px-2 py-1 text-xs mb-1">
                  Fin: {{ booking.customerName }}
                </div>
              </div>
            </template>
            <div v-else class="text-center text-gray-500 mt-2">Not bookings for this day</div>
          </div>
        </div>
        <div class="hidden md:grid md:grid-cols-7 flex-1">
          <div
            v-for="day in calendarStore.currentWeekDays"
            :key="day.dayNumber"
            class="border-l border-r border-gray-300 rounded-lg border-t border-b p-1 min-h-[100px]"
          >
            <template v-if="calendarStore.bookingsByDate">
              <router-link
                v-for="booking in calendarStore.getBookingsForDay(day, 'start')"
                :key="'start-' + booking.id"
                :to="`/booking/${booking.id}`"
              >
                <div class="bg-green-500 text-white rounded px-2 py-1 text-xs">
                  Inicio: {{ booking.customerName }}
                </div>
              </router-link>
              <div
                v-for="booking in calendarStore.getBookingsForDay(day, 'end')"
                :key="'end-' + booking.id"
              >
                <div class="bg-red-500 text-white rounded px-2 py-1 text-xs">
                  Fin: {{ booking.customerName }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCalendarStore } from '../stores/useCalendarStore';
import PaginationWeek from './PaginationWeek.vue';

const calendarStore = useCalendarStore();
const selectedDayIndex = ref(0);

const isNotBookingsByDate = computed(() => {
  return Object.keys(calendarStore.bookingsByDate).length === 0;
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}
</style>
