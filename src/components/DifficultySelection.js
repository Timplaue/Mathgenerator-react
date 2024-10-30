import React from 'react';
import './DifficultySelection.css';
import logo from '../assets/logo.svg';


function DifficultySelection({ onSelectDifficulty }) {
    return (
        <div>
            <img src={logo}/>
            <h1>Мат генератор</h1>
            <h2>Новый уровень</h2>
            <button onClick={() => onSelectDifficulty('Легкий')}>Легкий</button>
            <button onClick={() => onSelectDifficulty('Средний')}>Средний</button>
            <button onClick={() => onSelectDifficulty('Сложный')}>Сложный</button>
        </div>
    );
}

export default DifficultySelection;
