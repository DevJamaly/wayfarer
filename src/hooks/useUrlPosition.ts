import { useSearchParams } from 'react-router';
import type { PositionData } from '../contexts/CitiesContext';

// Turns a string from the URL into a valid coordinate, or null.
function parseCoord(value: string | null, limit: number): number | null {
  if (value === null || value.trim() === '') return null; // missing or empty
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null; // NaN, Infinity, out of range
}

export function useUrlPosition() {
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = parseCoord(searchParams.get('lat'), 90);
  const lng = parseCoord(searchParams.get('lng'), 180);

  const position: PositionData | null =
    lat !== null && lng !== null ? { lat, lng } : null;

  return { position, setSearchParams };
}
