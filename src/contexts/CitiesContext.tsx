import { createContext, useContext, useEffect, useReducer } from 'react';

interface CitiesContextValue {
  cities: CityData[];
  isLoading: boolean;
  getCity: (id: string) => void;
  createCity: (newCity: CityDataRaw) => void;
  deleteCity: (id: number) => void;
  currentCity: CityData;
}

const CitiesContext = createContext<CitiesContextValue | null>(null);

const BASE_URL = 'http://localhost:8000';

export interface PositionData {
  lat: number;
  lng: number;
}

export interface CityDataRaw {
  cityName: string;
  country: string;
  countryCode: string;
  date: string;
  notes: string;
  position: PositionData;
}

export interface CityData extends CityDataRaw {
  id: number;
}

interface StateData {
  cities: CityData[];
  isLoading: boolean;
  currentCity: CityData;
  error: string;
}

type Action =
  | { type: 'loading' }
  | { type: 'cities/loaded'; payload: CityData[] }
  | { type: 'city/loaded'; payload: CityData }
  | { type: 'city/created'; payload: CityData }
  | { type: 'city/deleted'; payload: number }
  | { type: 'rejected'; payload: string };

const initialState: StateData = {
  cities: [],
  isLoading: false,
  currentCity: {} as CityData,
  error: '',
};

function reducer(state: StateData, action: Action): StateData {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
        error: '',
      };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(c => c.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      const _exhaustive: never = action;
      throw new Error(`Unkown action: ${JSON.stringify(_exhaustive)} `);
  }
}

export function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        if (!res.ok) throw new Error(`Error ${res.status} : ${res.statusText}`);
        const data: CityData[] = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Unkown error loading cities data';
        dispatch({ type: 'rejected', payload: msg });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id: string) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status} : ${res.statusText}`);
      const data: CityData = await res.json();
      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : `Unkown error loading city ${id}`;
      dispatch({ type: 'rejected', payload: msg });
    }
  }

  async function createCity(newCity: CityDataRaw) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status} : ${res.statusText}`);
      const data: CityData = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unkown error creating city';
      dispatch({ type: 'rejected', payload: msg });
    }
  }

  async function deleteCity(id: number) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Error deleting city with ID: ${id}`);
      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : `Unkown error deleting city ${id}`;
      dispatch({ type: 'rejected', payload: msg });
    }
  }

  return (
    <CitiesContext
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
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
