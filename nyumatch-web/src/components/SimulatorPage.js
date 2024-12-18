import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import '../styles/global.css';

const SimulatorPage = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <div className="textBlock" style={{ width: '80%', maxWidth: '1200px' }}>
                <h1 className="heading">Why NYU Match?</h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ flex: 1, margin: '0 20px' }}>
                        <h2>With NYU Match</h2>
                        <img 
                            src="/with_nyu_match.png"
                            alt="With NYU Match"
                            style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}
                        />
                        <p>Experience meaningful connections and expand your social network within the NYU community.</p>
                    </div>
                    
                    <div style={{ flex: 1, margin: '0 20px' }}>
                        <h2>Without NYU Match</h2>
                        <img 
                            src="/without_nyu_match.png"
                            alt="Without NYU Match"
                            style={{ width: '100%', maxWidth: '500px', marginBottom: '20px' }}
                        />
                        <p>Limited opportunities to meet new people outside your immediate social circle.</p>
                    </div>
                </div>

                <button 
                    onClick={handleBackToHome}
                    className="button"
                    style={{ marginTop: '20px' }}
                >
                    Back to Home Page
                </button>
            </div>
        </div>
    );
};

export default SimulatorPage; 