import type { CityData } from '../App';
import CityItem from './CityItem';
import styles from './CityList.module.css';
import Message from './Message';
import Spinner from './Spinner';

interface CityListProps {
  cities: CityData[];
  isLoading: boolean;
}

const EMPTY_MSG = 'Add your first city by clicking on a city on the map';

function CityList({ cities, isLoading }: CityListProps) {
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message={EMPTY_MSG} />;
  return (
    <ul className={styles.cityList}>
      {cities.map(city => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
