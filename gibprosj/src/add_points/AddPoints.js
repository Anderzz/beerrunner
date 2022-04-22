import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import PointInput from "../point_input/PointInput";
import { useState } from "react";
import { point } from "@turf/turf";

function AddPoints(props) {
  const ShowInputField = () => {
    props.potet();
  };
  return (
    <div id="AddPointsButton">
      <SpeedDial ariaLabel="Navigation speed dial" icon={<SpeedDialIcon />}>
        <SpeedDialAction
          icon={<LocalDrinkIcon />}
          tooltipTitle="Beer"
          onClick={ShowInputField}
        />
        <SpeedDialAction
          icon={<LocalBarIcon />}
          tooltipTitle="Liqure Store"
          onClick={ShowInputField}
        />
      </SpeedDial>
    </div>
  );
}

export default AddPoints;
