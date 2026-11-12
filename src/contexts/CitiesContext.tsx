import { createContext, useContext, useEffect, useState } from 'react';

interface CitiesContextValue {
  cities: CityData[];
  isLoading: boolean;
  getCity: (id: string) => void;
  currentCity: CityData;
}

const CitiesContext = createContext<CitiesContextValue | null>(null);

const BASE_URL = 'http://localhost:8000';

export interface PositionData {
  lat: number;
  lng: number;
}

export interface CityData {
  cityName: string;
  country: string;
  countryCode: string;
  date: string;
  notes: string;
  position: PositionData;
  id: number;
}

export function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<CityData>({} as CityData);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error(`Error ${res.status} : ${res.statusText}`);
        const data: CityData[] = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id: string) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status} : ${res.statusText}`);
      const data: CityData = await res.json();
      setCurrentCity(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
      }}
    >
      {children}
    </CitiesContext>
  );
}

export function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (!context)
    throw new Error('useCitiesContext must be used inside a CitiesProvider');
  return context;
}
