import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";

function PointInput(props) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const addPointToDb = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: props.category,
        label: label,
        description: description,
        lat: lat,
        lng: lng,
      }),
    };

    console.log(props.category, label, description, lat, lng);
    fetch("http://127.0.0.1:8000/api/points/", requestOptions)
      .then((response) => response.json())
      .then((res) => console.log(res));

    props.ShowPointInput();
  };

  return (
    <div id="pointinput">
      <h2 id="point-input-header"> Add your point </h2>
      <div id="pointinputlabels">
        <TextField label="Butikk" onChange={(e) => setLabel(e.target.value)} />
        <TextField
          label="Beskrivelse"
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Latitude"
          type="number"
          onChange={(e) => setLat(e.target.value)}
        />
        <TextField
          label="Longitude"
          type="number"
          onChange={(e) => setLng(e.target.value)}
        />
        <Button onClick={addPointToDb} variant="outlined">
          Add point
        </Button>
      </div>
    </div>
  );
}

export default PointInput;
