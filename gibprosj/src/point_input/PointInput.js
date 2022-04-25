import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function PointInput() {
  const PointCreater = () => {};

  return (
    <div id="pointinput">
      <h2 id="point-input-header"> Add your point </h2>
      <div id="pointinputlabels">
        <TextField label="Latitude" />
        <TextField label="longitude" />
        <Button variant="outlined" onClick={PointCreater}>
          Add point
        </Button>
      </div>
    </div>
  );
}

export default PointInput;
