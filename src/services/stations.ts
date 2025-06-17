import type { Station } from '../domain/models/Station';
import enhancedFetch from '../lib/enhacedFetch';

export const getStations = async (): Promise<Station[]> => {
  const stations = await enhancedFetch('stations');
  return stations as Station[];
};
