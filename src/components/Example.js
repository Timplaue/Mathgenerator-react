import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Example.css";
import logo from '../assets/logo.svg';

// Импорт всех возможных SVG-файлов
import goodResultEasy from '../assets/result/good-result-easy.svg';
import normalResultEasy from '../assets/result/normal-result-easy.svg';
import badResultEasy from '../assets/result/bad-result-easy.svg';
import goodResultNormal from '../assets/result/good-result-normal.svg';
import normalResultNormal from '../assets/result/normal-result-normal.svg';
import badResultNormal from '../assets/result/bad-result-normal.svg';
import goodResultHard from '../assets/result/good-result-hard.svg';
import normalResultHard from '../assets/result/normal-result-hard.svg';
import badResultHard from '../assets/result/bad-result-hard.svg';

function Example({ difficulty, onBack }) {
    const [example, setExample] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [progress, setProgress] = useState(0);

    const colors = {
        easy: "#61C199",
        normal: "#E9CB30",
        hard: "#ED9069"
    };

    // Объект с изображениями
    const resultImages = {
        easy: {
            good: goodResultEasy,
            normal: normalResultEasy,
            bad: badResultEasy
        },
        normal: {
            good: goodResultNormal,
            normal: normalResultNormal,
            bad: badResultNormal
        },
        hard: {
            good: goodResultHard,
            normal: normalResultHard,
            bad: badResultHard
        }
    };

    useEffect(() => {
        fetchExample();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime > 0 ? prevTime - 1 : 0);
            if (timeLeft <= 0) clearInterval(timer);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        setProgress((questionCount / 10) * 100);
    }, [questionCount]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const fetchExample = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/math/generate?difficulty=${difficulty}`);
            setExample(response.data.example);
        } catch (error) {
            console.error("Error fetching example:", error);
        }
    };

    const handleSubmit = () => {
        const correctAnswer = eval(example);
        if (parseInt(userAnswer) === correctAnswer) {
            setCorrectCount(correctCount + 1);
        }
        setQuestionCount(questionCount + 1);
        setUserAnswer('');

        if (questionCount + 1 < 10) {
            fetchExample();
        }
    };

    const getResultMessage = () => {
        if (correctCount === 10 || correctCount === 9) return "Все правильно, молодец!";
        if (correctCount >= 5) return "Так держать!";
        return "Могло быть и лучше.";
    };

    const getResultImage = () => {
        const resultType = correctCount === 10 || correctCount === 9 ? 'good' :
            correctCount >= 5 ? 'normal' : 'bad';
        return resultImages[difficulty.toLowerCase()][resultType];
    };

    return (
        <div className="example-container">
            {timeLeft > 0 && questionCount < 10 ? (
                <div className="example-block">
                    <img src={logo} alt="logo" className="example-logo" />
                    <div className="header">
                        <h2 style={{ color: colors[difficulty] }}>
                            <span style={{ color: 'black' }}>Уровень</span> {difficulty}
                        </h2>
                        <p className="timer">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="progress-bar-background">
                        <div className="progress-bar" style={{ width: `${progress}%`, backgroundColor: colors[difficulty] }} />
                    </div>
                    <h2 className="question-prompt">Найдите значение выражения</h2>
                    <h2 className="example">{example}</h2>
                    <label className="answer-label">Ответ:</label>
                    <input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="answer-input"
                        placeholder="Введите ответ"
                    />
                    <button
                        onClick={handleSubmit}
                        className="submit-button"
                        style={{ backgroundColor: colors[difficulty], color: "#fff" }}
                    >
                        Проверить
                    </button>
                </div>
            ) : (
                <div className="result-block">
                    <img src={logo} alt="logo" className="example-logo"/>
                    <h2>{getResultMessage()}</h2>
                    <img src={getResultImage()} alt="result" className="result-image"/>
                    <p>Количество правильных ответов: {correctCount} из 10</p>
                    <button style={{backgroundColor: colors[difficulty], color: "#fff"}} onClick={onBack} className="back-button">Вернуться к выбору сложности</button>
                </div>
            )}
        </div>
    );
}

export default Example;
