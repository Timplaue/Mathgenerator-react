import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Example.css";
import logo from '../assets/logo.svg';
import goodResultEasy from '../assets/result/good-result-easy.svg';
import normalResultEasy from '../assets/result/normal-result-easy.svg';
import badResultEasy from '../assets/result/bad-result-easy.svg';

function Example({ difficulty, onBack, settings }) {
    const [example, setExample] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(settings.timeLimit || 120);
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [startTime] = useState(Date.now());

    const colors = { easy: "#61C199", normal: "#E9CB30", hard: "#ED9069" };
    const resultImages = {
        easy: { good: goodResultEasy, normal: normalResultEasy, bad: badResultEasy }
    };

    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

    const fetchExample = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/math/generate`, {
                params: {
                    difficulty,
                    count: settings.count,
                    operations: settings.operations.join(','),
                },
            });
            if (response.data?.example) {
                setExample(response.data.example);
            }
        } catch (error) {
            console.error("Ошибка при получении примера:", error);
        }
    };

    const updateStatistics = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/auth/update-statistics', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error("Ошибка при обновлении статистики:", error);
        }
    };

    const handleSubmit = async () => {
        if (userAnswer.trim() === '') {
            setErrorMessage('Пожалуйста, введите ответ.');
            return;
        }

        const correctAnswer = eval(example);
        const userAnswerInt = parseInt(userAnswer);

        if (userAnswerInt === correctAnswer) {
            setCorrectCount((prev) => prev + 1);
            await updateStatistics({ examplesSolved: 1 });
        }

        setQuestionCount((prev) => prev + 1);
        setUserAnswer('');
        setErrorMessage('');

        if (questionCount + 1 < 10) {
            fetchExample();
        } else {
            await handleEndOfLevel(correctCount + (userAnswerInt === correctAnswer ? 1 : 0));
        }
    };

    const handleEndOfLevel = async (finalCorrectCount) => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const stats = { levelsCompleted: 1 };

        if (finalCorrectCount === 10) {
            stats.perfectScores = 1;
            stats.levelTime = elapsedTime;
        }

        try {
            await updateStatistics(stats);
        } catch (error) {
            console.error("Ошибка при обновлении статистики:", error);
        }
    };

    const getResultMessage = () => {
        if (correctCount === 10) return "Все правильно, молодец!";
        if (correctCount >= 8) return "Почти правильно, молодец!";
        return correctCount >= 5 ? "Так держать!" : "Могло быть и лучше.";
    };

    const getResultImage = () => resultImages[difficulty][correctCount >= 9 ? 'good' : correctCount >= 5 ? 'normal' : 'bad'];

    useEffect(() => {
        setTimeLeft(settings.timeLimit || 120);
        fetchExample();
    }, [difficulty, settings]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        setProgress((questionCount / 10) * 100);
    }, [questionCount]);

    return (
        <div>
            {timeLeft > 0 && questionCount < 10 ? (
                <div className="block">
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
                        <h2 className="example">{example} = ?</h2>
                        <label className="answer-label">Ответ:</label>
                        <input
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="answer-input"
                            placeholder="Введите ответ"
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button onClick={handleSubmit} className="submit-button" style={{ backgroundColor: colors[difficulty], color: "#fff" }}>
                            Проверить
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result-block">
                    <img src={logo} alt="logo" className="example-logo" />
                    <h2>{getResultMessage()}</h2>
                    <img src={getResultImage()} alt="result" className="result-image" />
                    <p>Количество правильных ответов: {correctCount} из 10</p>
                    <button onClick={onBack} className="back-button" style={{ backgroundColor: colors[difficulty], color: "#fff" }}>
                        Вернуться к выбору сложности
                    </button>
                </div>
            )}
        </div>
    );
}

export default Example;
