import React, { useContext, useState } from 'react';
import './sign-up.css'; // Optional, for custom styles
import { useNavigate } from 'react-router-dom';
import axios
 from 'axios';
import lightModeContext from '../../lightModeContext';
import { toast } from 'sonner';

function SignUp({ onSignUp }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {lightMode} = useContext(lightModeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      email,
      username,
      password
    };
    // Call the onSignUp function passed as a prop with the new user details
    try {
      const response = await axios.post('https://ublog-ht6u.onrender.com/app/register', newUser);
      console.log('user registered');
      toast.success('User registered successfully!');
      navigate('/login')
    } catch (error) {
      console.error('There was an error registering the user!', error);
      toast.error('Sign up unsuccessful');
    }
  };
  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div className={`mainC ${lightMode ? 'light-mode' : ''}`}>
      <div className="sign-up-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="btnGrp">
        <button className='back' onClick={handleBack}>Back</button>
        <button className='SignUpBtn' type="submit">Sign Up</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default SignUp;
