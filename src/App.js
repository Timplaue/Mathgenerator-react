import React, { useState } from 'react';
import './App.css';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    const [difficulty, setDifficulty] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // Изменено на false для отображения формы авторизации первой

    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleRegister = () => {
        setIsRegistering(false); // После регистрации показываем форму входа
    };

    // Функция для сброса выбора сложности
    const handleBackToDifficultySelection = () => {
        setDifficulty(null);
    };

    return (
        <div className="App">
            {!isAuthenticated ? (
                isRegistering ? (
                    <div>
                        <h1>Регистрация</h1>
                        <Register onRegister={handleRegister} />
                    </div>
                ) : (
                    <div>
                        <Login onLogin={handleLogin} />
                    </div>
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
            {isAuthenticated || (
                <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Войти' : 'Регистрация'}
                </button>
            )}
        </div>
    );
}

export default App;
