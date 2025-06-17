<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Detalles del Concesionario</h1>
    <button @click="goBack">Volver</button>
    <div v-if="isLoading">Cargando...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="bookingData" class="p-4 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-2">{{ bookingData.customerName }}</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="font-medium">Fecha de inicio:</p>
          <p>{{ new Date(bookingData.startDate).toLocaleDateString() }}</p>
        </div>
        <div>
          <p class="font-medium">Fecha de fin:</p>
          <p>{{ new Date(bookingData.endDate).toLocaleDateString() }}</p>
        </div>
        <div v-if="dealershipData">
          <p class="font-medium">Concesionario:</p>
          <p>{{ dealershipData.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getBookings } from '../services/booking';
import { getStations } from '../services/stations';

const route = useRoute();
const bookingId = route.params.id;
const router = useRouter();

const goBack = () => {
  window.history.back();
};

const {
  data: bookingData,
  isLoading: isBookingLoading,
  error: bookingError,
} = useQuery({
  queryKey: ['booking', bookingId],
  queryFn: async () => {
    const booking = await getBookings();
    return booking;
  },
  enabled: !!bookingId,
});

const dealershipId = computed(() => bookingData.value?.pickupReturnStationId);
const enabled = computed(() => !!bookingData.value?.pickupReturnStationId);

const {
  data: dealershipData,
  isLoading: isDealershipLoading,
  error: dealershipError,
} = useQuery({
  queryKey: ['dealership', dealershipId],
  queryFn: async () => {
    const stations = await getStations();
    return stations;
  },
  enabled,
});

const isLoading = isBookingLoading || isDealershipLoading;
const error = bookingError || dealershipError;
</script>
