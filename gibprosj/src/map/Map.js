import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useState, useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import LoadingScreen from "../loading/LoadingScreen";

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
  const [markers, setMarkers] = useState([]);
  const [beerRouteJSON, setBeerRouteJSON] = useState();
  const [wineRouteJSON, setWineRouteJSON] = useState();
  const [n, setN] = useState(0);

  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  //error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const stylergutt = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    //bgcolor: "warning.main",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //end error modal

  //Fetch point data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/points/")
      .then((response) => response.json())
      .then((data) => {
        setPointData(data);
      });
  }, []);

  //Called whenever show wine/beer route buttons are checked/unchecked
  useEffect(() => {
    try {
      if (props.showBeerRoute) {
        map.current.getSource("route").setData(beerRouteJSON);
      } else {
        map.current.getSource("route").setData(turf.featureCollection([]));
      }

      if (props.showWineRoute) {
        map.current.getSource("vin-route").setData(wineRouteJSON);
      } else {
        map.current.getSource("vin-route").setData(turf.featureCollection([]));
      }
    } catch (error) {}
  }, [props.showBeerRoute, props.showWineRoute]);

  //Called whenever create route button is pushed
  useEffect(async () => {
    const location = props.inputs[0];
    const destination = props.inputs[props.inputs.length - 1];

    if (n > 0) {
      const points = [location, destination];
      //create a route out of the added points
      createRoute(points);
    }
    else {
      setN(n + 1)
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
      });
      console.log(event).setLngLat(event.lngLat).addTo(map.current);
    });

    //add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: false,
      })
    );

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

    map.current.addLayer(
      {
        id: "routearrows",
        type: "symbol",
        source: "route",
        layout: {
          "symbol-placement": "line",
          "text-field": "▶",
          "text-size": ["interpolate", ["linear"], ["zoom"], 12, 24, 22, 60],
          "symbol-spacing": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            30,
            22,
            160,
          ],
          "text-keep-upright": false,
        },
        paint: {
          "text-color": "#ca9d21",
          "text-halo-color": "hsl(55, 11%, 96%)",
          "text-halo-width": 3,
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

    map.current.addLayer(
      {
        id: "routearrows-wine",
        type: "symbol",
        source: "vin-route",
        layout: {
          "symbol-placement": "line",
          "text-field": "▶",
          "text-size": ["interpolate", ["linear"], ["zoom"], 12, 24, 22, 60],
          "symbol-spacing": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            30,
            22,
            160,
          ],
          "text-keep-upright": false,
        },
        paint: {
          "text-color": "#70005d",
          "text-halo-color": "hsl(55, 11%, 96%)",
          "text-halo-width": 3,
        },
      },
      "waterway-label"
    );
  };

  const getBestPoint = async (routePoints) => {
    const location_coord = routePoints[0].coord.join(",");
    const destination_coord =
      routePoints[routePoints.length - 1].coord.join(",");

    const groceryData = pointData.filter(
      (obj) => obj.category === "Dagligvarehandel"
    );
    const wineData = pointData.filter((obj) => obj.category === "Vinmonopol");

    let bestGroceryPoint;
    let bestGroceryRouteDuration;
    let bestGroceryRouteDistance;

    for (let i = 0; i < groceryData.length; i++) {
      const point = groceryData[i];
      const coord = point.lng + "," + point.lat;

      const api_coords = [location_coord, coord, destination_coord];

      await fetch(OptimizationAPI(api_coords))
        .then((response) => response.json())
        .then((data) => {
          console.log("Optimization API Call");
          const routeDuration = data.trips[0].duration;
          const routeDistance = data.trips[0].distance;

          if (i === 0) {
            bestGroceryRouteDuration = routeDuration;
            bestGroceryRouteDistance = routeDistance;
            bestGroceryPoint = groceryData[i];
          } else {
            if (data.trips[0].duration < bestGroceryRouteDuration) {
              bestGroceryRouteDuration = routeDuration;
              bestGroceryRouteDistance = routeDistance;
              bestGroceryPoint = pointData[i];
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    let bestWinePoint;
    let bestWineRouteDuration;
    let bestWineRouteDistance;

    for (let i = 0; i < wineData.length; i++) {
      const point = wineData[i];
      const coord = point.lng + "," + point.lat;

      const api_coords = [location_coord, coord, destination_coord];

      await fetch(OptimizationAPI(api_coords))
        .then((response) => response.json())
        .then((data) => {
          console.log("Optimization API Call");
          const routeDuration = data.trips[0].duration;
          const routeDistance = data.trips[0].distance;

          if (i === 0) {
            bestWineRouteDuration = routeDuration;
            bestWineRouteDistance = routeDistance;
            bestWinePoint = wineData[i];
          } else {
            if (data.trips[0].duration < bestWineRouteDuration) {
              bestWineRouteDuration = routeDuration;
              bestWineRouteDistance = routeDistance;
              bestWinePoint = wineData[i];
            }
          }
        });
    }

    const bestGroceryPointCoord =
      bestGroceryPoint.lng + "," + bestGroceryPoint.lat;
    const displayRouteGrocery = [
      location_coord,
      bestGroceryPointCoord,
      destination_coord,
    ];

    const bestWinePointCoord = bestWinePoint.lng + "," + bestWinePoint.lat;
    const displayRouteWine = [
      location_coord,
      bestWinePointCoord,
      destination_coord,
    ];

    props.sendTripInfoToParent([
      [bestGroceryRouteDuration, bestGroceryRouteDistance],
      [bestWineRouteDuration, bestWineRouteDistance],
    ]);

    //Returns optimal route for beer and wine runs
    return [displayRouteGrocery, displayRouteWine];
  };

  const createRoute = async (routePoints) => {

    // Remove old markers
    for (const i in markers) {
      markers[i].remove();
    }

    try {

      setShowLoadingScreen(true);

      const displayRoutes = await getBestPoint(routePoints);
      const groceryRoute = displayRoutes[0];
      const wineRoute = displayRoutes[1];

      // Add location marker
      const locationMarker = new mapboxgl.Marker()
        .setLngLat({
          lat: groceryRoute[0].split(",")[1],
          lng: groceryRoute[0].split(",")[0],
        })
        .addTo(map.current);

      // Add destination marker
      const destinationMarker = new mapboxgl.Marker(CustomMarker("Finish"))
        .setLngLat({
          lat: groceryRoute[2].split(",")[1],
          lng: groceryRoute[2].split(",")[0],
        })
        .addTo(map.current);

      // Add grocery marker
      const beermarker = new mapboxgl.Marker(CustomMarker("Dagligvarehandel"))
        .setLngLat({
          lat: groceryRoute[1].split(",")[1],
          lng: groceryRoute[1].split(",")[0],
        })
        .addTo(map.current);

      // Add wine marker
      const winemarker = new mapboxgl.Marker(CustomMarker("Vinmonopol"))
        .setLngLat({
          lat: wineRoute[1].split(",")[1],
          lng: wineRoute[1].split(",")[0],
        })
        .addTo(map.current);

      setMarkers((oldArray) => [...oldArray, destinationMarker]);
      setMarkers((oldArray) => [...oldArray, locationMarker]);
      setMarkers((oldArray) => [...oldArray, beermarker]);
      setMarkers((oldArray) => [...oldArray, winemarker]);

      fetch(OptimizationAPI(displayRoutes[0]))
        .then((response) => response.json())
        .then((data) => {
          console.log("Optimization API Call");
          const routeGeoJSON = turf.featureCollection([
            turf.feature(data.trips[0].geometry),
          ]);
          map.current.getSource("route").setData(routeGeoJSON);
          setBeerRouteJSON(routeGeoJSON);
        });

      fetch(OptimizationAPI(displayRoutes[1]))
        .then((response) => response.json())
        .then((data) => {
          console.log("Optimization API Call");
          const routeGeoJSON = turf.featureCollection([
            turf.feature(data.trips[0].geometry),
          ]);
          map.current.getSource("vin-route").setData(routeGeoJSON);
          setWineRouteJSON(routeGeoJSON);
        });
    } catch {
        console.log("Catch")
        setShowErrorModal(true);
        handleOpen();
    }

    setShowLoadingScreen(false);
  };

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
      {showLoadingScreen && <LoadingScreen />}
      {showErrorModal && (
        <div>
          <Modal
            keepMounted
            open={open}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={stylergutt}>
              <Typography
                id="keep-mounted-modal-title"
                variant="h6"
                component="h2"
              >
                Error creating route!
              </Typography>
              <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                Press anywhere to try another address.
              </Typography>
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default MapContainer;

// Returns the Optimization API string for coordinates "coord"
function OptimizationAPI(coordList) {
  let coordString = "";
  coordString = coordList.join(";");
  return `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${coordString}?overview=full&steps=true&geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${mapboxgl.accessToken}`;
}

// Creates a custom marker
function CustomMarker(type) {
  const el = document.createElement("div");
  el.className = "custom-marker";

  if (type === "Dagligvarehandel") {
    el.className = "custom-marker-beer";
  } else if (type === "Finish") {
    el.className = "custom-marker-finish";
  } else {
    el.className = "custom-marker-wine";
  }

  return el;
}
