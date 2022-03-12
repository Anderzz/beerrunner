import { useState, useEffect } from "react";


function Input() {

    const [ hidden, setHidden ] = useState(true);

    const hideMenuOnClick = () => {
        
        if (hidden) {
            const menu = document.getElementById("input-container");
            menu.style.transform = "translateX(0)";
            setHidden(false);
        }

        else {
            const menu = document.getElementById("input-container");
            menu.style.transform = "translateX(-240px)";
            setHidden(true);
        }
    }

    return (
        <div id="input-container" onClick={hideMenuOnClick}>

        </div>

    )
}

export default Input;