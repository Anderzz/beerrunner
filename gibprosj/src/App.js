import React, { useEffect, useState } from "react";
import "./static/css/App.css";
import Input from "./input/Input";
import MapContainer from "./map/Map";
import AddPoints from "./add_points/AddPoints";
import PointInput from "./point_input/PointInput";
import LoadingScreen from "./loading/LoadingScreen";

function App() {
  const [input, setInput] = useState([]);
  const sendDataToParent = (input) => {
    setInput(input);
  };

  const [showWineRoute, setShowWineRoute] = useState(true);
  const [showBeerRoute, setShowBeerRoute] = useState(true);

  const showWineRouteClicked = () => {
    setShowWineRoute(!showWineRoute);
  };

  const showBeerRouteClicked = () => {
    setShowBeerRoute(!showBeerRoute);
  };

  const [hidden, setHidden] = useState(false);
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const ShowPointInput = (category, label, description) => {
    setHidden(!hidden);
    setCategory(category);
    setLabel(label);
    setDescription(description);
  };

  const [tripInfo, setTripInfo] = useState([
    [0, 0],
    [0, 0],
  ]);
  const sendTripInfoToParent = (info) => {
    setTripInfo(info);
  };

  return (
    <div className="app">
      <Input
        sendDataToParent={sendDataToParent}
        tripInfo={tripInfo}
        showWineRouteClicked={showWineRouteClicked}
        showBeerRouteClicked={showBeerRouteClicked}
      />
      <MapContainer
        inputs={input}
        sendTripInfoToParent={sendTripInfoToParent}
        showBeerRoute={showBeerRoute}
        showWineRoute={showWineRoute}
      />
      <AddPoints ShowPointInput={ShowPointInput} />
      {hidden && <PointInput ShowPointInput={ShowPointInput} />}
      <LoadingScreen />
    </div>
  );
}

export default App;
