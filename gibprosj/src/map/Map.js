import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
const MapboxDirections = require("@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions");

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

function MapContainer() {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  const mapContainer = useRef(null);
  const [longitude, setLongitude] = useState(10.4);
  const [latitude, setLatitude] = useState(64);
  const [zoom, setZoom] = useState(10);

  // initialize map when componenet mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [longitude, latitude],
      zoom: zoom,
    });
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
      })
    );
    map.on("move", () => {
      setLongitude(map.getCenter().lng.toFixed(4));
      setLatitude(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    const directions = new MapboxDirections({
      accessToken: MAPBOX_TOKEN,
      unit: "metric",
      profile: "mapbox/driving",
    });
    map.addControl(directions, "top-left");

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapContainer;
