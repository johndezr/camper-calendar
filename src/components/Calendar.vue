<template>
  <section class="flex flex-col md:flex-row">
    <BookingNavigation v-if="!isNotBookingsByDate" />
    <div class="flex flex-1 flex-col pb-10 h-[calc(100vh-150px)]">
      <div
        class="flex overflow-x-auto justify-between md:grid md:grid-cols-7 border-b border-t border-gray-200"
      >
        <div
          v-for="(day, idx) in calendarStore.currentWeekDays"
          :key="day.dayNumber"
          class="w-full text-center py-2 border-r border-l border-gray-200 cursor-pointer md:cursor-default"
          :class="
            selectedDayIndex === idx
              ? 'bg-blue-100 text-blue-700 md:bg-transparent md:text-black'
              : ''
          "
          @click="selectedDayIndex = idx"
        >
          <p class="text-xs">{{ day.dayName }}</p>
          <p class="text-sm md:text-lg font-semibold">{{ day.dayNumber }}</p>
        </div>
      </div>

      <div class="flex flex-1 overflow-auto">
        <div class="grid grid-cols-1 md:grid-cols-7 min-h-[300px] md:min-h-full flex-1">
          <template v-for="(day, idx) in calendarStore.currentWeekDays" :key="day.dayNumber">
            <div
              v-show="isMobile ? selectedDayIndex === idx : true"
              class="border-l border-r border-gray-200 border-b p-1 min-h-[100px]"
            >
              <template v-if="!isNotBookingsByDate">
                <router-link
                  v-for="booking in calendarStore.getBookingsForDay(day, 'start')"
                  :key="'start-' + booking.id"
                  :to="`/booking/${booking.id}`"
                >
                  <div class="bg-green-500 text-white rounded px-2 py-1 text-xs mb-1">
                    <p>Pickup: {{ booking.customerName }}</p>
                  </div>
                </router-link>
                <router-link
                  v-for="booking in calendarStore.getBookingsForDay(day, 'end')"
                  :key="'end-' + booking.id"
                  :to="`/booking/${booking.id}`"
                >
                  <div class="bg-red-500 text-white rounded px-2 py-1 text-xs mb-1">
                    <p>Return: {{ booking.customerName }}</p>
                  </div>
                </router-link>
              </template>
              <div v-else class="visible md:hidden text-center text-gray-500 mt-2">
                No bookings for this day
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCalendarStore } from '../stores/useCalendarStore';
import BookingNavigation from './BookingNavigation.vue';

const calendarStore = useCalendarStore();
const selectedDayIndex = ref(0);
const isMobile = ref(window.innerWidth < 960);

const isNotBookingsByDate = computed(() => {
  return Object.keys(calendarStore.bookingsByDate).length === 0;
});

const handleResize = () => {
  isMobile.value = window.innerWidth < 960;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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
