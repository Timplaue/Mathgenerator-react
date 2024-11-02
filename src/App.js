import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import WelcomeScreen from './components/WelcomeScreen';

function App() {
    const [difficulty, setDifficulty] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('welcome');

    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('token', 'user_token'); // Здесь сохраняется токен
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token'); // Удаляем токен при выходе
    };

    const handleRegister = () => {
        setIsRegistering(false);
    };

    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
    };

    const handleBackToDifficultySelection = () => {
        setDifficulty(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            setCurrentScreen('difficulty'); // Измените на 'difficulty' или любой другой экран по умолчанию
        } else {
            setCurrentScreen('welcome');
        }
    }, []);

    useEffect(() => {
        if (currentScreen === 'welcome') {
            const timer = setTimeout(() => {
                setCurrentScreen('login');
            }, 2000);
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
                    {difficulty ? (
                        <Example difficulty={difficulty} onBack={handleBackToDifficultySelection} />
                    ) : (
                        <DifficultySelection onSelectDifficulty={handleSelectDifficulty} />
                    )}
                    <button onClick={handleLogout}>Выйти</button>
                </div>
            )}
        </div>
    );
}

export default App;
