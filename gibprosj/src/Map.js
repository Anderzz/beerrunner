import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5kZXJ6IiwiYSI6ImNremZod2Z4MDByNXQydm55NmJtN24yNzgifQ.zR-oZIQ3MYpPVl-mlOtxkw";

class Mapp extends React.Component {
  // Set up states for updating map
  constructor(props) {
    super(props);
    this.state = {
      lng: 10,
      lat: 80,
      zoom: 4,
    };
  }

  componentDidMount() {
    // Set up map
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom,
    });
  }

  render() {
    return (
      <div>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{ width: "100%", height: "100vh", zoom: 1 }}
        />
      </div>
    );
  }
}

export default Mapp;
