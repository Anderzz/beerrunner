import ReactTooltip from 'react-tooltip';
import InfoLogo from '../static/images/information.png'

function Header() {
    return (
        <div id="header">
          <h4>BeerRunner</h4>
          <img src={InfoLogo} data-tip data-for="tooltip-container" width={20}></img>
          <ReactTooltip
              id="tooltip-container"
              place="bottom"
              type="info"
              effect="solid"
          >This is the description</ReactTooltip>
        </div>
    )
}


export default Header;
