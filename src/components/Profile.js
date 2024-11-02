import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    const fetchProfile = async () => {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage
        console.log('Текущий токен:', token); // Лог текущего токена

        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`, // Используем токен для авторизации
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
        <div>
            {error && <p>{error}</p>}
            {profileData && (
                <div>
                    <h1>Профиль пользователя</h1>
                    <p>Имя: {profileData.firstName}</p>
                    <p>Фамилия: {profileData.lastName}</p>
                    <p>Дата рождения: {profileData.birthDate}</p>
                    <p>Логин: {profileData.username}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;
