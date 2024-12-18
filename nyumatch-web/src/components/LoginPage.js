import React, { useState, useContext } from 'react';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../styles/global.css';

const LoginPage = () => {
    const { setUserData } = useContext(UserContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            console.log('Starting login process...');
            const result = await signInWithPopup(auth, provider);
            console.log('Firebase auth successful');
            
            const token = await result.user.getIdToken();
            console.log('Got token:', token.substring(0, 20) + '...');
            
            console.log('Sending request to backend...');
            const response = await axios.post('http://127.0.0.1:5000/login', { tokenId: token }, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
            console.log('Got response from backend:', response.status);

            if (response.status !== 200) {
                const errorData = response.data;
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
            }
            const data = response.data;
            console.log('Response data:', data);
            setUserData(data.user);
            if (response.status === 200 && response.data.needsSignup) {
                navigate('/signup');
            }
            else {
                navigate('/dashboard');
            }
        }
        catch (error) {
            console.error('Login failed:', error);
            setError('Failed to login. Please try again.');
        }
    };

    return (
        <div className="container">
          <div className="card">
            <h1 className="heading">Welcome to NYU Match</h1>
            <button 
              onClick={handleLogin}
              className="button"
              style={{ display: 'block', margin: '0 auto' }}
            >
              Sign in with Google
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      );
    }
    
    export default LoginPage;
    