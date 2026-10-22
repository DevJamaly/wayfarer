import { Link } from 'react-router-dom';
import styles from './AppNav.module.css';

function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to={'/'}>Home</Link>
        </li>
        <li>
          <Link to={'/pricing'}>Pricing</Link>
        </li>
        <li>
          <Link to={'/product'}>Product</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
