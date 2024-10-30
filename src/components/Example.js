import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div>
            {timeLeft > 0 && questionCount < 10 ? (
                <div>
                    <h2>Пример: {example}</h2>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Введите ответ"
                    />
                    <button onClick={handleSubmit}>Ответить</button>
                    <p>Вопрос {questionCount + 1} из 10</p>
                    <p>Оставшееся время: {timeLeft} сек.</p>
                    <div style={{ background: "#ccc", width: "100%", height: "20px", marginTop: "10px" }}>
                        <div
                            style={{
                                width: `${progress}%`,
                                height: "100%",
                                backgroundColor: "#4caf50"
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Тест завершён!</h2>
                    <p>Количество правильных ответов: {correctCount} из 10</p>
                    <button onClick={onBack}>Вернуться к выбору сложности</button>
                </div>
            )}
        </div>
    );
}

export default Example;
