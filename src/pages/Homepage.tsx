import { Link } from 'react-router-dom';
import PageNav from '../components/PageNav';

function Homepage() {
  return (
    <div>
      <PageNav />
      <h1 className="test">WayFarer</h1>
      <Link to={'/app'}>Go to the App</Link>
      {/* <a href="/pricing">Pricing</a> */}
    </div>
  );
}

export default Homepage;
