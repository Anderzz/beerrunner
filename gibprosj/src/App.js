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

  const [tripInfo, setTripInfo] = useState([[0, 0], [0, 0]]);
  const sendTripInfoToParent = (info) => {
    setTripInfo(info)
    console.log(info)
  }


  return (
    <div className="app">
      <Input 
        sendDataToParent={sendDataToParent} 
        tripInfo={tripInfo}
      />
      <MapContainer 
        inputs={input} 
        sendTripInfoToParent={sendTripInfoToParent}
      />
      <AddPoints potet={ShowPointInput} />
      {hidden && <PointInput />}
    </div>
  );
}

export default App;
