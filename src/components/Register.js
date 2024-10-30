import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
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
        <div>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;
