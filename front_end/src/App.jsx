import React from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:3000/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
