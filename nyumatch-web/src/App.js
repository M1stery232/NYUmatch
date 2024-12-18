import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../../nyumatch-web/src/components/HomePage';
import LoginPage from '../../nyumatch-web/src/components/LoginPage';
import SignUpPage from '../../nyumatch-web/src/components/SignUpPage';
import Dashboard from '../../nyumatch-web/src/components/Dashboard';
import SimulatorPage from '../../nyumatch-web/src/components/SimulatorPage';

const App = () => {

    let userData = null;
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage userData={userData} />} />
                <Route path="/login" element={<LoginPage userData={userData} />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<Dashboard userData={userData} />} />
                <Route path="/simulator" element={<SimulatorPage />} />
            </Routes>
        </Router>
    );
};

export default App;
