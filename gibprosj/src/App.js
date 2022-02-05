import React, { useEffect, useState } from "react";

function App() {
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
