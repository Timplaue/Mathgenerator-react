import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AvatarUpload from './AvatarUpload';
import './Profile.css';
import logo from "../assets/logo.svg";

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
        <div className="block3">
            {error && <p>{error}</p>}
            {profileData && (
                <div className="profile">
                    <div className="difficulty-header">
                        <img src={logo} className="difficulty-logo" alt="logo"/>
                        <h1 className="difficulty-header">Мат <br/>генератор</h1>
                    </div>
                    <h3>• Мой аккаунт</h3>
                    <div className="profile-container">
                        <img src={avatar} alt="Аватар" className="avatar"/>
                        <div className="profile-info">
                            <h2>{profileData.firstName}</h2>
                            <h2>{profileData.lastName}</h2>
                            <p>Создан: {new Date(profileData.registrationDate).toLocaleDateString()}</p>
                            <AvatarUpload onAvatarUpload={handleAvatarUpload}/>
                        </div>
                    </div>
                    <h5>Логин: {profileData.username}</h5>
                    <h5>Дата рождения: {profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('ru-RU'):"Не указана"}</h5>
                    <h3>• Статистика</h3>
                    <div className="grid">
                        <div className="statistic">
                            <h4>{profileData.statistics?.examplesSolved || 0}<span
                                style={{color: "#434343", fontSize: "0.8em"}}> примеров решено</span></h4>
                        </div>
                        <div className="statistic">
                            <h4>{profileData.statistics?.levelsCompleted || 0}<span style={{color: "#434343", fontSize: "0.8em"}}> уровней пройдено</span></h4>
                        </div>
                        <div className="statistic">
                            <h4>{profileData.statistics?.perfectScores || 0}<span
                                style={{color: "#434343", fontSize: "0.8em"}}> уровней на 10/10</span></h4>
                        </div>
                        <div className="statistic">
                            <h4>{profileData.statistics?.perfectScores || 0}<span
                                style={{color: "#434343", fontSize: "0.8em"}}> уровней на 10/10</span></h4>
                        </div>
                    </div>
                    <button className="logout" onClick={onLogout}>Выйти</button>
                </div>
            )}
        </div>
    );
}

export default Profile;
