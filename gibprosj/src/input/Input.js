import { useState, useEffect, useRef } from "react";
import VisibilityButton from "./VisibilityButton";

//Mui stuff
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
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

  const [routeDisplayed, setRouteDisplayed] = useState(false)

  const [ locationQueryMatches, setLocationQueryMatches ] = useState([]);
  const [ destinationQueryMatches, setDestinationQueryMatches ] = useState([]);

  const geocodingClient = useRef(null)

  // Creating a geocoder on first render which can be used later
  useEffect(() => {
    geocodingClient.current = mbxGeocoding({
      accessToken: mapboxgl.accessToken,
    });
  }, [])

  // Called when more than "limit" words are typed in the location input field
  const handleLocationChange = (event) => {

    if (event.target.value.length > 3) {

      console.log("Geocoder API call")

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
          
          let matches = []
          for (let i = 0; i < match.features.length; i++) {
            const coordinates = match.features[i].geometry.coordinates;
            const placeName = match.features[i].place_name;
            const place = {
              label: placeName,
              coord: coordinates,
            }
            matches.push(place)
          }
          setLocationQueryMatches(matches);
        }); 
    }
  };

  // Called when more than "limit" words are typed in the destination input field
  const handleDestinationChange = (event) => {

    if (event.target.value.length > 3) {

      console.log("Geocoder API call")

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
          let matches = []

          for (let i = 0; i < match.features.length; i++) {
            const coordinates = match.features[i].geometry.coordinates;
            const placeName = match.features[i].place_name;
            const place = {
              label: placeName,
              coord: coordinates,
            }
            matches.push(place)
          }
          setDestinationQueryMatches(matches);
        });
    }
  };

  const handleSearchOnClick = () => {
    let points = [location, destination]
    props.sendDataToParent(points);
    setRouteDisplayed(true)
  };

  return (
    <div id="input-container">
      <div id="input-main-body">
        <div id="header">
          <h4>AtCtB</h4>
        </div>
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
                setLocation(newInput)
              }}
              renderInput={(params) => 
                <TextField 
                  {...params}
                  label="Location"
                />}
            />
            <Autocomplete
              id="autocomplete-to"
              freeSolo
              disableClearable
              options={destinationQueryMatches}
              onInputChange={handleDestinationChange}
              onChange={(event, newInput) => {
                setDestination(newInput)
              }}
              renderInput={(params) => 
                <TextField 
                  {...params}
                  label="Destination"
                />}
            
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
        <div id="route-info-container">
          <h3>Route Info</h3>
          <div id="route-info-loc-dest">
            <div className="route-info-loc-dest-container">
              <p>Location</p>
              <h4>{routeDisplayed && location.label}</h4>
            </div>
            <div className="route-info-loc-dest-container">
              <p>Destination</p>
              <h4>{routeDisplayed && destination.label}</h4>
            </div>
          </div>
          <div id="route-info-results">
            <div className="route-info-results-container">
              <img></img>
              <p>Duration</p>
              <p>{props.tripInfo[0][0]}</p>
              <p>Distance</p>
              <p>{props.tripInfo[0][1]}</p>
            </div>
            <div className="vertical-line"></div>
            <div className="route-info-results-container">
              <img></img>
              <p>Duration</p>
              <p>{props.tripInfo[1][0]}</p>
              <p>Distance</p>
              <p>{props.tripInfo[1][1]}</p>
            </div>
          </div>
        </div>
      </div>
      <VisibilityButton />
    </div>
  );
}


export default Input;
