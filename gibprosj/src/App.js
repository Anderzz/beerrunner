import React, { useEffect, useState } from "react";
import "./App.css";
import Input from "./input/Input";
import MapContainer from "./map/Map";

function App() {
  return (
    <div className="app">
      <Input /> 
      <MapContainer />
    </div>
  );
}

export default App;
