import React, { useState } from 'react';
import axios from 'axios';

function Example({ difficulty }) {
    const [example, setExample] = useState('');
    const [answer, setAnswer] = useState('');
    const [input, setInput] = useState('');

    const fetchExample = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/generate?difficulty=${difficulty}`);
            setExample(response.data.example);
            setAnswer(response.data.answer);
            setInput(''); // Сбрасываем поле ввода
        } catch (error) {
            console.error("Error fetching example:", error);
        }
    };

    const checkAnswer = () => {
        if (parseInt(input) === answer) {
            alert("Correct!");
            fetchExample(); // Генерируем новый пример после правильного ответа
        } else {
            alert("Try again!");
        }
    };

    return (
        <div>
            <h2>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h2>
            <button onClick={fetchExample}>Generate Example</button>
            <div>{example}</div>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={checkAnswer}>Submit</button>
        </div>
    );
}

export default Example;
