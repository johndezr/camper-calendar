import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import PaginationWeek from '../../../components/PaginationWeek.vue';

const prevWeek = vi.fn();
const nextWeek = vi.fn();
const goToCurrentWeek = vi.fn();

vi.mock('../../../stores/useCalendarStore', () => ({
  useCalendarStore: vi.fn(() => ({
    currentWeekDays: [
      {
        month: 'January',
        year: 2024,
      },
    ],
    prevWeek,
    nextWeek,
    goToCurrentWeek,
  })),
}));

describe('PaginationWeek Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should render navigation buttons and current week button', () => {
    const wrapper = mount(PaginationWeek);

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.findAll('button')).toHaveLength(3);
    expect(wrapper.text()).toContain('Current Week');
  });

  it('should call prevWeek when clicking prev button', async () => {
    const wrapper = mount(PaginationWeek);

    await wrapper.findAll('button')[1].trigger('click');
    expect(prevWeek).toHaveBeenCalledTimes(1);
  });

  it('should call nextWeek when clicking next button', async () => {
    const wrapper = mount(PaginationWeek);

    await wrapper.findAll('button')[2].trigger('click');
    expect(nextWeek).toHaveBeenCalledTimes(1);
  });

  it('should call goToCurrentWeek when clicking current week button', async () => {
    const wrapper = mount(PaginationWeek);

    await wrapper.findAll('button')[0].trigger('click');
    expect(goToCurrentWeek).toHaveBeenCalledTimes(1);
  });

  it('should display current month and year', () => {
    const wrapper = mount(PaginationWeek);

    expect(wrapper.text()).toContain('Current Week January');
  });
});
