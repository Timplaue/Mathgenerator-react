import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';

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
        setCurrentScreen('difficulty'); // Перенаправление на экран выбора сложности
        // В этом месте вы будете сохранять реальный токен, полученный с сервера
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjYzMjE0NzUxMWY3MTRjYzc1OWIzMSIsImlhdCI6MTczMDU1OTUzMywiZXhwIjoxNzMwNTYzMTMzfQ.nNH_J8WYw6a6GRhfyFbhj9YjifxJ5Bfh8mieS6rTLx4';
        localStorage.setItem('token', token); // Здесь сохраняется токен
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentScreen('welcome'); // Вернуться к экрану приветствия
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
            setCurrentScreen('difficulty'); // Перенаправление на экран выбора сложности
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
                    <Profile /> {/* Вставляем компонент профиля */}
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
