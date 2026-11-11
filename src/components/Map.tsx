import { useNavigate, useSearchParams } from 'react-router';
import styles from './Map.module.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useState } from 'react';
import type { LatLngExpression } from 'leaflet';
import { useCitiesContext } from '../contexts/CitiesContext';
import Flag from './Flag';

function Map() {
  const navigate = useNavigate();
  const { cities } = useCitiesContext();
  const [mapPos, setMapPos] = useState<LatLngExpression>([40, 0]);

  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  return (
    <div className={styles.mapContainer} onClick={() => navigate('form')}>
      <MapContainer
        className={styles.map}
        center={mapPos}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => (
          <Marker position={city.position} key={city.id}>
            <Popup>
              <span>
                <Flag
                  country={city.countryCode}
                  countryCode={city.countryCode}
                />
              </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
