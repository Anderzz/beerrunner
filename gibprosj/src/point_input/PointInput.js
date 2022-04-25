import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";

function PointInput(props) {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const PointInputValues = () => {
    props.visible();
  };

  return (
    <div id="pointinput">
      <h2 id="point-input-header"> Add your point </h2>
      <div id="pointinputlabels">
        <TextField
          label="Latitude"
          onChange={(event) => {
            setValue1(event.target.value);
          }}
        />
        <TextField
          label="longitude"
          onChange={(event) => {
            setValue2(event.target.value);
          }}
        />
        <Button variant="outlined" onClick={PointInputValues}>
          Add point
        </Button>
      </div>
    </div>
  );
}

export default PointInput;
