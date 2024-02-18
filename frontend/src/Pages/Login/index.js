import React, { useState } from 'react';
import axios from '../../axiosConfig';
import './styles.css'; // Import the CSS file for Login component

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/login', { email, password })
      .then((response) => {
        console.log('User logged in successfully.');
        localStorage.setItem('token', response.data.token);
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        setEmail('');
        setPassword('');
      });
  };

  return (
    <div className="login-container"> {/* Apply CSS class for Login container */}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
