import React, { useEffect, useState } from "react";
import "./App.css";
import Input from "./input/Input";
import MapContainer from "./map/Map";

function App() {
  const [input, setInput] = useState([]);
  const sendDataToParent = (input) => {
    setInput(input);
    console.log(input);
  };

  return (
    <div className="app">
      <Input sendDataToParent={sendDataToParent} />
      <MapContainer inputs={input} />
    </div>
  );
}

export default App;
