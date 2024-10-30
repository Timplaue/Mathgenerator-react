import React, { useState } from 'react';
import axios from 'axios';
import "./Login.css";
import logo from '../assets/logo.svg';

function Login({ onLogin, onToggleRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            localStorage.setItem('token', response.data.token); // Сохраняем токен
            onLogin(); // Вызываем callback для переключения на главную часть приложения
        } catch (error) {
            alert("Error logging in");
        }
    };

    return (
        <div className="block">
            <img src={logo} alt="Logo" className="login-logo"/>
            <h1>Добро пожаловать!</h1>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Войти</button>
            <button onClick={onToggleRegister} className="toggle-button">
                Регистрация
            </button>
        </div>
    );
}

export default Login;
