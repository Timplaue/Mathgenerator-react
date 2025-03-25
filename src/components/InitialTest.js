import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import "./Example.css";
import logo from '../assets/logo.svg';

function InitialTest({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [examples, setExamples] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [age, setAge] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [welcomePhase, setWelcomePhase] = useState(1);

    const examplesGenerated = useRef(false);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const userData = response.data;
            setBirthDate(userData.birthDate);
        } catch (error) {}
    };

    useEffect(() => {
        fetchUserData();

        // Анимация приветствия - переход между фазами
        const timer = setTimeout(() => {
            if (welcomePhase < 3) {
                setWelcomePhase(welcomePhase + 1);
            } else if (!examplesGenerated.current) {
                // После показа всех приветствий, начинаем загрузку примеров
                examplesGenerated.current = true;

                if (birthDate) {
                    const today = new Date();
                    const birthDateObj = new Date(birthDate);
                    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();

                    const m = today.getMonth() - birthDateObj.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                        calculatedAge--;
                    }

                    setAge(calculatedAge);
                    generateExamplesForAge(calculatedAge);
                } else {
                    setAge(25);
                    generateExamplesForAge(25);
                }
            }
        }, welcomePhase < 3 ? 2500 : 1500);

        return () => clearTimeout(timer);
    }, [welcomePhase, birthDate]);

    const generateExamplesForAge = async (age) => {
        try {
            let testExamples = [];
            let settingsUsed = {};

            if (age < 7) {
                settingsUsed = {
                    count: 2,
                    operations: ['+', '-'],
                    range: { min: 1, max: 10 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else if (age < 10) {
                settingsUsed = {
                    count: 2,
                    operations: ['+', '-', '*'],
                    range: { min: 1, max: 20 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else if (age < 13) {
                settingsUsed = {
                    count: 3,
                    operations: ['+', '-', '*', '/'],
                    range: { min: 1, max: 50 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else if (age < 16) {
                settingsUsed = {
                    count: 3,
                    operations: ['+', '-', '*', '/', '^'],
                    range: { min: 1, max: 100 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else {
                settingsUsed = {
                    count: 4,
                    operations: ['+', '-', '*', '/', '^', '√'],
                    range: { min: 1, max: 100 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            }

            setExamples(testExamples);
            setUserAnswers(new Array(testExamples.length).fill(''));
            setLoading(false);
        } catch (error) {
            setErrorMessage('Не удалось загрузить примеры для тестирования');
            setLoading(false);

            setTimeout(() => {
                const defaultSettings = getSettingsForAge(age || 25, 'normal');
                onComplete({
                    correctAnswers: 0,
                    totalQuestions: 5,
                    recommendedLevel: 'normal',
                    recommendedSettings: defaultSettings
                });
            }, 2000);
        }
    };

    const generateExamplesBatch = async (settings) => {
        const { count, operations, range, totalExamples } = settings;
        let generatedExamples = [];

        for (let i = 0; i < totalExamples; i++) {
            try {
                const queryParams = new URLSearchParams({
                    min: range.min,
                    max: range.max,
                    count,
                    operations: operations.join(','),
                });

                const response = await axios.get(`http://localhost:5000/api/math/generate?${queryParams}`);
                generatedExamples.push(response.data);
            } catch (error) {
                throw error;
            }
        }

        return generatedExamples;
    };

    // Остальные функции остаются без изменений
    const handleAnswerChange = (e) => {
        setCurrentAnswer(e.target.value);
        setErrorMessage('');
    };

    const handleNext = () => {
        if (currentAnswer.trim() === '') {
            setErrorMessage('Пожалуйста, введите ответ');
            return;
        }

        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentStep] = currentAnswer;
        setUserAnswers(updatedAnswers);

        if (currentStep < examples.length - 1) {
            setCurrentStep(currentStep + 1);
            setCurrentAnswer('');
        } else {
            finishTest(updatedAnswers);
        }
    };

    const finishTest = (finalAnswers) => {
        let correctCount = 0;

        examples.forEach((example, index) => {
            const userAnswer = parseFloat(finalAnswers[index]);
            const correctAnswer = example.answer;
            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        });

        const successRate = correctCount / examples.length;
        let difficulty;
        let recommendedSettings = {};

        if (successRate >= 0.8) {
            difficulty = 'hard';
        } else if (successRate >= 0.5) {
            difficulty = 'normal';
        } else {
            difficulty = 'easy';
        }

        recommendedSettings = getSettingsForAge(age, difficulty);

        localStorage.setItem('mathSettings', JSON.stringify(recommendedSettings));
        localStorage.setItem('userLevel', difficulty);

        updateStatistics({
            initialTestScore: correctCount,
            initialTestTotal: examples.length
        });

        onComplete({
            correctAnswers: correctCount,
            totalQuestions: examples.length,
            recommendedLevel: difficulty,
            recommendedSettings
        });
    };

    const updateStatistics = async (data) => {
        try {
            await axios.post('http://localhost:5000/api/auth/update-statistics', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {}
    };

    const getSettingsForAge = (age, level) => {
        let settings = {
            useBrackets: false,
            timeLimit: 120
        };

        if (age < 7) {
            if (level === 'easy') {
                settings = {
                    ...settings,
                    count: 2,
                    operations: ['+'],
                    range: { min: 1, max: 5 },
                    timeLimit: 180
                };
            } else if (level === 'normal') {
                settings = {
                    ...settings,
                    count: 2,
                    operations: ['+', '-'],
                    range: { min: 1, max: 10 },
                    timeLimit: 150
                };
            } else {
                settings = {
                    ...settings,
                    count: 2,
                    operations: ['+', '-', '*'],
                    range: { min: 1, max: 10 },
                    timeLimit: 120
                };
            }
        } else if (age < 10) {
            if (level === 'easy') {
                settings = {
                    ...settings,
                    count: 2,
                    operations: ['+', '-'],
                    range: { min: 1, max: 20 },
                    timeLimit: 150
                };
            } else if (level === 'normal') {
                settings = {
                    ...settings,
                    count: 2,
                    operations: ['+', '-', '*'],
                    range: { min: 1, max: 50 },
                    timeLimit: 120
                };
            } else {
                settings = {
                    ...settings,
                    count: 3,
                    operations: ['+', '-', '*', '/'],
                    range: { min: 1, max: 50 },
                    useBrackets: true,
                    timeLimit: 100
                };
            }
        } else if (age < 13) {
            if (level === 'easy') {
                settings = {
                    ...settings,
                    count: 2,
                    operations: ['+', '-', '*', '/'],
                    range: { min: 1, max: 50 },
                    timeLimit: 120
                };
            } else if (level === 'normal') {
                settings = {
                    ...settings,
                    count: 3,
                    operations: ['+', '-', '*', '/', '^'],
                    range: { min: 1, max: 100 },
                    useBrackets: true,
                    timeLimit: 100
                };
            } else {
                settings = {
                    ...settings,
                    count: 3,
                    operations: ['+', '-', '*', '/', '^', '√'],
                    range: { min: 1, max: 100 },
                    useBrackets: true,
                    timeLimit: 90
                };
            }
        } else {
            if (level === 'easy') {
                settings = {
                    ...settings,
                    count: 3,
                    operations: ['+', '-', '*', '/'],
                    range: { min: 1, max: 100 },
                    useBrackets: true,
                    timeLimit: 100
                };
            } else if (level === 'normal') {
                settings = {
                    ...settings,
                    count: 3,
                    operations: ['+', '-', '*', '/', '^', '√'],
                    range: { min: 1, max: 100 },
                    useBrackets: true,
                    timeLimit: 90
                };
            } else {
                settings = {
                    ...settings,
                    count: 4,
                    operations: ['+', '-', '*', '/', '^', '√'],
                    range: { min: 5, max: 200 },
                    useBrackets: true,
                    timeLimit: 80
                };
            }
        }

        return settings;
    };

    const renderLatex = (latex) => {
        try {
            return katex.renderToString(latex, {
                throwOnError: false,
            });
        } catch (error) {
            return `<span style="color: red;">Ошибка LaTeX формулы</span>`;
        }
    };

    // Отображение приветствия и инструкций
    if (welcomePhase < 3 || loading) {
        return (
            <div className="welcome-container">
                <div className="welcome-content">
                    <img src={logo} alt="logo" className="welcome-logo animate-pulse" />

                    {welcomePhase === 1 && (
                        <div className="welcome-message fade-in">
                            <h1>Добро пожаловать в Мат-генератор!</h1>
                            <p>Мы поможем вам улучшить навыки в математике</p>
                        </div>
                    )}

                    {welcomePhase === 2 && (
                        <div className="welcome-message fade-in">
                            <h2>Сейчас мы проведем короткое тестирование</h2>
                            <p>Это поможет нам определить ваш уровень и подобрать оптимальные упражнения</p>
                        </div>
                    )}

                    {welcomePhase === 3 && (
                        <div className="welcome-message fade-in">
                            <h2>Подготовка заданий...</h2>
                            <div className="loading-spinner"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const currentExample = examples[currentStep];

    if (!currentExample) {
        return <div className="error-message">Не удалось загрузить примеры для тестирования</div>;
    }

    return (
        <div className="block">
            <div className="example-block">
                <img src={logo} alt="logo" className="example-logo" />
                <h2>Начальное тестирование</h2>
                <p className="test-instructions">
                    Решите следующие примеры чтобы мы могли определить ваш уровень знаний.
                    Пример {currentStep + 1} из {examples.length}.
                </p>

                <div className="progress-bar-background">
                    <div
                        className="progress-bar"
                        style={{ width: `${((currentStep + 1) / examples.length) * 100}%`, backgroundColor: "#61C199" }}
                    />
                </div>

                <h2 className="question-prompt">Найдите значение выражения</h2>
                <div
                    className="example"
                    dangerouslySetInnerHTML={{
                        __html: renderLatex(currentExample.example),
                    }}
                />

                <label className="answer-label">Ответ:</label>
                <input
                    value={currentAnswer}
                    onChange={handleAnswerChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    className="answer-input"
                    type="number"
                    placeholder="Введите ответ"
                />

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <button
                    onClick={handleNext}
                    className="submit-button"
                    style={{ backgroundColor: "#61C199", color: "#fff" }}
                >
                    {currentStep < examples.length - 1 ? 'Следующий' : 'Завершить тестирование'}
                </button>
            </div>
        </div>
    );
}

export default InitialTest;