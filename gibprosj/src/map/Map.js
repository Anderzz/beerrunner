import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";
import * as turf from "@turf/turf";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

mapboxgl.accessToken = MAPBOX_TOKEN;

function MapContainer(props) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [longitude, setLongitude] = useState(10.39489098946541);
  const [latitude, setLatitude] = useState(63.42862774248482);
  const [zoom, setZoom] = useState(11);
  const [pointData, setPointData] = useState([]);

  //Fetch point data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/points/")
    .then(response => response.json())
    .then(data => {
      setPointData(data);
    })
  }, [])

  //Called whenever create route butten is pushed
  useEffect(async () => {

    const location = props.inputs[0]
    const destination = props.inputs[props.inputs.length-1]
    const category1 = props.inputs[1]
    const category2 = props.inputs[2]
    const category3 = props.inputs[3]

    const stop1Points = pointData.filter(object => object.category === category1)
    const stop2Points = pointData.filter(object => object.category === category2)
    const stop3Points = pointData.filter(object => object.category === category3)

    try {
    
      const points = [location, stop1Points, stop2Points, stop3Points, destination]
      //create a route out of the added points
      createRoute(points);

    } catch (error) {
      console.log(error);
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

    //Adding markers on click
    map.current.on("click", (event) => {
      const marker = new mapboxgl.Marker({
        draggable: true,
      })
        console.log(event)
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

  const getBestPoint = async (routePoints) => {
    const location_coord = routePoints[0].coord.join(",")
    const destination_coord = routePoints[routePoints.length-1].coord.join(",")
    const stop1Points = routePoints[1]

    let bestPoint;
    let bestRouteDuration;

    for (let i = 0; i < stop1Points.length; i++) {
      const point = stop1Points[i]
      const coord = point.lng+","+point.lat

      const api_coords = [location_coord, coord, destination_coord]
      
      await fetch(OptimizationAPI(api_coords))
      .then((response) => response.json())
      .then((data) => {

        const routeDuration = data.trips[0].duration;

        if (i === 0) {
          bestRouteDuration = routeDuration
          bestPoint = stop1Points[i]
        }

        else {
          if (data.trips[0].duration < bestRouteDuration) {
            bestRouteDuration = routeDuration
            bestPoint = stop1Points[i]
          }
        }
      });

    }

    const bestPointCoord = bestPoint.lng+","+bestPoint.lat;
    const displayRoute = [location_coord, bestPointCoord,destination_coord]

    return displayRoute
  }


  const createRoute = async (routePoints) => {

    const displayRoute = await getBestPoint(routePoints)

    for await (const coordinates of displayRoute) {

      const lng = coordinates.split(",")[0]
      const lat = coordinates.split(",")[1]

      const coordJSON = {
        lng: lng, 
        lat: lat
      }

      new mapboxgl.Marker({
        draggable: false,
      }).setLngLat(coordJSON).addTo(map.current);
    }

    fetch(OptimizationAPI(displayRoute))
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
function OptimizationAPI(coordList) {
  let coordString = "";
  coordString = coordList.join(";");
  return `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${coordString}?overview=full&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${mapboxgl.accessToken}`;
}

