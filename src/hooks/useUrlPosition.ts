import { useSearchParams } from 'react-router';
import type { PositionData } from '../contexts/CitiesContext';

export function useUrlPosition() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const position: PositionData | null =
    lat && lng ? { lat: Number(lat), lng: Number(lng) } : null;

  return { position, setSearchParams };
}
