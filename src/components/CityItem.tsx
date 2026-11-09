import { Link } from 'react-router';
import styles from './CityItem.module.css';
import Flag from './Flag';
import { useCitiesContext, type CityData } from '../contexts/CitiesContext';

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function CityItem({ city }: { city: CityData }) {
  const { currentCity } = useCitiesContext();
  const { cityName, country, countryCode, date, id, position } = city;
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${id === currentCity?.id ? styles['cityItem--active'] : ''}`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.flag}>
          <Flag countryCode={countryCode} country={country} />
        </span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
