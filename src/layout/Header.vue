<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 border-b h-16 mb-4 dark:bg-gray-800">
      <div class="flex justify-between items-center mx-auto max-w-screen-xl">
        <div class="flex items-center">
          <img
            src="/logo-nav.png"
            class="h-6 w-6 mr-2 sm:h-9 md:h-12 md:w-12"
            alt="Camper Calendar Logo"
          />
          <span
            class="self-center text-xs md:text-xl font-semibold whitespace-nowrap text-primary dark:text-white"
            >Calendar</span
          >
        </div>
        <PaginationWeek />
        <Autocomplete
          placeholder="Search station..."
          :debounce-time="300"
          class="hidden md:block"
          @select="handleStationSelect"
        />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Autocomplete from '../components/Autocomplete.vue';
import { useCalendarStore } from '../stores/useCalendarStore';
import PaginationWeek from '../components/PaginationWeek.vue';

const calendarStore = useCalendarStore();

const handleStationSelect = (station: any) => {
  calendarStore.setSelectedStation(station);
};
</script>

<style scoped></style>
