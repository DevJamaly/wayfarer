import { useNavigate, useSearchParams } from 'react-router';
import styles from './Map.module.css';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
  useMapEvents,
} from 'react-leaflet';
import { useEffect } from 'react';
import { useCitiesContext } from '../contexts/CitiesContext';
import Flag from './Flag';

function Map() {
  const { cities } = useCitiesContext();

  const [searchParams] = useSearchParams();
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));
  const hasPos = Boolean(lat && lng);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={hasPos ? [lat, lng] : [40, 0]}
        zoom={8}
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
                <Flag country={city.country} countryCode={city.countryCode} />
              </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {hasPos && <ChangeCenter lat={lat} lng={lng} />}
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng]);
  }, [map, lat, lng]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });

  return null;
}

export default Map;
