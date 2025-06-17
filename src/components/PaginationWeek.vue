<template>
  <div class="flex items-center gap-2">
    <Button variant="outline" size="sm" @click="calendarStore.goToCurrentWeek">
      <span class="text-xs md:text-sm">
        <CalendarIcon class="w-4 h-4 inline-block mr-2" />
        Current Week
      </span>
    </Button>
    <Button variant="outline" size="icon" @click="calendarStore.prevWeek">
      <ChevronLeft class="cursor-pointer" />
    </Button>
    <Button variant="outline" size="icon" @click="calendarStore.nextWeek">
      <ChevronRight class="cursor-pointer" />
    </Button>
    <span class="text-xs md:text-sm">
      {{ calendarStore.currentWeekDays[0].month }}
      <span v-if="calendarStore.hasTwoMonths"> - {{ calendarStore.secondaryMonth }} </span>
      {{ calendarStore.currentYear }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-vue-next';
import { useCalendarStore } from '../stores/useCalendarStore';

const calendarStore = useCalendarStore();
</script>
