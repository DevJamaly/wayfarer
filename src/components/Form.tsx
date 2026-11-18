// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState, type SubmitEvent } from 'react';

import styles from './Form.module.css';
import Button from './Button';

import ButtonBack from './ButtonBack';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Flag from './Flag';
import Message from './Message';
import Spinner from './Spinner';
import { useCitiesContext, type CityDataRaw } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router';

function todayAsInputValue() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;

interface ReverseGeocodeResult {
  city: string;
  continent: string;
  continentCode: string;
  countryCode: string;
  countryName: string;
  latitude: number;
  locality: string;
  localityLanguageRequested: string;
  longitude: number;
  lookupSource: string;
  plusCode: string;
  postcode: string;
  principalSubdivision: string;
  principalSubdivisionCode: string;
}

type GeoLookup =
  | { lat: number; lng: number; status: 'success'; data: ReverseGeocodeResult }
  | { lat: number; lng: number; status: 'error'; message: string };

function Form() {
  const { position } = useUrlPosition();
  const { createCity, isLoading: isCreatingCity } = useCitiesContext();
  const navigate = useNavigate();

  const [lookup, setLookup] = useState<GeoLookup | null>(null);
  const [date, setDate] = useState(todayAsInputValue);
  const [notes, setNotes] = useState('');

  const lat = position?.lat;
  const lng = position?.lng;
  const isLoading =
    !lookup || lookup.lat !== position?.lat || lookup.lng !== position?.lng;

  useEffect(() => {
    // debugger;
    if (lat === undefined || lng === undefined) return;

    const controller = new AbortController();

    async function fetchCityData(lat: number, lng: number) {
      try {
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error(`Error fetching geo data`);
        const data: ReverseGeocodeResult = await response.json();

        if (!data.countryCode)
          throw new Error(
            `That doesn't seem to be a city. Click somewhere else 😉`,
          );

        setLookup({
          lat,
          lng,
          status: 'success',
          data,
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'AbortError') return;
          setLookup({
            lat,
            lng,
            status: 'error',
            message: err.message,
          });
        }
        console.error(err);
      }
    }

    fetchCityData(lat, lng);

    return function cleanup() {
      controller.abort();
    };
  }, [lat, lng]);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log('SUBMIT CLICKED');
    createNewCity();
  }

  async function createNewCity() {
    if (!position || lookup?.status !== 'success' || !date) return;

    const { data } = lookup;
    const newCity: CityDataRaw = {
      cityName,
      country: data.countryName,
      countryCode: data.countryCode,
      date,
      notes,
      position,
    };
    const res = await createCity(newCity);
    console.log(`City Res: ${res}`);
    navigate('/app/cities');
  }

  if (!position)
    return <Message message={'Start by clicking somewhere on the map'} />;
  if (isLoading) return <Spinner />;
  if (lookup.status === 'error') return <Message message={lookup.message} />;

  const { countryCode, countryName, city, locality } = lookup.data;
  const cityName = city || locality || '';

  return (
    <form
      className={`${styles.form} ${isCreatingCity ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input id="cityName" disabled value={cityName} />
        <span className={styles.flag}>
          <Flag country={countryName} countryCode={countryCode} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          type="date"
          onChange={e => {
            setDate(e.target.value); //YYYY-MM-DD
          }}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button variant="primary" type="submit">
          Add
        </Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
