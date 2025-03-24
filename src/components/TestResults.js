import React from 'react';
import logo from '../assets/logo.svg';
import "./Example.css"; // Используем те же стили что и в Example

function TestResults({ results, onContinue }) {
    const { correctAnswers, totalQuestions, recommendedLevel } = results;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Определяем иконку и цвет в зависимости от уровня
    const levelColors = {
        easy: "#61C199",
        normal: "#E9CB30",
        hard: "#ED9069"
    };

    const levelNames = {
        easy: "Начальный",
        normal: "Средний",
        hard: "Продвинутый"
    };

    const getLevelDescription = () => {
        switch(recommendedLevel) {
            case 'easy':
                return "На этом уровне вы будете решать базовые примеры, чтобы укрепить фундаментальные знания. По мере улучшения навыков сложность будет постепенно повышаться.";
            case 'normal':
                return "Этот уровень предлагает задачи средней сложности. Вы имеете хорошую базу, и мы поможем вам развивать ваши навыки дальше.";
            case 'hard':
                return "На этом уровне вы будете решать более сложные задачи. Вы продемонстрировали отличное понимание математики, поэтому мы предложим вам подходящий вызов.";
            default:
                return "Мы подобрали для вас оптимальный уровень сложности заданий.";
        }
    };

    return (
        <div className="result-block">
            <img src={logo} alt="logo" className="example-logo" />
            <h2>Результаты тестирования</h2>

            <div className="result-info">
                <p className="Finished" style={{color: levelColors[recommendedLevel]}}>
                    {correctAnswers}<span style={{color: "#000"}}>/</span>{totalQuestions}
                </p>
                <p className="result-percentage">
                    Вы правильно решили <span style={{color: levelColors[recommendedLevel]}}>{percentage}%</span> заданий
                </p>
            </div>

            <div className="recommended-level" style={{marginTop: "20px", marginBottom: "20px"}}>
                <p className="Finish">
                    Рекомендуемый уровень: <span style={{color: levelColors[recommendedLevel]}}>
                        <strong>{levelNames[recommendedLevel]}</strong>
                    </span>
                </p>
                <p style={{textAlign: "center", maxWidth: "80%", margin: "20px auto"}}>
                    {getLevelDescription()}
                </p>
            </div>

            <button
                onClick={onContinue}
                className="back-button"
                style={{backgroundColor: levelColors[recommendedLevel], color: "#FFF"}}
            >
                Продолжить
            </button>
        </div>
    );
}

export default TestResults;