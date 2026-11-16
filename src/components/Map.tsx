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
import { useEffect, useEffectEvent } from 'react';
import { useCitiesContext, type PositionData } from '../contexts/CitiesContext';
import Flag from './Flag';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
  const { cities } = useCitiesContext();
  const {
    isLoading: isLoadingPos,
    pos: geoPos,
    getPosition,
  } = useGeolocation();

  const { position, setSearchParams } = useUrlPosition();

  const moveToGeoPos = useEffectEvent((pos: PositionData) => {
    setSearchParams({ lat: String(pos.lat), lng: String(pos.lng) });
  });

  useEffect(() => {
    if (!geoPos) return;
    moveToGeoPos(geoPos);
  }, [geoPos]);

  return (
    <div className={styles.mapContainer}>
      <Button variant="position" onClick={getPosition}>
        {isLoadingPos ? 'Loading....' : 'Use your position'}
      </Button>
      <MapContainer
        className={styles.map}
        center={position ? position : [40, 0]}
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
        {position && <ChangeCenter lat={position.lat} lng={position.lng} />}
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
