import React from 'react';
import "./Settings.css"

function Settings({ onSaveSettings, onBack, initialTime, onTimeChange }) {
    const [count, setCount] = React.useState(2);
    const [selectedOperations, setSelectedOperations] = React.useState({
        '+': true,
        '-': true,
        '*': true,
        '/': true
    });
    const [timeLimit, setTimeLimit] = React.useState(initialTime || 120); // Устанавливаем начальное время

    const handleOperationChange = (operation) => {
        setSelectedOperations((prev) => ({
            ...prev,
            [operation]: !prev[operation]
        }));
    };

    const handleSave = () => {
        const operations = Object.keys(selectedOperations).filter((op) => selectedOperations[op]);
        onSaveSettings({ count, operations, timeLimit }); // Добавляем время в настройки
        onTimeChange(timeLimit); // Обновляем время в родительском компоненте
    };

    const handleCountChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 2) setCount(value);
    };

    const handleTimeChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 10) setTimeLimit(value); // Устанавливаем минимальное значение времени
    };

    return (
        <div className="settings-block">
            <div className="">
                <h2>Настройки примеров</h2>

                <div className="setting-item">
                    <label>
                        Количество чисел:
                        <input
                            type="number"
                            min="2"
                            value={count}
                            onChange={handleCountChange}
                        />
                    </label>
                </div>

                <div className="setting-item">
                    <h3>Выберите операции:</h3>
                    <div className="operations">
                        {['+', '-', '*', '/'].map((operation) => (
                            <label key={operation} className="operation-label">
                                <input
                                    type="checkbox"
                                    checked={selectedOperations[operation]}
                                    onChange={() => handleOperationChange(operation)}
                                />
                                {operation}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="setting-item">
                    <label>
                        Время на решение (в секундах):
                        <input
                            type="number"
                            min="10"
                            value={timeLimit}
                            onChange={handleTimeChange}
                        />
                    </label>
                </div>

                <div className="button-group">
                    <button onClick={handleSave}>Сохранить</button>
                    <button onClick={onBack}>Назад</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
