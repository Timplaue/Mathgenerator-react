import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Example.css";
import logo from '../assets/logo.svg';

function Example({ difficulty, onBack }) {
    const [example, setExample] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 минуты в секундах
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        fetchExample();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timer);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setProgress((questionCount / 10) * 100); // обновление прогрессбара
    }, [questionCount]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const fetchExample = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/generate?difficulty=${difficulty}`);
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

        if (questionCount + 1 >= 10) {
            return; // Конец вопросов, прогресс полный
        } else {
            fetchExample();
        }
    };

    return (
        <div className="example-container">
            {timeLeft > 0 && questionCount < 10 ? (
                <div className="example-block">
                    <img src={logo} alt="logo" className="example-logo"/>
                    <div className="header">
                        <h2>Уровень: <span className="difficulty-level">{difficulty}</span></h2>
                        <p className="timer">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="progress-bar-background">
                        <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <h2 className="question-prompt">Найдите значение выражения</h2>
                    <h2 className="example">{example}</h2>
                    <label className="answer-label">Ответ:</label>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="answer-input"
                        placeholder="Введите ответ"
                    />
                    <button onClick={handleSubmit} className="submit-button">Проверить</button>
                </div>
            ) : (
                <div className="result-block">
                    <h2>Тест завершён!</h2>
                    <p>Количество правильных ответов: {correctCount} из 10</p>
                    <button onClick={onBack} className="back-button">Вернуться к выбору сложности</button>
                </div>
            )}
        </div>
    );
}

export default Example;
