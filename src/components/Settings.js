import React, { useEffect } from 'react';
import "./Settings.css";

function Settings({ onSaveSettings, onBack, initialTime, onTimeChange }) {
    const [count, setCount] = React.useState(2);
    const [selectedOperations, setSelectedOperations] = React.useState({
        '+': true,
        '-': true,
        '*': true,
        '/': true,
        '^': false,
        '√': false
    });
    const [useBrackets, setUseBrackets] = React.useState(true);
    const [timeLimit, setTimeLimit] = React.useState(initialTime || 120);
    const [range, setRange] = React.useState({ min: 1, max: 99 });

    // Загрузка настроек из localStorage при первом рендере
    useEffect(() => {
        const savedSettings = localStorage.getItem('mathSettings');
        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);

            // Загружаем сохраненные настройки
            setCount(parsedSettings.count || 2);

            // Обновляем выбранные операции
            if (parsedSettings.operations) {
                const opState = {
                    '+': false,
                    '-': false,
                    '*': false,
                    '/': false,
                    '^': false,
                    '√': false
                };
                parsedSettings.operations.forEach(op => {
                    opState[op] = true;
                });
                setSelectedOperations(opState);
            }

            setUseBrackets(parsedSettings.useBrackets || false);
            setTimeLimit(parsedSettings.timeLimit || initialTime || 120);
            setRange(parsedSettings.range || { min: 1, max: 99 });
        }
    }, [initialTime]);

    const handleOperationChange = (operation) => {
        setSelectedOperations((prev) => ({
            ...prev,
            [operation]: !prev[operation]
        }));
    };

    const handleSave = () => {
        const operations = Object.keys(selectedOperations).filter((op) => selectedOperations[op]);

        // Проверяем, что выбрана хотя бы одна операция
        if (operations.length === 0) {
            alert('Пожалуйста, выберите хотя бы одну операцию');
            return;
        }

        const settings = {
            count,
            operations,
            useBrackets,
            timeLimit,
            range,
        };

        // Сохраняем настройки в localStorage
        localStorage.setItem('mathSettings', JSON.stringify(settings));

        onSaveSettings(settings);
        onTimeChange(timeLimit);
    };

    const handleCountChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 2) setCount(value);
    };

    const handleTimeChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 10) setTimeLimit(value);
    };

    const handleRangeChange = (e) => {
        const { name, value } = e.target;
        setRange((prev) => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };

    return (
        <div className="settings-block">
            <div className="left">
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
                        {['+', '-', '*', '/', '^', '√'].map((operation) => (
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
                        Включить скобки:
                        <input
                            type="checkbox"
                            checked={useBrackets}
                            onChange={() => setUseBrackets(!useBrackets)}
                        />
                    </label>
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

                <div className="setting-item">
                    <h3>Диапазон чисел:</h3>
                    <label>
                        Мин:
                        <input
                            type="number"
                            name="min"
                            value={range.min}
                            onChange={handleRangeChange}
                        />
                    </label>
                    <label>
                        Макс:
                        <input
                            type="number"
                            name="max"
                            value={range.max}
                            onChange={handleRangeChange}
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