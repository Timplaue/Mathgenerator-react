import React from 'react';
import './NavMenu.css';

function NavMenu({ onNavigate }) {
    return (
        <div className="nav-menu">
            <button onClick={() => onNavigate('profile')}>Профиль</button>
            <button onClick={() => onNavigate('difficulty')}>Выбор сложности</button>
            <button onClick={() => onNavigate('settings')}>Настройки</button> {/* Добавленная кнопка */}
        </div>
    );
}

export default NavMenu;
