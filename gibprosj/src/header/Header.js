import ReactTooltip from "react-tooltip";
import InfoLogo from "../static/images/information.png";
import AppLogo from "../static/images/logo_beerrunner.png";

function Header() {
  return (
    <div id="header">
      <div id="logo">
        <img src={AppLogo}></img>
      </div>
      <div id="info-button">
        <img
          src={InfoLogo}
          data-tip
          data-for="tooltip-container"
          width={20}
        ></img>
        <ReactTooltip
          id="tooltip-container"
          place="bottom"
          type="info"
          effect="solid"
        >
          1) Skriv inn ønsket start- og stopposisjon. {<br />} 2) Trykk på
          'CREATE ROUTE'. {<br />} 3) Velg ønsket rute, se nærmere informasjon
          nede til venstre. {<br />} 4) Kom deg på vors!
        </ReactTooltip>
      </div>
    </div>
  );
}

export default Header;
