import Map, {
    Marker, 
    GeolocateControl,
    NavigationControl, 
    ScaleControl
} from 'react-map-gl';
import { useState, useEffect, useRef } from 'react'; 

const MAPBOX_TOKEN = "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

function MapContainer() {

    const [ viewState, setViewState ] = useState({
        latitude: 63.43,
        longitude: 10.4,
        zoom: 10,
    })

    return (
        <div className="map-container">
            <Map 
                onMove={(event) => setViewState(event.viewState)}
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />
        </div>
    )
}

export default MapContainer;