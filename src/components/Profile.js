import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AvatarUpload from './AvatarUpload';

function Profile({ onLogout }) {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const [avatar, setAvatar] = useState('');

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfileData(response.data);
            setAvatar(response.data.avatarUrl || localStorage.getItem('avatarUrl'));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Токен истек, выходим из профиля
                onLogout();
            } else {
                console.error("Ошибка при получении профиля:", error);
                setError("Ошибка при получении профиля");
            }
        }
    };


    const handleAvatarUpload = (newAvatarUrl) => {
        setAvatar(newAvatarUrl);
        localStorage.setItem('avatarUrl', newAvatarUrl); // Сохраните в localStorage
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
                    <img src={avatar} alt="Аватар" style={{ width: '100px', height: '100px' }} />
                    <p>Имя: {profileData.firstName}</p>
                    <p>Фамилия: {profileData.lastName}</p>
                    <p>Дата рождения: {profileData.birthDate}</p>
                    <p>Логин: {profileData.username}</p>
                    <p>Решено примеров: {profileData.statistics?.examplesSolved || 0}</p>
                    <p>Пройдено уровней: {profileData.statistics?.levelsCompleted || 0}</p>
                    <p>Уровней с 10 из 10: {profileData.statistics?.perfectScores || 0}</p>
                    <AvatarUpload onAvatarUpload={handleAvatarUpload} />
                    <button onClick={onLogout}>Выйти</button>
                </div>
            )}
        </div>
    );
}

export default Profile;
