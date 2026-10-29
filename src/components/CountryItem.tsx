import styles from './CountryItem.module.css';
import type { CountryData } from './CountryList';
import Flag from './Flag';

function CountryItem({ country }: { country: CountryData }) {
  const { country: countryName, countryCode } = country;
  return (
    <li className={styles.countryItem}>
      <Flag country={countryName} countryCode={countryCode} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
