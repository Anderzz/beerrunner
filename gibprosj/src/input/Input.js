import { useState, useEffect, useRef } from "react";
import VisibilityButton from "./VisibilityButton";

//Mui stuff
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from '@material-ui/styles';

//Mapbox stuff
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";


const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

mapboxgl.accessToken = MAPBOX_TOKEN;


function Input(props) {

  // Styling
  const classes = useStyles();

  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [stop1, setStop1] = useState("");
  const [stop2, setStop2] = useState("");
  const [stop3, setStop3] = useState("");

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
          console.log(match)
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

  const handleStop1Change = (event) => {
    setStop1(event.target.value);
  }

  const handleStop2Change = (event) => {
    setStop2(event.target.value);
  }

  const handleStop3Change = (event) => {
    setStop3(event.target.value);
  }

  const handleSearchOnClick = () => {
    props.sendDataToParent([location, destination]);
  };

  return (
    <div id="input-container">
      <div id="input-main-body">
        <div id="header">
          <h4>AtCtB</h4>
        </div>
        <div id="input-fields">
          {/* LOCATION INPUTS */}
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
          {/* LOCATION INPUTS END */}

          {/* STOP SELECTORS */}
          <div id="stop-selectors">
          <FormControl fullWidth>
            <InputLabel id="stop-1-label">Stop 1</InputLabel>
            <Select 
              labelId="stop-1-label"
              id="stop-1"
              value={stop1}
              label="Stop 1"
              onChange={handleStop1Change}
              classes={{icon:classes.icon}}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Grocery Store">Grocery Store</MenuItem>
              <MenuItem value="Liqour Store">Liqour Store</MenuItem>
              <MenuItem value="Clothing Store">Clothing Store</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="stop-2-label">Stop 2</InputLabel>
            <Select 
              labelId="stop-2-label"
              id="stop-2"
              value={stop2}
              label="Stop 2"
              onChange={handleStop2Change}
              classes={{icon:classes.icon}}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Grocery Store">Grocery Store</MenuItem>
              <MenuItem value="Liqour Store">Liqour Store</MenuItem>
              <MenuItem value="Retail Store">Clothing Store</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="stop-3-label">Stop 3</InputLabel>
            <Select 
              labelId="stop-3-label"
              id="stop-3"
              value={stop3}
              label="Stop 3"
              onChange={handleStop3Change}
              classes={{icon:classes.icon}}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Grocery Store">Grocery Store</MenuItem>
              <MenuItem value="Liqour Store">Liqour Store</MenuItem>
              <MenuItem value="Retail Store">Clothing Store</MenuItem>
            </Select>
          </FormControl>
          </div>
          {/* STOP SELECTORS END */}

          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSearchOnClick}
          >
            Create Route
          </Button>
        </div>
      </div>
      <VisibilityButton />
    </div>
  );
}

// Styles for the select arrow icons
const useStyles = makeStyles((theme) => ({
  icon: {
      marginLeft: 190,
  }
}));

export default Input;
