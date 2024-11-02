import React from 'react';
import './DifficultySelection.css';
import logo from '../assets/logo.svg';
import easy from '../assets/easy.svg';
import normal from '../assets/normal.svg';
import hard from '../assets/hard.svg';

function DifficultySelection({ onSelectDifficulty }) {
    return (
        <div className="block3">
            <div className="header">
                <img src={logo} className="difficulty-logo" alt="logo"/>
                <h1 className="header">Мат <br/>генератор</h1>
            </div>
            <h2 className="header">• Новый уровень</h2>
            <div className="buttons">
                <button className="easy" onClick={() => onSelectDifficulty('easy')}>
                    <span className="button-text">Легкий</span>
                    <img src={easy} alt="easy"/>
                </button>
                <button className="normal" onClick={() => onSelectDifficulty('normal')}>
                    <span className="button-text">Средний</span>
                    <img src={normal} alt="normal"/>
                </button>
                <button className="hard" onClick={() => onSelectDifficulty('hard')}>
                    <span className="button-text">Сложный</span>
                    <img src={hard} alt="hard"/>
                </button>
            </div>
        </div>
    );
}

export default DifficultySelection;
