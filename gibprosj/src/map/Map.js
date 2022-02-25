import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";
  mapboxgl.accessToken = MAPBOX_TOKEN;

function MapContainer() {
  

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [longitude, setLongitude] = useState(10.4);
  const [latitude, setLatitude] = useState(64);
  const [zoom, setZoom] = useState(10);

  // initialize map when componenet mounts
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [longitude, latitude],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLongitude(map.current.getCenter().lng.toFixed(4));
      setLatitude(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, []);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapContainer;
