import { Offer} from '../types/offers';
import { City } from '../types/offers';
import { Map, TileLayer } from 'leaflet';
import { MutableRefObject, useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../hooks';
import { getCurrentCity } from '../store/data-process/data-selectors';
import { defaultCity } from '../const';

const LAYER = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const ATTRIBUTE = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function useMap(
  mapRef: MutableRefObject<HTMLElement | null>,
  offer: Offer)
  : Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);
  const currentCity = useAppSelector(getCurrentCity);

  const center: City = offer?.city || defaultCity;

  useEffect(() => {

    if (mapRef.current !== null && !isRenderedRef.current) {

      const instance = new Map(mapRef.current, {
        center: {
          lat: center.location.latitude,
          lng: center.location.longitude
        },
        zoom: center.location.zoom,
      });

      const layer = new TileLayer(
        LAYER,
        { attribution: ATTRIBUTE }
      );

      instance.addLayer(layer);

      setMap(instance);

      isRenderedRef.current = true;
    }
    map?.setView([center.location.latitude, center.location.longitude], center.location.zoom);
  },[mapRef, map, center, currentCity]);

  return map;
}

export default useMap;
