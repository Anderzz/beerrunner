import React, { useEffect, useState } from "react";
import "./App.css";
import Input from "./input/Input";
import MapContainer from "./map/Map";
//import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
const MapboxDirections = require("@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions");

function App() {
  return (
    <div className="app">
      <Input />
      <MapContainer />
    </div>
  );
}

export default App;
