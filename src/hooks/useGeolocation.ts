import { useState } from 'react';
import type { PositionData } from '../contexts/CitiesContext';

export function useGeolocation(
  defaultPosition: PositionData | null = null,
  options?: PositionOptions,
) {
  const [pos, setPos] = useState<PositionData | null>(defaultPosition);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getPosition() {
    setError('');

    console.log('Button Clicked');

    if (!navigator.geolocation)
      return setError('Your browser does not support geolocation');

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    function onSuccess(position: GeolocationPosition) {
      console.log(position);
      setPos({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setIsLoading(false);
    }

    function onError(err: GeolocationPositionError) {
      console.log(err);
      setError(err.message);
      setIsLoading(false);
    }
  }

  return { pos, isLoading, error, getPosition };
}
