import React, { useContext, useState, } from 'react';
import './sign-in.css'; // Optional, for custom styles
import axios from 'axios';
import { useAuth } from '../../authContext';
import { checkAuth } from '../../utils/checkAuth';
import { useNavigate } from 'react-router-dom';
import lightModeContext from '../../lightModeContext';
import { toast } from 'sonner'

function SignIn({ onSignIn }) {
  const navigate = useNavigate()
  const { login } = useAuth();
  const { lightMode } = useContext(lightModeContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ublog-ht6u.onrender.com/app/login', formData);
      login(response.data)
      navigate('/')
      const authUser = checkAuth()
      if (authUser) {
        console.log('User details after signin');
        toast.success('Welcome back!', {
          style: {
            backgroundColor: '#4caf50',
            color: '#fff',
            borderRadius: '8px',
            border: 'none'
          },
        });
      }
    } catch (error) {
      console.error('There was an error logging in the user!', error);
      toast.error('Failed to sign in. Please check your credentials.', {
        style: {
          backgroundColor: '#c12a2a',
          color: '#fff',
          borderRadius: '8px',
          border: 'none'
        },
      });
    }
  };

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div className={`mainC ${lightMode ? 'light-mode' : ''}`}>
      <div className="sign-in-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              onChange={handleChange}
              value={formData.username}
              name='username'
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="btnGrp">
            <button className='back' onClick={handleBack}>Back</button>
            <button className='SignInBtn' type="submit">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
