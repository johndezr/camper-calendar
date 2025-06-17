import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Autocomplete from '../../../components/Autocomplete.vue';
import { getStations } from '../../../services/stations';
import type { Station } from '../../../domain/models/Station';

// Mock the stations service
vi.mock('../../../services/stations', () => ({
  getStations: vi.fn(),
}));

const mockStations: Station[] = [
  { id: '1', name: 'Station A', bookings: [] },
  { id: '2', name: 'Station B', bookings: [] },
  { id: '3', name: 'Station C', bookings: [] },
];

describe('Autocomplete Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the getStations function to return our mock data
    vi.mocked(getStations).mockResolvedValue(mockStations);
  });

  it('should fetch and display stations', async () => {
    const wrapper = mount(Autocomplete, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });

    // Wait for the query to resolve
    await wrapper.vm.$nextTick();

    expect(getStations).toHaveBeenCalledTimes(1);
    await wrapper.find('input').setValue('Station');

    // Wait for the debounce 300ms to finish
    await new Promise(resolve => setTimeout(resolve, 300));
    await wrapper.vm.$nextTick();

    const listItems = wrapper.findAll('li');
    expect(listItems).toHaveLength(3);
    expect(listItems[0].text()).toBe('Station A');
    expect(listItems[1].text()).toBe('Station B');
    expect(listItems[2].text()).toBe('Station C');
  });

  it('should emit selected station', async () => {
    const wrapper = mount(Autocomplete, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });

    await wrapper.vm.$nextTick();

    await wrapper.find('input').setValue('Station A');

    await new Promise(resolve => setTimeout(resolve, 300));
    await wrapper.vm.$nextTick();

    await wrapper.find('li').trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')![0][0]).toEqual(mockStations[0]);
  });

  it('should show loading state', async () => {
    vi.mocked(getStations).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => resolve(mockStations), 100);
        })
    );

    const wrapper = mount(Autocomplete, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });

    await wrapper.find('input').setValue('');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.text-gray-500').text()).toBe('Loading...');
  });

  it('should handle empty search results', async () => {
    const wrapper = mount(Autocomplete, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });

    await wrapper.vm.$nextTick();

    await wrapper.find('input').setValue('NonExistentStation');
    await wrapper.vm.$nextTick();

    const listItems = wrapper.findAll('li');
    expect(listItems).toHaveLength(0);
  });

  it('should close dropdown when clicking outside', async () => {
    const wrapper = mount(Autocomplete, {
      global: {
        plugins: [VueQueryPlugin],
      },
    });

    await wrapper.vm.$nextTick();

    expect(getStations).toHaveBeenCalledTimes(1);

    await wrapper.find('input').setValue('Station');
    await wrapper.vm.$nextTick();

    await new Promise(resolve => setTimeout(resolve, 300));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('ul').exists()).toBe(true);

    document.body.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('ul').exists()).toBe(false);
  });
});
