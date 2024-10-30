import React, { useState } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';

function App() {
    const [difficulty, setDifficulty] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // Начальное состояние — авторизация

    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleRegister = () => {
        setIsRegistering(false); // После регистрации показываем форму входа
    };

    const toggleRegister = () => {
        setIsRegistering(!isRegistering); // Переключение между регистрацией и авторизацией
    };

    const handleBackToDifficultySelection = () => {
        setDifficulty(null);
    };

    return (
        <div className="App">
            {!isAuthenticated ? (
                isRegistering ? (
                    <div>
                        <Register onRegister={handleRegister} toggleAuthForm={toggleRegister} />
                    </div>
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
                </div>
            )}
        </div>
    );
}

export default App;
