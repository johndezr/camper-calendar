<template>
  <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 border-b h-16 mb-4 dark:bg-gray-800">
      <div class="flex justify-between items-center mx-auto max-w-5xl">
        <div class="flex items-center">
          <img
            src="/logo-nav.webp"
            class="h-6 w-6 mr-1 sm:h-9 md:h-12 md:w-12"
            alt="Camper Calendar Logo"
          />
          <span
            class="self-center text-xs md:text-xl font-semibold whitespace-nowrap text-primary dark:text-white"
            >Calendar</span
          >
        </div>
        <template v-if="!isBookingRoute">
          <PaginationWeek />
          <Autocomplete
            placeholder="Search station..."
            :debounce-time="300"
            class="hidden md:block"
            @select="handleStationSelect"
          />
        </template>
        <template v-else>
          <Button class="ml-1" variant="outline" @click="goBack">
            <ArrowLeftIcon class="w-4 h-4" />
            Go back
          </Button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Autocomplete from '../components/Autocomplete.vue';
import { useCalendarStore } from '../stores/useCalendarStore';
import PaginationWeek from '../components/PaginationWeek.vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-vue-next';
import type { Station } from '@/domain/models/Station';

const router = useRouter();
const route = useRoute();

const isBookingRoute = computed(() => route.name === 'booking');

const calendarStore = useCalendarStore();

const handleStationSelect = (station: Station) => {
  calendarStore.setSelectedStation(station);
};

const goBack = () => {
  router.back();
};
</script>

<style scoped></style>
