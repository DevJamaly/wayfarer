import type { CityData } from '../App';
import CountryItem from './CountryItem';
import styles from './CountryList.module.css';
import Message from './Message';
import Spinner from './Spinner';

interface CountryListProps {
  cities: CityData[];
  isLoading: boolean;
}

export interface CountryData {
  country: string;
  countryCode: string;
}

const EMPTY_MSG = 'Add your first city by clicking on a city on the map';

function getUniqueCountries(cities: CityData[]): CountryData[] {
  return Array.from(
    new Map<string, CountryData>(
      cities.map((city): [string, CountryData] => [
        city.countryCode,
        { country: city.country, countryCode: city.countryCode },
      ]),
    ).values(),
  );
}

function CountryList({ cities, isLoading }: CountryListProps) {
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message={EMPTY_MSG} />;

  const countries = getUniqueCountries(cities);

  return (
    <ul className={styles.countryList}>
      {countries.map(country => (
        <CountryItem country={country} key={country.countryCode} />
      ))}
    </ul>
  );
}

export default CountryList;
