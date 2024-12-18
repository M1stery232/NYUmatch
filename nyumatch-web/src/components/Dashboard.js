import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext'; 
import { auth } from '../firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/Dashboard.css';


const Dashboard = () => {
    const { userData, setUserData } = useContext(UserContext); 
    const navigate = useNavigate(); 
    const [matchedUser, setMatchedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [matchError, setMatchError] = useState(null);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setUserData(null); 
            navigate('/'); 
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    const handleMatch = async (matchType) => {
        try {
            setMatchError(null); 
            setIsLoading(true);
            const response = await axios.post('http://127.0.0.1:5000/match', {
                email: userData.email,
                matchType: matchType
            });
            setMatchedUser(response.data.matchedUser);
            setIsLoading(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to find match:', error);
            setIsLoading(false);
            if (error.response && error.response.status === 404) {
                setMatchError(error.response.data.error);
            }
        }
    };

    const handleUnmatch = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/unmatch', {
                email: userData.email
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to unmatch:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setUserData(null);
                navigate('/');
            } else if (!userData) {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/user', {
                        params: {
                            email: user.email
                        }
                    });
                    if (response.status === 200) {
                        setUserData(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    navigate('/');
                }
            }
        });

        return () => unsubscribe();
    }, [setUserData, navigate, userData]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userData && userData.email) {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/user', {
                        headers: {
                            Authorization: `Bearer ${userData.token}`, 
                        },
                        params: {
                            email: userData.email 
                        }
                    });
                    if (response.status === 200) {
                        setUserData(response.data); 
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

        fetchUserData();
    }, [userData, setUserData]);

    useEffect(() => {
        const fetchMatchedUser = async () => {
            if (userData && userData.currentMatch) {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/user', {
                        params: {
                            email: userData.currentMatch
                        }
                    });
                    console.log('Fetched user data:', response.data);
                    if (response.status === 200) {
                        setMatchedUser({
                            email: response.data.email,
                            name: response.data.name,
                            major: response.data.major,
                            somethingAboutMe: response.data.somethingAboutMe,
                            matchExplanation: response.data.matchExplanation
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch matched user:', error);
                }
            }
        };

        fetchMatchedUser();
    }, [userData]);

    if (!userData) {
        navigate('/'); 
        return null; 
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <h2 className="user-email">{userData.email}</h2>
            </div>
            <div className="user-info-card">
                <div className="user-info-grid">
                    <div className="user-info-item">
                        <div className="user-info-label">Name:</div>
                        <div className="user-info-value">{userData.name}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Major:</div>
                        <div className="user-info-value">{userData.major}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Residency:</div>
                        <div className="user-info-value">{userData.residency}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Gender:</div>
                        <div className="user-info-value">{userData.gender}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Social Goal:</div>
                        <div className="user-info-value">{userData.socialGoal}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Personality Type:</div>
                        <div className="user-info-value">{userData.personalityType}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Nationality:</div>
                        <div className="user-info-value">{userData.nationality}</div>
                    </div>
                    <div className="user-info-item">
                        <div className="user-info-label">Something About Me:</div>
                        <div className="user-info-value">{userData.somethingAboutMe}</div>
                    </div>
                </div>
            </div>
            
            <div className="match-buttons">
                <button 
                    onClick={() => handleMatch('similar')}
                    className="btn btn-primary"
                    disabled={userData.currentMatch}
                >
                    Match with someone similar
                </button>
                <button 
                    onClick={() => handleMatch('different')}
                    className="btn btn-primary"
                    disabled={userData.currentMatch}
                >
                    Match with someone different
                </button>
            </div>
            
            <button onClick={handleSignOut} className="btn btn-secondary">
                Sign Out
            </button>
            
            {isLoading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>Finding your match...</h2>
                    <p>Please wait while we analyze your compatibility</p>
                </div>
            )}
            
            {matchedUser && (
                <div className="matched-user-card">
                    <h2 className="matched-user-title">Your Match</h2>
                    <div className="user-info-grid">
                        <div className="user-info-item">
                            <div className="user-info-label">Name:</div>
                            <div className="user-info-value">{matchedUser.name}</div>
                        </div>
                        <div className="user-info-item">
                            <div className="user-info-label">Major:</div>
                            <div className="user-info-value">{matchedUser.major}</div>
                        </div>
                        <div className="user-info-item">
                            <div className="user-info-label">Something About Me:</div>
                            <div className="user-info-value">{matchedUser.somethingAboutMe}</div>
                        </div>
                        <div className="user-info-item">
                            <div className="user-info-label">Email:</div>
                            <div className="user-info-value">{matchedUser.email}</div>
                        </div>
                    </div>
                    <div className="match-explanation">
                        <strong>Why You Matched:</strong> {matchedUser.matchExplanation}
                    </div>
                    <button 
                        onClick={handleUnmatch}
                        className="btn btn-secondary"
                    >
                        Unmatch
                    </button>
                </div>
            )}
            
            {matchError && (
                <div className="error-message">
                    {matchError}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

