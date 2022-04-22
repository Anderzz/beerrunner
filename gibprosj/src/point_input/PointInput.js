import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function PointInput() {
  return (
    <div id="pointinput">
      <p> Add your point </p>
      <div id="pointinputlabels">
        <TextField label="Latitude" />
        <TextField label="longitude" />
        <Button variant="outlined">Add point</Button>
      </div>
    </div>
  );
}

export default PointInput;
