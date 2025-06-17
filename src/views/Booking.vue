<template>
  <div class="p-4 md:h-[calc(100vh-150px)]">
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div
      v-else-if="bookingData"
      class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row dark:border-gray-700 dark:bg-gray-800"
    >
      <iframe
        v-if="stationData"
        class="w-full md:w-2/3 h-[200px] md:h-[400px]"
        width="100%"
        frameborder="0"
        style="border: 0"
        :src="`https://www.google.com/maps/embed/v1/place?q=${stationData.name}&amp;key=${googleMapsApiKey}`"
      >
      </iframe>
      <div class="flex flex-col justify-between p-4 leading-normal w-full md:w-1/2">
        <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ bookingData.customerName }}
        </h5>
        <div class="grid gap-4">
          <div>
            <p class="font-medium text-sm md:text-base">Start date:</p>
            <p>{{ new Date(bookingData.startDate).toLocaleDateString() }}</p>
          </div>
          <div>
            <p class="font-medium text-sm md:text-base">End date:</p>
            <p>{{ new Date(bookingData.endDate).toLocaleDateString() }}</p>
          </div>
          <div>
            <p class="font-medium text-sm md:text-base">Reservation days:</p>
            <p>{{ bookingDifference }}</p>
          </div>
          <div v-if="stationData">
            <p class="font-medium text-sm md:text-base">Station:</p>
            <p>{{ stationData.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getBookingById } from '../services/booking';
import { getStationById } from '../services/stations';
import { differenceInDays } from 'date-fns';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const route = useRoute();
const bookingId = route.params.id;

const {
  data: bookingData,
  isLoading: isBookingLoading,
  error: bookingError,
} = useQuery({
  queryKey: ['booking', bookingId],
  queryFn: async () => {
    const booking = await getBookingById(bookingId as string);
    return booking;
  },
  enabled: !!bookingId,
});

const bookingDifference = computed(() => {
  if (!bookingData.value) return 0;
  return differenceInDays(
    new Date(bookingData.value.endDate),
    new Date(bookingData.value.startDate)
  );
});

const stationId = computed(() => bookingData.value?.pickupReturnStationId);
const enabledStationQuery = computed(() => !!bookingData.value?.pickupReturnStationId);

const {
  data: stationData,
  isLoading: isStationLoading,
  error: stationError,
} = useQuery({
  queryKey: ['station', stationId],
  queryFn: async () => {
    const station = await getStationById(stationId.value as string);
    return station;
  },
  enabled: enabledStationQuery,
});

const isLoading = isBookingLoading || isStationLoading;
const error = bookingError || stationError;
</script>
