import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef, useCallback } from "react";
import * as turf from "@turf/turf";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

mapboxgl.accessToken = MAPBOX_TOKEN;

function MapContainer(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [longitude, setLongitude] = useState(10.39489098946541);
  const [latitude, setLatitude] = useState(63.42862774248482);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {

    let points = []

    try {
      fetchData(props.inputs[0]).then((response) => {
        const coord = response.geometry.coordinates;
        const newPoint = `${coord[0]},${coord[1]}`;
        points.push(newPoint)
      })
      .then(
        fetchData(props.inputs[1]).then((response) => {
          const coord = response.geometry.coordinates;
          const newPoint = `${coord[0]},${coord[1]}`;
          points.push(newPoint)
        })
      )
      .then(
        createRoute(points)
      )
        
    } catch (error) {
      console.log(error)
    }

  }, [props.inputs]);

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

    map.current.on("load", createRouteLayer);

    // Adding markers on click
    map.current.on("click", (event) => {
      const marker = new mapboxgl.Marker({
        draggable: true,
      })
        .setLngLat(event.lngLat)
        .addTo(map.current);
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, []);

  const createRouteLayer = () => {
    //Creating empty routes feature-collection to add to
    //the source of the layer
    const routes = turf.featureCollection([]);

    map.current.addSource("route", {
      type: "geojson",
      data: routes,
    });

    map.current.addLayer(
      {
        id: "routeline-active",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3887be",
          "line-width": ["interpolate", ["linear"], ["zoom"], 12, 3, 22, 12],
        },
      },
      "waterway-label"
    );
  };

  const createRoute = (routePoints) => {
    fetch(OptimizationAPI(routePoints))
      .then((response) => response.json())
      .then((data) => {
        const routeGeoJSON = turf.featureCollection([
          turf.feature(data.trips[0].geometry),
        ]);
        map.current.getSource("route").setData(routeGeoJSON);
      });
  };

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapContainer;

//Returns the Optimization API string for coordinates "coord"
function OptimizationAPI(coord) {
  console.log(coord);
  console.log(coord[0]);
  return `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${coord[0]};${coord[1]}?overview=full&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${mapboxgl.accessToken}`;
}

function fetchData(query) {
  const geocodingClient = mbxGeocoding({
    accessToken: mapboxgl.accessToken,
  });

  return geocodingClient
    .forwardGeocode({
      query: query,
      limit: 5,
      types: ["poi"],
      language: ["nb"],
    })
    .send()
    .then((response) => {
      const match = response.body;
      const coordinates = match.features[0].geometry.coordinates;
      const placeName = match.features[0].place_name;
      const center = match.features[0].center;
      return {
        type: "Feature",
        center: center,
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        properties: {
          description: placeName,
        },
      };
    });
}
