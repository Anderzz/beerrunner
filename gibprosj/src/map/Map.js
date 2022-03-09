import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";
import * as turf from '@turf/turf';

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

mapboxgl.accessToken = MAPBOX_TOKEN;

function MapContainer() {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [longitude, setLongitude] = useState(10.4);
  const [latitude, setLatitude] = useState(64);
  const [zoom, setZoom] = useState(10);

  //The points which the route will consist of
  const [routePoints, setRoutePoints] = useState([]);

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

    map.current.on('load', createRouteLayer);

    map.current.on('click', (event) => {
        const coord = event.lngLat
        console.log(event.lngLat);
        const newPoint = `${coord.lng},${coord.lat}`
        setRoutePoints(oldArray => [...oldArray, newPoint])
        console.log(routePoints);

    })

    // Clean up on unmount
    return () => map.current.remove();
  }, []);

  useEffect(() => {
      if (routePoints.length === 3) {
        createRoute(routePoints);
      }
  }, [routePoints]);


  const createRouteLayer = () => {

    //Creating empty routes feature-collection to add to 
    //the source of the layer
    const routes = turf.featureCollection([]);

    map.current.addSource('route', {
        type: 'geojson',
        data: routes
    });

    map.current.addLayer(
        {
            id: 'routeline-active',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#3887be',
                'line-width': ['interpolate', ['linear'], ['zoom'], 12, 3, 22, 12]
            }
        },
        'waterway-label'
    );
  }

  const createRoute = (coordinates) => {
    fetch(OptimizationAPI(coordinates))
    .then(response => response.json())
    .then(data => {
        const routeGeoJSON = turf.featureCollection([
            turf.feature(data.trips[0].geometry)
        ]);
        console.log(data)
        map.current.getSource('route').setData(routeGeoJSON);
    })
  }

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapContainer;


function OptimizationAPI(coord) {

    return `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${coord[0]};${coord[1]};${coord[2]}?overview=full&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${mapboxgl.accessToken}`
}