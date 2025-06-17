<script setup lang="ts">
import Calendar from '@/components/Calendar.vue';
import Autocomplete from '@/components/Autocomplete.vue';
import { useCalendarStore } from '@/stores/useCalendarStore';
import type { Station } from '@/domain/models/Station';

const calendarStore = useCalendarStore();

const handleStationSelect = (station: Station) => {
  calendarStore.setSelectedStation(station);
};
</script>

<template>
  <div>
    <Autocomplete
      placeholder="Search station..."
      :debounce-time="300"
      class="w-full md:hidden mb-4"
      @select="handleStationSelect"
    />
    <Calendar />
  </div>
</template>

<style scoped></style>
