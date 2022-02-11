import React, { useEffect, useState } from "react";
import Mapp from "./Map";
import ReactMapGL from "react-map-gl";

function App() {
  // return (
  //   <ReactMapGL
  //     initialViewState={{
  //       longitude: -122.4,
  //       latitude: 37.8,
  //       zoom: 14,
  //     }}
  //     style={{ width: "100vw", height: "100vh" }}
  //     mapStyle="mapbox://styles/mapbox/streets-v9"
  //   />
  // );
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      {users.map((user) => {
        const { name, age } = user;
        return (
          <div>
            <p>{name}</p>
            <p>{age}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
