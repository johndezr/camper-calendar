import type { Station } from '../domain/models/Station';
import enhancedFetch from '../lib/enhacedFetch';

export const getStations = async (): Promise<Station[]> => {
  const stations = await enhancedFetch('stations');
  return stations as Station[];
};

export const getStationById = async (id: string): Promise<Station> => {
  const station = await enhancedFetch(`stations/${id}`);
  return station as Station;
};
