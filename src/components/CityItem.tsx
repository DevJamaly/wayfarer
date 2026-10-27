import type { CityData } from '../App';
import styles from './CityItem.module.css';
import Flag from './Flag';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function CityItem({ city }: { city: CityData }) {
  const { cityName, country, countryCode, date } = city;
  return (
    <li className={styles.cityItem}>
      <span className={styles.flag}>
        <Flag countryCode={countryCode} country={country} />
      </span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.date}>{formatDate(date)}</time>
      <button className={styles.deleteBtn}>&times;</button>
    </li>
  );
}

export default CityItem;
