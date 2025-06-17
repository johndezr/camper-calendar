<template>
  <div class="autocomplete-container relative">
    <div class="relative w-full md:max-w-sm items-center">
      <input
        type="text"
        :value="searchQuery"
        :placeholder="placeholder"
        class="w-full px-4 py-2 border text-xs md:text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-6 md:pl-8"
        @input="handleInput"
      />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2 md:px-3">
        <Search class="size-3 text-muted-foreground md:size-4" />
      </span>
    </div>

    <div
      v-if="isOpen && (isLoading || filteredStations.length)"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <div v-if="isLoading" class="p-2 text-gray-500">Loading...</div>

      <ul v-else>
        <li
          v-for="station in filteredStations"
          :key="station.id"
          class="px-4 py-2 hover:bg-gray-100 text-gray-500 cursor-pointer"
          @click="handleSelect(station)"
        >
          {{ station.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { debounce } from '../lib/debounce';
import { Search } from 'lucide-vue-next';
import { getStations } from '../services/stations';
import type { Station } from '../domain/models/Station';

interface Props {
  placeholder?: string;
  debounceTime?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search stations...',
  debounceTime: 300,
});

const emit = defineEmits<{
  (e: 'select', value: Station): void;
}>();

const searchQuery = ref('');
const isOpen = ref(false);

const { data: allStations, isLoading } = useQuery({
  queryKey: ['allStations'],
  queryFn: async () => {
    const stations = await getStations();
    return stations;
  },
});

const filteredStations = computed(() => {
  if (!allStations.value || !searchQuery.value) return [];

  const query = searchQuery.value.toLowerCase();
  return allStations.value.filter(station => station.name.toLowerCase().includes(query));
});

const debouncedSearch = debounce((value: string) => {
  searchQuery.value = value;
}, props.debounceTime);

const handleInput = (event: Event) => {
  const target = event.target;
  debouncedSearch(target.value);
  isOpen.value = true;
};

const handleSelect = (station: Station) => {
  searchQuery.value = station.name;
  isOpen.value = false;
  emit('select', station);
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.autocomplete-container')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(
  () => searchQuery.value,
  newValue => {
    if (!newValue) {
      isOpen.value = false;
    }
  }
);
</script>

<style scoped></style>
