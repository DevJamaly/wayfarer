// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from './Button';

import ButtonBack from './ButtonBack';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Flag from './Flag';
import Message from './Message';
import Spinner from './Spinner';

export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
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

function Form() {
  const { position } = useUrlPosition();

  const [cityName, setCityName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  const [isLoadingGeoData, setIsLoadingGeoData] = useState(false);
  const [geoCodingError, setGeoCodingError] = useState<string | null>(null);

  const lat = position?.lat;
  const lng = position?.lng;

  useEffect(() => {
    if (lat === undefined || lng === undefined) return;
    async function fetchCityData() {
      try {
        setGeoCodingError(null);
        setIsLoadingGeoData(true);
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
        );
        if (!response.ok)
          throw new Error(`Error fetching geo data ${lat} | ${lng}`);
        const data: ReverseGeocodeResult = await response.json();
        console.log(data);

        if (!data.countryCode)
          throw new Error(
            `That doesn't seem to be a city. Click somewhere else 😉`,
          );
        setCityName(data.city || data.locality || '');
        setCountryName(data.countryName);
        setCountryCode(data.countryCode);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeoData(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  if (isLoadingGeoData) return <Spinner />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          <Flag country={countryName} countryCode={countryCode} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={e => setDate(new Date(e.target.value))}
          value={date.toString()}
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
        <Button variant="primary" onClick={() => console.log(`ADDED`)}>
          Add
        </Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
