import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import LocalBarIcon from "@material-ui/icons/LocalBar";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import PointInput from "../point_input/PointInput";
import { useState } from "react";
import { point } from "@turf/turf";

function AddPoints(props) {
  const ShowInputFieldWine = () => {
    props.ShowPointInput("Vinmonopol");
  };
  const ShowInputFieldBeer = () => {
    props.ShowPointInput("Dagligvarehandel");
  };
  return (
    <div id="AddPointsButton">
      <SpeedDial ariaLabel="Navigation speed dial" icon={<SpeedDialIcon />}>
        <SpeedDialAction
          icon={<LocalDrinkIcon />}
          tooltipTitle="Beer"
          onClick={ShowInputFieldBeer}
        />
        <SpeedDialAction
          icon={<LocalBarIcon />}
          tooltipTitle="Liquor Store"
          onClick={ShowInputFieldWine}
        />
      </SpeedDial>
    </div>
  );
}

export default AddPoints;
