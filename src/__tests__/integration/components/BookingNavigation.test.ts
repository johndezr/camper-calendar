import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BookingNavigation from '@/components/BookingNavigation.vue';
import { useCalendarStore } from '@/stores/useCalendarStore';
import type { BookingsByDate } from '@/lib/calendar';

vi.mock('@/stores/useCalendarStore', () => ({
  useCalendarStore: vi.fn(),
}));

describe('BookingNavigation', () => {
  const mockBookingsByDate: BookingsByDate = {
    2024: {
      3: {
        15: [
          {
            id: '1',
            pickupReturnStationId: 'station-1',
            startDate: '2024-03-15',
            endDate: '2024-03-20',
            customerName: 'John Doe',
          },
        ],
        20: [
          {
            id: '2',
            pickupReturnStationId: 'station-1',
            startDate: '2024-03-20',
            endDate: '2024-03-25',
            customerName: 'Jane Smith',
          },
        ],
      },
      4: {
        1: [
          {
            id: '3',
            pickupReturnStationId: 'station-1',
            startDate: '2024-04-01',
            endDate: '2024-04-05',
            customerName: 'Bob Wilson',
          },
        ],
      },
    },
    2025: {
      1: {
        1: [
          {
            id: '4',
            pickupReturnStationId: 'station-1',
            startDate: '2025-01-01',
            endDate: '2025-01-10',
            customerName: 'Alice Brown',
          },
        ],
      },
    },
  };

  const mockStore = {
    bookingsByDate: mockBookingsByDate,
    currentYear: 2024,
    currentMonth: 2,
    currentWeek: 1,
    getCalendarDays: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCalendarStore as any).mockReturnValue(mockStore);
  });

  it('renders years and months correctly', () => {
    const wrapper = mount(BookingNavigation);

    expect(wrapper.text()).toContain('2024');
    expect(wrapper.text()).toContain('2025');

    expect(wrapper.text()).not.toContain('March');
    expect(wrapper.text()).not.toContain('April');
  });

  it('expands and collapses years when clicked', async () => {
    const wrapper = mount(BookingNavigation);

    expect(wrapper.text()).not.toContain('March');
    expect(wrapper.text()).not.toContain('April');

    await wrapper.find('button').trigger('click');

    expect(wrapper.text()).toContain('March');
    expect(wrapper.text()).toContain('April');

    await wrapper.find('button').trigger('click');

    expect(wrapper.text()).not.toContain('March');
    expect(wrapper.text()).not.toContain('April');
  });

  it('shows correct booking counts for each month', async () => {
    const wrapper = mount(BookingNavigation);

    await wrapper.find('button').trigger('click');

    expect(wrapper.text()).toContain('2 bookings'); // March has 2 bookings
    expect(wrapper.text()).toContain('1 booking'); // April has 1 booking
  });
});
