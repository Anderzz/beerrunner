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

  const closePointInput = () => {
    props.ShowPointInput();
  };

  return (
    <div id="pointinput">
      <h2 id="point-input-header"> Add your point</h2>
      <div id="close-point-input">
        <Button size="small" color="error" onClick={closePointInput}>
          X
        </Button>
      </div>
      <div id="pointinputlabels">
        <TextField
          size="small"
          label="Butikk"
          onChange={(e) => setLabel(e.target.value)}
        />

        <TextField
          size="small"
          label="Beskrivelse"
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          size="small"
          label="Latitude"
          type="number"
          onChange={(e) => setLat(e.target.value)}
        />
        <TextField
          size="small"
          label="Longitude"
          type="number"
          onChange={(e) => setLng(e.target.value)}
        />
        <div id="button-point-input">
          <Button
            fullWidth
            color="success"
            onClick={addPointToDb}
            variant="outlined"
          >
            Add point
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PointInput;
