import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import '../styles/global.css';

const HomePage = () => {
  return (
    <div className="container">
      <div className="textBlock">
        <h1 className="heading">Welcome to NYU Match!</h1>
        <p className="paragraph">
          Connect with fellow students and expand your network.
          Sign up now to get started!
        </p>
        <p className="paragraph">
          NYU Match is a platform designed to facilitate communication and collaboration 
          between NYU students from all majors and classes. By signing up, you will get matched with a student also in NYU.
        </p>
        <p className="paragraph">
          Use this opportunity to grab a coffee and get to know people outside of your regular
          social network, broaden your horizon, and learn about things going on outside 
          of your comfort zone.
        </p> 
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link to="/login" className="button">Get Started</Link>
            <Link to="/simulator" className="button">Why NYU Match</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;