import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token'); // JWT from login
 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
       
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      setError('No token found. Please log in.');
    }
  }, [token]);

  return (
    <div>
      <h1>User List</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <strong>{user.name}</strong> <br />
              Email: {user.email} <br />
              Phone: {user.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersList;