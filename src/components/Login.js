import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import logo from '../assets/logo.svg';

function Login({ onLogin, toggleAuthForm }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
                onLogin(token); // Передаем токен в App.js
            } else {
                setError('Не удалось получить токен');
            }
        } catch (error) {
            console.error("Ошибка при входе:", error);
            setError('Неправильный логин или пароль');
        }
    };

    return (
        <div className="block">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Добро пожаловать!</h1>
            {error && <p className="error-message">{error}</p>}
            <input
                className="auth"
                type="text"
                name="username"
                placeholder="Логин"
                value={credentials.username}
                onChange={handleChange}
            />
            <input
                className="auth"
                type="password"
                name="password"
                placeholder="Пароль"
                value={credentials.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button className="auth" onClick={handleLogin}>
                Войти
            </button>
            <button onClick={toggleAuthForm} className="toggle-button">
                Регистрация
            </button>
        </div>
    );
}

export default Login;
