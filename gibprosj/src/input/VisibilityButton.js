import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from 'react';

function VisibilityButton( props ) {

    const [hidden, setHidden] = useState(false);

    const hideMenuOnClick = () => {
        if (hidden) {
          const menu = document.getElementById("input-container");
          menu.style.transform = "translateX(0)";
          setHidden(false);
        } else {
          const menu = document.getElementById("input-container");
          menu.style.transform = "translateX(-281.5px)";
          setHidden(true);
        }
    };

    return (
        <div id="input-visibility-button" onClick={hideMenuOnClick}>
            {hidden ? 
            <ArrowForwardIosIcon /> : <ArrowBackIosIcon />
            }          
        </div>
    )
}

export default VisibilityButton;