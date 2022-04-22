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

  //Called whenever create route button is pushed
  useEffect(async () => {

    const location = props.inputs[0]
    const destination = props.inputs[props.inputs.length-1]

    try {
    
      const points = [location, destination]
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

    // Grocery Store Layer
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
          "line-color": "#ca9d21",
          "line-width": ["interpolate", ["linear"], ["zoom"], 12, 3, 22, 12],
        },
      },
      "waterway-label"
    );

    // Liquor Store Layer
    map.current.addSource("vin-route", {
      type: "geojson",
      data: routes,
    });

    map.current.addLayer(
      {
        id: "routeline-active-wine",
        type: "line",
        source: "vin-route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#70005d",
          "line-width": ["interpolate", ["linear"], ["zoom"], 12, 3, 22, 12],
        },
      },
      "waterway-label"
    );
  };

  const getBestPoint = async (routePoints) => {
    const location_coord = routePoints[0].coord.join(",")
    const destination_coord = routePoints[routePoints.length-1].coord.join(",")

    const groceryData = pointData.filter(obj => obj.category === "Dagligvarehandel")
    const wineData = pointData.filter(obj => obj.category === "Vinmonopol")

    let bestGroceryPoint;
    let bestGroceryRouteDuration;

    for (let i = 0; i < groceryData.length; i++) {
      const point = groceryData[i]
      const coord = point.lng+","+point.lat

      const api_coords = [location_coord, coord, destination_coord]
      
      await fetch(OptimizationAPI(api_coords))
      .then((response) => response.json())
      .then((data) => {

        const routeDuration = data.trips[0].duration;

        if (i === 0) {
          bestGroceryRouteDuration = routeDuration
          bestGroceryPoint = groceryData[i]
        }

        else {
          if (data.trips[0].duration < bestGroceryRouteDuration) {
            bestGroceryRouteDuration = routeDuration
            bestGroceryPoint = pointData[i]
          }
        }
      });
    }

    let bestWinePoint;
    let bestWineRouteDuration;

    for (let i = 0; i < wineData.length; i++) {
      const point = wineData[i]
      const coord = point.lng+","+point.lat

      const api_coords = [location_coord, coord, destination_coord]
      
      await fetch(OptimizationAPI(api_coords))
      .then((response) => response.json())
      .then((data) => {

        const routeDuration = data.trips[0].duration;

        if (i === 0) {
          bestWineRouteDuration = routeDuration
          bestWinePoint = pointData[i]
        }

        else {
          if (data.trips[0].duration < bestWineRouteDuration) {
            bestWineRouteDuration = routeDuration
            bestWinePoint = pointData[i]
          }
        }
      });
    }

    const bestGroceryPointCoord = bestGroceryPoint.lng+","+bestGroceryPoint.lat;
    const displayRouteGrocery = [location_coord, bestGroceryPointCoord, destination_coord]

    const bestWinePointCoord = bestWinePoint.lng+","+bestWinePoint.lat;
    const displayRouteWine = [location_coord, bestWinePointCoord, destination_coord]

    //Returns optimal route for beer and wine runs
    return [displayRouteGrocery, displayRouteWine]
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

