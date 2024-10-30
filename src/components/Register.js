import React, { useState } from 'react';
import "./Register.css";
import axios from 'axios';

function Register({ onRegister, toggleAuthForm}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            console.log("Registering user:", { username, password }); // Лог отправляемых данных
            await axios.post('http://localhost:5000/api/register', { username, password });
            onRegister();
        } catch (error) {
            console.error("Registration error:", error.response || error.message); // Лог ошибки
            alert("Error registering user");
        }
    };

    return (
        <div className="block1">
            <div className="left">
                <h1 className="registration">Регистрация</h1>
                <h2>Логин</h2>
                <input className="registration" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <h2>Пароль</h2>
                <input className="registration" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="registration" onClick={handleRegister}>Создать аккаунт</button>
                <button onClick={toggleAuthForm} className="toggle-button">Войти в существующий аккаунт</button>
            </div>
        </div>
    );
}

export default Register;
