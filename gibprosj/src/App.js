import React, { useEffect, useState } from "react";
import "./static/css/App.css";
import Input from "./input/Input";
import MapContainer from "./map/Map";
import AddPoints from "./add_points/AddPoints";
import PointInput from "./point_input/PointInput";

function App() {
  const [input, setInput] = useState([]);
  const sendDataToParent = (input) => {
    setInput(input);
  };

  const [hidden, setHidden] = useState(false);
  const ShowPointInput = () => {
    setHidden(!hidden);
  };

  return (
    <div className="app">
      <Input sendDataToParent={sendDataToParent} />
      <MapContainer inputs={input} />
      <AddPoints visible={ShowPointInput} />
      {hidden && <PointInput visible={ShowPointInput} />}
    </div>
  );
}

export default App;
