import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';
import Settings from './components/Settings';
import NavMenu from './components/NavMenu';
import { jwtDecode } from 'jwt-decode';

function App() {
    const [difficulty, setDifficulty] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const [settings, setSettings] = useState({ count: 2, operations: ['+', '-', '*', '/'], timeLimit: 120 });

    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
        setCurrentScreen('example');
    };

    const handleSaveSettings = (newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
        setCurrentScreen('difficulty');
    };

    const handleTimeChange = (newTime) => {
        setSettings((prev) => ({ ...prev, timeLimit: newTime }));
    };

    const handleLogin = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        setCurrentScreen('difficulty');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentScreen('welcome');
        localStorage.removeItem('token');
    };

    const handleRegister = () => setIsRegistering(false);

    const toggleRegister = () => setIsRegistering(!isRegistering);

    const navigateTo = (screen) => {
        setCurrentScreen(screen);
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            handleLogout();
        } else if (token) {
            setIsAuthenticated(true);
            setCurrentScreen('difficulty');
        } else {
            setCurrentScreen('welcome');
        }
    }, []);

    useEffect(() => {
        if (currentScreen === 'welcome') {
            const timer = setTimeout(() => setCurrentScreen('login'), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentScreen]);

    return (
        <div className="App">
            {!isAuthenticated ? (
                currentScreen === 'welcome' ? (
                    <WelcomeScreen />
                ) : isRegistering ? (
                    <Register onRegister={handleRegister} toggleAuthForm={toggleRegister} />
                ) : (
                    <Login onLogin={handleLogin} toggleAuthForm={toggleRegister} />
                )
            ) : (
                <div>
                    {currentScreen === 'profile' ? (
                        <Profile onLogout={handleLogout} />
                    ) : currentScreen === 'example' ? (
                        <Example
                            difficulty={difficulty}
                            settings={settings}
                            onBack={() => navigateTo('difficulty')}
                        />
                    ) : currentScreen === 'settings' ? (
                        <Settings
                            onSaveSettings={handleSaveSettings}
                            onBack={() => navigateTo('difficulty')}
                            initialTime={settings.timeLimit}
                            onTimeChange={handleTimeChange}
                        />
                    ) : (
                        <DifficultySelection onSelectDifficulty={handleSelectDifficulty} />
                    )}
                    <NavMenu onNavigate={navigateTo} />
                </div>
            )}
        </div>
    );
}

export default App;
