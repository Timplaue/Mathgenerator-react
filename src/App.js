import React, { useState } from 'react';
import './App.css';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import Register from './components/Register';
import Login from './components/Login';
import logo from './assets/logo.svg'; // Путь к вашему логотипу

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
                        <img src={logo} alt="Logo" />
                        <h1>Добро пожаловать!</h1>
                        <Login onLogin={handleLogin} />
                    </div>
                )
            ) : (
                <div>
                    <img src={logo} alt="Logo" />
                    <h1>Мат генератор</h1>
                    {difficulty ? (
                        <Example difficulty={difficulty} />
                    ) : (
                        <DifficultySelection onSelectDifficulty={handleSelectDifficulty} />
                    )}
                </div>
            )}
            {isAuthenticated || (
                <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегестрироваться'}
                </button>
            )}
        </div>
    );
}

export default App;
