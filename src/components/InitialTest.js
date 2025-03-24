import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import "./Example.css"; // Используем те же стили что и в Example
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

    // Запрашиваем данные пользователя с сервера, включая дату рождения
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const userData = response.data;
            setBirthDate(userData.birthDate);  // Дата рождения пользователя из базы данных
        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
        }
    };

    // Получаем данные пользователя при монтировании компонента
    useEffect(() => {
        fetchUserData();
    }, []);

    // Определение возрастной группы и настроек для примеров
    useEffect(() => {
        if (birthDate) {
            const today = new Date();
            const birthDateObj = new Date(birthDate);
            let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();

            // Корректировка возраста, если день рождения в этом году еще не наступил
            const m = today.getMonth() - birthDateObj.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                calculatedAge--;
            }

            setAge(calculatedAge);
            generateExamplesForAge(calculatedAge);
        } else {
            // Если дата рождения не предоставлена, используем значение по умолчанию
            setAge(25); // Взрослый возраст по умолчанию
            generateExamplesForAge(25);
        }
    }, [birthDate]);
// Генерация примеров в зависимости от возраста
    const generateExamplesForAge = async (age) => {
        console.log(`Начинаем генерацию примеров для возраста: ${age}`);
        setLoading(true);
        try {
            // Настройки для разных возрастных групп
            let testExamples = [];
            let settingsUsed = {};

            if (age < 7) {
                // Для дошкольников (до 7 лет)
                console.log("Генерируем примеры для дошкольника (< 7 лет)");
                settingsUsed = {
                    count: 2,
                    operations: ['+', '-'],
                    range: { min: 1, max: 10 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else if (age < 10) {
                // Для младших школьников (7-9 лет)
                console.log("Генерируем примеры для младшего школьника (7-9 лет)");
                settingsUsed = {
                    count: 2,
                    operations: ['+', '-', '*'],
                    range: { min: 1, max: 20 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else if (age < 13) {
                // Для учеников 4-6 классов (10-12 лет)
                console.log("Генерируем примеры для ученика 4-6 классов (10-12 лет)");
                settingsUsed = {
                    count: 3,
                    operations: ['+', '-', '*', '/'],
                    range: { min: 1, max: 50 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else if (age < 16) {
                // Для учеников 7-9 классов (13-15 лет)
                console.log("Генерируем примеры для ученика 7-9 классов (13-15 лет)");
                settingsUsed = {
                    count: 3,
                    operations: ['+', '-', '*', '/', '^'],
                    range: { min: 1, max: 100 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            } else {
                // Для старшеклассников и взрослых (16+)
                console.log("Генерируем примеры для старшеклассника или взрослого (16+)");
                settingsUsed = {
                    count: 4,
                    operations: ['+', '-', '*', '/', '^', '√'],
                    range: { min: 1, max: 100 },
                    totalExamples: 5
                };
                testExamples = await generateExamplesBatch(settingsUsed);
            }

            console.log("Используемые настройки:", settingsUsed);
            console.log("Сгенерированные примеры:", testExamples);

            setExamples(testExamples);
            // Инициализируем массив ответов пустыми строками
            setUserAnswers(new Array(testExamples.length).fill(''));
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при генерации примеров:", error);
            setErrorMessage('Не удалось загрузить примеры для тестирования');
            setLoading(false);

            // В случае ошибки все равно завершаем тест со стандартными настройками
            setTimeout(() => {
                const defaultSettings = getSettingsForAge(age || 25, 'normal');
                console.log("Завершаем тест с настройками по умолчанию из-за ошибки:", defaultSettings);
                onComplete({
                    correctAnswers: 0,
                    totalQuestions: 5,
                    recommendedLevel: 'normal',
                    recommendedSettings: defaultSettings
                });
            }, 2000);
        }
    };

    // Генерация пакета примеров для тестирования
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

                console.log(`Запрос примера ${i+1}/${totalExamples} с параметрами:`, queryParams.toString());

                const response = await axios.get(`http://localhost:5000/api/math/generate?${queryParams}`);
                console.log(`Получен ответ для примера ${i+1}:`, response.data);
                generatedExamples.push(response.data);
            } catch (error) {
                console.error(`Ошибка при получении примера ${i+1}:`, error);
                throw error;
            }
        }

        return generatedExamples;
    };

    // Обработка ответа пользователя
    const handleAnswerChange = (e) => {
        setCurrentAnswer(e.target.value);
        setErrorMessage('');
    };

    // Переход к следующему примеру
    const handleNext = () => {
        if (currentAnswer.trim() === '') {
            setErrorMessage('Пожалуйста, введите ответ');
            return;
        }

        // Сохраняем текущий ответ
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentStep] = currentAnswer;
        setUserAnswers(updatedAnswers);
        console.log(`Сохранен ответ на шаге ${currentStep + 1}:`, currentAnswer);

        if (currentStep < examples.length - 1) {
            // Переходим к следующему примеру
            setCurrentStep(currentStep + 1);
            setCurrentAnswer('');
            console.log(`Переход к шагу ${currentStep + 2}`);
        } else {
            // Завершаем тестирование
            console.log("Завершаем тестирование, все примеры решены");
            finishTest(updatedAnswers);
        }
    };

    // Расчет результатов тестирования и определение уровня
    const finishTest = (finalAnswers) => {
        let correctCount = 0;

        examples.forEach((example, index) => {
            const userAnswer = parseFloat(finalAnswers[index]);
            const correctAnswer = example.answer;
            const isCorrect = userAnswer === correctAnswer;

            console.log(`Проверка ответа ${index + 1}: Пользователь ввел ${userAnswer}, правильный ответ ${correctAnswer}, результат: ${isCorrect ? 'верно' : 'неверно'}`);

            if (isCorrect) {
                correctCount++;
            }
        });

        console.log(`Итоговый результат: ${correctCount} правильных ответов из ${examples.length}`);

        // Определяем уровень сложности на основе результатов
        const successRate = correctCount / examples.length;
        console.log(`Процент успешности: ${successRate * 100}%`);

        let difficulty;
        let recommendedSettings = {};

        if (successRate >= 0.8) {
            // 80% и выше - высокий уровень
            difficulty = 'hard';
            console.log("Определен высокий уровень сложности (hard)");
        } else if (successRate >= 0.5) {
            // 50-80% - средний уровень
            difficulty = 'normal';
            console.log("Определен средний уровень сложности (normal)");
        } else {
            // Менее 50% - низкий уровень
            difficulty = 'easy';
            console.log("Определен низкий уровень сложности (easy)");
        }

        recommendedSettings = getSettingsForAge(age, difficulty);
        console.log(`Рекомендуемые настройки для возраста ${age} и уровня ${difficulty}:`, recommendedSettings);

        // Сохраняем настройки в localStorage
        localStorage.setItem('mathSettings', JSON.stringify(recommendedSettings));
        localStorage.setItem('userLevel', difficulty);

        // Сохраняем статистику на сервере
        updateStatistics({
            initialTestScore: correctCount,
            initialTestTotal: examples.length
        });

        // Вызываем колбэк с результатами
        console.log("Вызываем onComplete с результатами тестирования");
        onComplete({
            correctAnswers: correctCount,
            totalQuestions: examples.length,
            recommendedLevel: difficulty,
            recommendedSettings
        });
    };

    // Функция для отправки статистики на сервер
    const updateStatistics = async (data) => {
        try {
            console.log("Отправляем статистику на сервер:", data);
            await axios.post('http://localhost:5000/api/auth/update-statistics', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log("Статистика успешно обновлена");
        } catch (error) {
            console.error("Ошибка при обновлении статистики:", error);
        }
    };

    // Получение настроек в зависимости от возраста и определенного уровня
    const getSettingsForAge = (age, level) => {
        console.log(`Получение настроек для возраста ${age} и уровня ${level}`);

        let settings = {
            useBrackets: false,
            timeLimit: 120
        };

        if (age < 7) {
            // Дошкольники
            console.log("Категория: дошкольники (< 7 лет)");
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
            // Младшие школьники
            console.log("Категория: младшие школьники (7-9 лет)");
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
            // 4-6 классы
            console.log("Категория: ученики 4-6 классов (10-12 лет)");
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
            // 7+ классы и взрослые
            console.log("Категория: старшие классы и взрослые (13+ лет)");
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

        console.log("Итоговые настройки:", settings);
        return settings;
    };

    // Рендеринг LaTeX
    const renderLatex = (latex) => {
        try {
            return katex.renderToString(latex, {
                throwOnError: false,
            });
        } catch (error) {
            console.error("Ошибка при рендеринге LaTeX:", error);
            return `<span style="color: red;">Ошибка LaTeX формулы</span>`;
        }
    };

    if (loading) {
        return <div className="loading">Загрузка тестовых примеров...</div>;
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
                    Решите следующие примеры, чтобы мы могли определить ваш уровень знаний.
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