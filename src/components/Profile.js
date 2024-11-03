import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import logo from "../assets/logo.svg";

function Profile({ onLogout }) { // Добавьте onLogout как пропс
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        console.log('Текущий токен:', token);

        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfileData(response.data);
        } catch (error) {
            console.error("Ошибка при получении профиля:", error.response ? error.response.data : error.message);
            setError("Ошибка при получении профиля");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="block3">
            {error && <p>{error}</p>}
            {profileData && (
                <div>
                    <div className="header">
                        <img src={logo} className="difficulty-logo" alt="logo"/>
                        <h1 className="header">Мат <br/>генератор</h1>
                    </div>
                    <h1>Профиль пользователя</h1>
                    <p>Имя: {profileData.firstName}</p>
                    <p>Фамилия: {profileData.lastName}</p>
                    <p>Дата рождения: {profileData.birthDate}</p>
                    <p>Логин: {profileData.username}</p>
                    <button onClick={onLogout}>Выйти</button>
                    {/* Кнопка "Выйти" здесь */}
                </div>
            )}
        </div>
    );
}

export default Profile;
