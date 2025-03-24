import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Подключаем стили для KaTeX
import "./Example.css";
import logo from '../assets/logo.svg';
import goodResultEasy from '../assets/result/good-result-easy.svg';
import normalResultEasy from '../assets/result/normal-result-easy.svg';
import badResultEasy from '../assets/result/bad-result-easy.svg';
import goodResultNormal from '../assets/result/good-result-normal.svg';
import normalResultNormal from '../assets/result/normal-result-normal.svg';
import badResultNormal from '../assets/result/bad-result-normal.svg';
import goodResultHard from '../assets/result/good-result-hard.svg';
import normalResultHard from '../assets/result/normal-result-hard.svg';
import badResultHard from '../assets/result/bad-result-hard.svg';

function Example({ difficulty, onBack, settings }) {
    // Загрузка настроек из localStorage если они не были переданы
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        // Если настройки не были переданы, пытаемся загрузить их из localStorage
        if (!settings || Object.keys(settings).length === 0) {
            const savedSettings = localStorage.getItem('mathSettings');
            if (savedSettings) {
                setLocalSettings(JSON.parse(savedSettings));
            } else {
                // Устанавливаем дефолтные настройки, если ничего не найдено
                setLocalSettings({
                    timeLimit: 120,
                    range: { min: 1, max: 10 },
                    count: 2,
                    operations: ['+', '-', '*', '/'],
                    useBrackets: true
                });
            }
        } else {
            setLocalSettings(settings);
        }
    }, [settings]);

    const [example, setExample] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [correctCount, setCorrectCount] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(localSettings?.timeLimit || 120);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [startTime] = useState(Date.now());

    const colors = { easy: "#61C199", normal: "#E9CB30", hard: "#ED9069" };
    const resultImages = {
        easy: { good: goodResultEasy, normal: normalResultEasy, bad: badResultEasy },
        normal: { good: goodResultNormal, normal: normalResultNormal, bad: badResultNormal },
        hard: { good: goodResultHard, normal: normalResultHard, bad: badResultHard },
    };

    const formatTime = (seconds) =>
        `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

    // Функция для получения примеров
    const fetchExample = useCallback(async () => {
        if (!localSettings) return; // Выходим, если настройки еще не загружены

        try {
            let response;
            if (difficulty === 'normal') {
                response = await axios.get('http://localhost:5000/api/math/generate-quadratic');
            } else if (difficulty === 'easy') {
                const { range = { min: 1, max: 10 }, count = 2, operations = ['+', '-', '*', '/'] } = localSettings;
                const queryParams = new URLSearchParams({
                    min: range.min,
                    max: range.max,
                    count,
                    operations: operations.join(','),
                });
                response = await axios.get(`http://localhost:5000/api/math/generate?${queryParams}`);
            } else {
                const queryParams = new URLSearchParams({
                    operations: localSettings.operations ? localSettings.operations.join(',') : '+,-,*,/'
                });
                response = await axios.get(`http://localhost:5000/api/math/generate-log?${queryParams}`);
            }

            setExample(response.data.example);
            setCorrectAnswer(response.data.answer);
        } catch (error) {
            console.error("Ошибка при получении примера:", error);
            setErrorMessage('Не удалось загрузить пример. Попробуйте снова.');
        }
    }, [difficulty, localSettings]);

    // Функция для отправки статистики на сервер
    const updateStatistics = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/auth/update-statistics', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error("Ошибка при обновлении статистики:", error);
        }
    };

    // Проверка ответа
    const handleSubmit = async () => {
        if (userAnswer.trim() === '') {
            setErrorMessage('Пожалуйста, введите ответ.');
            return;
        }

        const userAnswerFloat = parseFloat(userAnswer); // Поддержка дробных ответов

        if (userAnswerFloat === correctAnswer) {
            setCorrectCount((prev) => prev + 1);
            await updateStatistics({ examplesSolved: 1 });
        }

        setQuestionCount((prev) => prev + 1);
        setUserAnswer('');

        if (questionCount + 1 < 10) {
            fetchExample();
        } else {
            await handleEndOfLevel(correctCount + (userAnswerFloat === correctAnswer ? 1 : 0));
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            setElapsedTime(totalTime);
        }
    };

    // Завершение уровня
    const handleEndOfLevel = async (finalCorrectCount) => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const stats = { levelsCompleted: 1 };

        if (finalCorrectCount === 10) {
            stats.perfectScores = 1;
            stats.levelTime = elapsedTime;
        }

        await updateStatistics(stats);
    };

    // Формирование результата
    const getResultMessage = () => {
        if (correctCount === 10) return "Все правильно, молодец!";
        if (correctCount >= 8) return "Почти правильно, молодец!";
        return correctCount >= 5 ? "Так держать!" : "Могло быть и лучше.";
    };

    const getResultImage = () =>
        resultImages[difficulty][correctCount >= 9 ? 'good' : correctCount >= 5 ? 'normal' : 'bad'];

    // Эффекты
    useEffect(() => {
        if (localSettings) {
            setTimeLeft(localSettings.timeLimit || 120);
            fetchExample();
        }
    }, [localSettings, fetchExample]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
        setProgress((questionCount / 10) * 100);
    }, [questionCount]);

    const renderLatex = (latex) => {
        try {
            return katex.renderToString(latex, {
                throwOnError: false,
            });
        } catch (error) {
            return `<span style="color: red;">Ошибка LaTeX формулы</span>`;
        }
    };

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
                            <div
                                className="progress-bar"
                                style={{ width: `${progress}%`, backgroundColor: colors[difficulty] }}
                            />
                        </div>
                        <h2 className="question-prompt">
                            {difficulty === 'normal' ? 'Найдите наибольший корень уравнения' : 'Найдите значение выражения'}
                        </h2>
                        <div
                            className="example"
                            dangerouslySetInnerHTML={{
                                __html: renderLatex(example),
                            }}
                        />
                        <label className="answer-label">Ответ:</label>
                        <input
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="answer-input"
                            type="number"
                            placeholder="Введите ответ"
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button
                            onClick={handleSubmit}
                            className="submit-button"
                            style={{ backgroundColor: colors[difficulty], color: "#fff" }}
                        >
                            Проверить
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result-block">
                    <img src={logo} alt="logo" className="example-logo" />
                    <h2>{getResultMessage()}</h2>
                    <img src={getResultImage()} alt="result" className="result-image" />
                    <p className="Finished" style={{color: colors[difficulty]}}>{correctCount}<span style={{color: "#000",}}>/</span>10</p>
                    <p className="Finish">Уровень: <span style={{color: colors[difficulty]}}><strong>{difficulty}</strong></span></p>
                    <p className="Finish">Выполнен за: <span style={{color: colors[difficulty]}}><strong>{formatTime(elapsedTime)}</strong></span></p>
                    <button
                        onClick={onBack}
                        className="back-button"
                        style={{backgroundColor: colors[difficulty], color: "#FFF"}}
                    >
                        Завершить
                    </button>
                </div>
            )}
        </div>
    );
}

export default Example;