import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';
import NavMenu from './components/NavMenu'; // Импортируйте NavMenu
import { jwtDecode } from 'jwt-decode'; // Исправленный импорт

function App() {
    const [difficulty, setDifficulty] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('welcome');

    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
        setCurrentScreen('example'); // Переход к примеру при выборе сложности
    };

    const handleLogin = (token) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token); // Сохраняем реальный токен
        setCurrentScreen('difficulty'); // Начнем с экрана выбора сложности
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentScreen('welcome');
        localStorage.removeItem('token');
    };

    const handleRegister = () => setIsRegistering(false);

    const toggleRegister = () => setIsRegistering(!isRegistering);

    const navigateTo = (screen) => {
        setCurrentScreen(screen);
    };

    const isTokenExpired = (token) => {
        if (!token) return true;
        const decoded = jwtDecode(token); // Используем jwtDecode
        return decoded.exp * 1000 < Date.now(); // Проверяем, истек ли токен
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            handleLogout(); // Если токен истек, выходим
        } else if (token) {
            setIsAuthenticated(true);
            setCurrentScreen('difficulty');
        } else {
            setCurrentScreen('welcome');
        }
    }, []);

    useEffect(() => {
        if (currentScreen === 'welcome') {
            const timer = setTimeout(() => setCurrentScreen('login'), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentScreen]);

    return (
        <div className="App">
            {!isAuthenticated ? (
                currentScreen === 'welcome' ? (
                    <WelcomeScreen />
                ) : isRegistering ? (
                    <Register onRegister={handleRegister} toggleAuthForm={toggleRegister} />
                ) : (
                    <Login onLogin={handleLogin} toggleAuthForm={toggleRegister} />
                )
            ) : (
                <div>
                    {currentScreen === 'profile' ? (
                        <Profile onLogout={handleLogout} />
                    ) : currentScreen === 'example' ? (
                        <Example difficulty={difficulty} onBack={() => navigateTo('difficulty')} />
                    ) : (
                        <DifficultySelection onSelectDifficulty={handleSelectDifficulty} />
                    )}
                    <NavMenu onNavigate={navigateTo} /> {/* Добавьте NavMenu здесь */}
                </div>
            )}
        </div>
    );
}

export default App;
