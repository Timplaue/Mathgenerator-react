// NavigationBar.js
import React from 'react';
import './NavigationBar.css'; // Создайте этот файл для стилей

const NavigationBar = ({ onProfileClick, onHomeClick }) => {
    return (
        <div className="navigation-bar">
            <button onClick={onHomeClick} className="nav-button">
                <img src="path_to_home_icon.svg" alt="Home" /> {/* Замените на ваш путь к иконке */}
                Дом
            </button>
            <button onClick={onProfileClick} className="nav-button">
                <img src="path_to_profile_icon.svg" alt="Profile" /> {/* Замените на ваш путь к иконке */}
                Профиль
            </button>
        </div>
    );
};

export default NavigationBar;
