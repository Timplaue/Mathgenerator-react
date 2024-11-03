import React, { useState } from 'react';

function Settings({ onSaveSettings, onBack }) {
    const [count, setCount] = useState(2);
    const [selectedOperations, setSelectedOperations] = useState({
        '+': true,
        '-': true,
        '*': true,
        '/': true
    });

    const handleOperationChange = (operation) => {
        setSelectedOperations((prev) => ({
            ...prev,
            [operation]: !prev[operation]
        }));
    };

    const handleSave = () => {
        const operations = Object.keys(selectedOperations).filter((op) => selectedOperations[op]);
        onSaveSettings({ count, operations });
    };

    const handleCountChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 2) setCount(value);
    };

    return (
        <div>
            <h2>Настройки примеров</h2>
            <label>
                Количество чисел:
                <input
                    type="number"
                    min="2"
                    value={count}
                    onChange={handleCountChange}
                />
            </label>

            <div>
                <h3>Выберите операции:</h3>
                {['+', '-', '*', '/'].map((operation) => (
                    <label key={operation}>
                        <input
                            type="checkbox"
                            checked={selectedOperations[operation]}
                            onChange={() => handleOperationChange(operation)}
                        />
                        {operation}
                    </label>
                ))}
            </div>

            <button onClick={handleSave}>Сохранить</button>
        </div>
    );
}

export default Settings;
