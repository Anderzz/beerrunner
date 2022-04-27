import { useState, useEffect, useRef } from "react";
import VisibilityButton from "./VisibilityButton";
import Header from "../header/Header";

import WineIcon from "../../src/static/images/wine-icon.png";
import BeerIcon from "../../src/static/images/beer_icon.png";

//Mui stuff
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

//Mapbox stuff
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

mapboxgl.accessToken = MAPBOX_TOKEN;

function Input(props) {
  // Styling

  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");

  const [routeDisplayed, setRouteDisplayed] = useState(false);

  const [locationQueryMatches, setLocationQueryMatches] = useState([]);
  const [destinationQueryMatches, setDestinationQueryMatches] = useState([]);

  const geocodingClient = useRef(null);

  // Creating a geocoder on first render which can be used later
  useEffect(() => {
    geocodingClient.current = mbxGeocoding({
      accessToken: mapboxgl.accessToken,
    });
  }, []);

  // Called when more than "limit" words are typed in the location input field
  const handleLocationChange = (event) => {
    if (event.target.value.length > 3) {
      console.log("Geocoder API call");

      const limit = 5;

      geocodingClient.current
        .forwardGeocode({
          query: event.target.value,
          limit: limit,
          types: ["poi", "address"],
          language: ["nb"],
        })
        .send()
        .then((response) => {
          const match = response.body;

          let matches = [];
          for (let i = 0; i < match.features.length; i++) {
            const coordinates = match.features[i].geometry.coordinates;
            const placeName = match.features[i].place_name;
            const place = {
              label: placeName,
              coord: coordinates,
            };
            matches.push(place);
          }
          setLocationQueryMatches(matches);
        });
    }
  };

  // Called when more than "limit" words are typed in the destination input field
  const handleDestinationChange = (event) => {
    if (event.target.value.length > 3) {
      console.log("Geocoder API call");

      const limit = 5;

      geocodingClient.current
        .forwardGeocode({
          query: event.target.value,
          limit: limit,
          types: ["poi", "address"],
          language: ["nb"],
        })
        .send()
        .then((response) => {
          const match = response.body;
          let matches = [];

          for (let i = 0; i < match.features.length; i++) {
            const coordinates = match.features[i].geometry.coordinates;
            const placeName = match.features[i].place_name;
            const place = {
              label: placeName,
              coord: coordinates,
            };
            matches.push(place);
          }
          setDestinationQueryMatches(matches);
        });
    }
  };

  const handleSearchOnClick = () => {
    let points = [location, destination];
    props.sendDataToParent(points);
    setRouteDisplayed(true);
  };

  return (
    <div id="input-container">
      <div id="input-main-body">
        <Header />
        <div id="input-fields">
          {/* LOCATION/DESTINATION INPUTS */}
          <div id="location-fields">
            <Autocomplete
              id="autocomplete-from"
              disableClearable
              freeSolo
              options={locationQueryMatches}
              onInputChange={handleLocationChange}
              onChange={(event, newInput) => {
                setLocation(newInput);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Location" />
              )}
            />
            <Autocomplete
              id="autocomplete-to"
              freeSolo
              disableClearable
              options={destinationQueryMatches}
              onInputChange={handleDestinationChange}
              onChange={(event, newInput) => {
                setDestination(newInput);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Destination" />
              )}
            />
          </div>
          {/* LOCATION/DESTINATION INPUTS END */}

          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearchOnClick}
          >
            Create Route
          </Button>
        </div>
        {/* ROUTE INFO */}
        <div id="route-info-container">
          <h3>Route Info</h3>
          <div id="route-info-loc-dest">
            <div className="route-info-loc-dest-container">
              <p className="route-info-label">Location</p>
              <p className="route-info-value">
                {routeDisplayed && location.label}
              </p>
            </div>
            <div className="route-info-loc-dest-container">
              <p className="route-info-label">Destination</p>
              <p className="route-info-value">
                {routeDisplayed && destination.label}
              </p>
            </div>
          </div>
          <div id="route-info-results">
            <div className="route-info-results-container">
              <img src={BeerIcon} width={68}></img>
              <p className="route-info-label">Duration</p>
              <p className="route-info-value">
                {convertSecondsToMinutesAndSeconds(props.tripInfo[0][0])}
              </p>
              <p className="route-info-label">Distance</p>
              <p className="route-info-value">
                {convertMetersToKilometersAndMeters(props.tripInfo[0][1])}
              </p>
            </div>
            <div className="vertical-line"></div>
            <div className="route-info-results-container">
              <img src={WineIcon} width={70}></img>
              <p className="route-info-label">Duration</p>
              <p className="route-info-value">
                {convertSecondsToMinutesAndSeconds(props.tripInfo[1][0])}
              </p>
              <p className="route-info-label">Distance</p>
              <p className="route-info-value">
                {convertMetersToKilometersAndMeters(props.tripInfo[1][1])}
              </p>
            </div>
          </div>
        </div>
        {/* ROUTE INFO END */}
      </div>
      <VisibilityButton />
    </div>
  );
}

export default Input;

//function to convert seconds to minutes and seconds
const convertSecondsToMinutesAndSeconds = (seconds) => {
  const minutes = Math.round(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

//function to convert meters to kilometers and meters
const convertMetersToKilometersAndMeters = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  const kilometers = Math.round(meters / 1000);
  const remainingMeters = Math.round(meters % 1000);
  return `${kilometers}.${remainingMeters}km`;
};
