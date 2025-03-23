import React, { useState } from 'react';
import "./Register.css";
import axios from 'axios';

function Register({ onRegister, toggleAuthForm }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!isChecked) {
            setError("Заполните все поля");
            return;
        }
        setError('');
        const { day, month, year } = birthDate;
        const formattedBirthDate = `${year}-${month}-${day}`;

        try {
            console.log("Registering user:", { firstName, lastName, formattedBirthDate, username, password });
            await axios.post('http://localhost:5000/api/auth/register', {
                firstName,
                lastName,
                birthDate: formattedBirthDate,
                username,
                password
            });
            onRegister();
        } catch (error) {
            console.error("Registration error:", error.response || error.message);
            alert("Ошибка при регистрации пользователя");
        }
    };

    return (
        <div className="block2">
            <div className="left">
                <h1 className="registration">Регистрация</h1>
                <h2>Имя</h2>
                <input className="registration" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                <h2>Фамилия</h2>
                <input className="registration" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                <h2>Дата рождения</h2>
                <div className="birthdate-inputs">
                    <input className="registration" type="number" placeholder="День" value={birthDate.day} onChange={(e) => setBirthDate(prev => ({...prev, day: e.target.value}))}/>
                    <input className="registration" type="number" placeholder="Месяц" value={birthDate.month} onChange={(e) => setBirthDate(prev => ({...prev, month: e.target.value}))}/>
                    <input className="registration" type="number" placeholder="Год" value={birthDate.year} onChange={(e) => setBirthDate(prev => ({...prev, year: e.target.value}))}/>
                </div>
                <h2>Логин</h2>
                <input className="registration" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <h2>Пароль</h2>
                <input className="registration" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <div className="checkbox-container">
                    <input type="checkbox" id="agree" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}/>
                    <label htmlFor="agree">
                        <a className="politika" href="/privacy.pdf">Согласен на обработку персональных данных</a>
                    </label>
                </div>
                {error && <p className="error-message">{error}</p>}

                <button className="registration" onClick={handleRegister}>Создать аккаунт</button>
                <button onClick={toggleAuthForm} className="toggle-button">Войти в существующий аккаунт</button>
            </div>
        </div>
    );
}

export default Register;
