import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

function Input(props) {
  const [hidden, setHidden] = useState(true);
  const [from, setFrom] = useState("Gløshaugen");
  const [to, setTo] = useState("Dragvoll");

  const handleFromChange = (event) => {
    setFrom(event.target.value);
  };
  const handleToChange = (event) => {
    setTo(event.target.value);
  };
  const handleSearchOnClick = () => {
    props.sendDataToParent([to, from]);
  };

  const hideMenuOnClick = () => {
    if (hidden) {
      const menu = document.getElementById("input-container");
      menu.style.transform = "translateX(0)";
      setHidden(false);
    } else {
      const menu = document.getElementById("input-container");
      menu.style.transform = "translateX(-240px)";
      setHidden(true);
    }
  };
  
  //onClick={hideMenuOnClick}

  return (
    <div id="input-container" >
      <TextField
        id="outlined-basic"
        label="From"
        variant="outlined"
        value={from}
        onChange={handleFromChange}
      />
      <TextField
        id="outlined-basic"
        label="To"
        variant="outlined"
        value={to}
        onChange={handleToChange}
      />
      <Button
        variant="outlined"
        startIcon={<SearchIcon />}
        onClick={handleSearchOnClick}
      >
        Search
      </Button>
    </div>
  );
}

export default Input;
