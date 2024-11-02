import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./UserProfile.css";

function UserProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Требуется авторизация");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` } // Передаем токен в заголовках
                });
                setUserData(response.data);
            } catch (err) {
                setError("Ошибка при получении данных профиля");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="user-profile">
            <h1>Профиль пользователя</h1>
            {userData && (
                <div>
                    <h2>Имя: {userData.firstName}</h2>
                    <h2>Фамилия: {userData.lastName}</h2>
                    <h2>Дата рождения: {userData.birthDate}</h2>
                    <h2>Логин: {userData.username}</h2>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
