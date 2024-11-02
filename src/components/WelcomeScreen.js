import React from 'react';
import './WelcomeScreen.css';
import logo from '../assets/logo.svg';

function WelcomeScreen() {
    return (
        <div className="welcome-screen">
            <img src={logo} className="logo" alt="logo" />
        </div>
    );
}

export default WelcomeScreen;
