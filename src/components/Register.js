import React, { useState } from 'react';
import "./Register.css";
import axios from 'axios';

function Register({ onRegister, toggleAuthForm }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        birthDate: {
            day: '',
            month: '',
            year: ''
        },
        username: '',
        password: '',
        general: ''
    });

    // Функция валидации формы
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            firstName: '',
            lastName: '',
            birthDate: {
                day: '',
                month: '',
                year: ''
            },
            username: '',
            password: '',
            general: ''
        };

        if (username.length < 3) {
            newErrors.username = 'Логин должен содержать не менее 3 символов';
            isValid = false;
        }

        if (password.length < 8) {
            newErrors.password = 'Пароль должен содержать не менее 8 символов';
            isValid = false;
        }

        const { day, month, year } = birthDate;

        // Проверка дня
        if (!day) {
            isValid = false;
        } else {
            const dayNum = parseInt(day, 10);
            if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
                newErrors.birthDate.day = 'Недействительная дата';
                isValid = false;
            }
        }

        // Проверка месяца
        if (!month) {
            isValid = false;
        } else {
            const monthNum = parseInt(month, 10);
            if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                newErrors.birthDate.day = 'Недействительная дата';
                isValid = false;
            }
        }

        // Проверка года
        if (!year) {
            isValid = false;
        } else {
            const yearNum = parseInt(year, 10);
            if (isNaN(yearNum) || yearNum < 1925 || yearNum > 2025) {
                newErrors.birthDate.day = 'Недействительная дата';
                isValid = false;
            }
        }

        // Дополнительная проверка валидности даты (например, 30 февраля)
        if (day && month && year) {
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);

            const dateObj = new Date(yearNum, monthNum - 1, dayNum);

            if (dateObj.getDate() !== dayNum) {
                newErrors.birthDate.day = 'Недействительная дата';
                isValid = false;
            }
        }

        if (!isChecked) {
            newErrors.general = "Необходимо согласие на обработку персональных данных";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // Форматирование даты рождения
    const formatBirthDate = () => {
        const { day, month, year } = birthDate;
        // Добавляем ведущие нули при необходимости
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const formattedBirthDate = formatBirthDate();
            console.log("Registering user:", { firstName, lastName, formattedBirthDate, username, password });

            await axios.post('http://localhost:5000/api/auth/register', {
                firstName,
                lastName,
                birthDate: formattedBirthDate,
                username,
                password
            });

            onRegister();
        } catch (error) {
            console.error("Registration error:", error.response || error.message);
            const errorMessage = error.response?.data?.message || "Ошибка при регистрации пользователя";
            setErrors(prev => ({...prev, general: errorMessage}));
        }
    };

    // Валидация поля при изменении значения
    const handleInputChange = (field, value) => {
        // Обновляем значение в зависимости от поля
        switch(field) {
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }

        // Сбрасываем ошибку для этого поля
        setErrors(prev => ({...prev, [field]: ''}));
    };

    // Обработчик изменения поля даты
    const handleDateChange = (field, value) => {
        // Ограничения для ввода
        let maxLength;
        switch(field) {
            case 'day':
                maxLength = 2;
                break;
            case 'month':
                maxLength = 2;
                break;
            case 'year':
                maxLength = 4;
                break;
            default:
                maxLength = 2;
        }

        // Только цифры и не больше максимальной длины
        const numericValue = value.replace(/\D/g, '').slice(0, maxLength);

        setBirthDate(prev => ({...prev, [field]: numericValue}));
        setErrors(prev => ({
            ...prev,
            birthDate: {...prev.birthDate, [field]: ''}
        }));
    };

    return (
        <div className="block2">
            <div className="left">
                <h1 className="registration">Регистрация</h1>
                <h2>Имя</h2>
                <input
                    className={`registration ${errors.firstName ? 'error-input' : ''}`}
                    type="text"
                    value={firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
                <h2>Фамилия</h2>
                <input
                    className={`registration ${errors.lastName ? 'error-input' : ''}`}
                    type="text"
                    value={lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                />

                <h2>Дата рождения</h2>
                <div className="birthdate-inputs">
                    <input
                        className={`registration ${errors.birthDate.day ? 'error-input' : ''}`}
                        type="text"
                        placeholder="День"
                        value={birthDate.day}
                        onChange={(e) => handleDateChange('day', e.target.value)}
                    />
                    <input
                        className={`registration ${errors.birthDate.month ? 'error-input' : ''}`}
                        type="text"
                        placeholder="Месяц"
                        value={birthDate.month}
                        onChange={(e) => handleDateChange('month', e.target.value)}
                    />
                    <input
                        className={`registration ${errors.birthDate.year ? 'error-input' : ''}`}
                        type="text"
                        placeholder="Год"
                        value={birthDate.year}
                        onChange={(e) => handleDateChange('year', e.target.value)}
                    />
                </div>
                <div className="date-errors">
                    {errors.birthDate.day && <p className="error-message">{errors.birthDate.day}</p>}
                    {errors.birthDate.month && <p className="error-message">{errors.birthDate.month}</p>}
                    {errors.birthDate.year && <p className="error-message">{errors.birthDate.year}</p>}
                </div>

                <h2>Логин</h2>
                <input
                    className={`registration ${errors.username ? 'error-input' : ''}`}
                    type="text"
                    value={username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}

                <h2>Пароль</h2>
                <input
                    className={`registration ${errors.password ? 'error-input' : ''}`}
                    type="password"
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}

                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        id="agree"
                        checked={isChecked}
                        onChange={(e) => {
                            setIsChecked(e.target.checked);
                            if (e.target.checked) {
                                setErrors(prev => ({...prev, general: ''}));
                            }
                        }}
                    />
                    <label htmlFor="agree">
                        <a className="politika" href="/privacy.pdf">Согласен на обработку персональных данных</a>
                    </label>
                </div>

                {errors.general && <p className="error-message">{errors.general}</p>}

                <button className="registration" onClick={handleRegister}>Создать аккаунт</button>
                <button onClick={toggleAuthForm} className="toggle-button">Войти в существующий аккаунт</button>
            </div>
        </div>
    );
}

export default Register;