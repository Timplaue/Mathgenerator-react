import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import DifficultySelection from './components/DifficultySelection';
import Example from './components/Example';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Achievements from './components/Achievements';
import NavMenu from './components/NavMenu';
import InitialTest from './components/InitialTest';
import { jwtDecode } from 'jwt-decode';

// User flow constants
const SCREENS = {
    WELCOME: 'welcome',
    LOGIN: 'login',
    REGISTER: 'register',
    INITIAL_TEST: 'initialTest',
    MAIN: 'difficulty', // Main screen is the difficulty selection
    EXAMPLE: 'example',
    PROFILE: 'profile',
    SETTINGS: 'settings',
    ACHIEVEMENTS: 'achievements',
};

function App() {
    // State management
    const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [difficulty, setDifficulty] = useState(null);
    const [settings, setSettings] = useState({
        count: 2,
        operations: ['+', '-', '*', '/'],
        timeLimit: 120,
    });
    const [userInfo, setUserInfo] = useState(null);
    const [initialTestCompleted, setInitialTestCompleted] = useState(false);

    // Authentication handlers
    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);

        try {
            const decoded = jwtDecode(token);
            setUserInfo(decoded);

            // Проверяем, проходил ли пользователь начальное тестирование
            const testCompleted = localStorage.getItem('initialTestCompleted');
            if (testCompleted === 'true') {
                setInitialTestCompleted(true);

                // Загружаем сохраненные настройки и уровень сложности
                const savedSettings = localStorage.getItem('mathSettings');
                const savedLevel = localStorage.getItem('userLevel');

                if (savedSettings) {
                    setSettings(JSON.parse(savedSettings));
                }

                if (savedLevel) {
                    setDifficulty(savedLevel);
                }

                navigateTo(SCREENS.MAIN);
            } else {
                // Если тест не пройден, направляем на начальное тестирование
                navigateTo(SCREENS.INITIAL_TEST);
            }
        } catch (error) {
            console.error("Ошибка при декодировании токена:", error);
            navigateTo(SCREENS.MAIN);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserInfo(null);
        navigateTo(SCREENS.LOGIN);
    };

    const toggleRegister = () => {
        navigateTo(currentScreen === SCREENS.LOGIN ? SCREENS.REGISTER : SCREENS.LOGIN);
    };

    // Navigation
    const navigateTo = (screen) => setCurrentScreen(screen);

    // Difficulty selection
    const handleSelectDifficulty = (level) => {
        setDifficulty(level);
        navigateTo(SCREENS.EXAMPLE);
    };

    // Settings handlers
    const handleSaveSettings = (newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
        navigateTo(SCREENS.MAIN);
    };

    const handleTimeChange = (newTime) => {
        setSettings((prev) => ({ ...prev, timeLimit: newTime }));
    };

    // Обработка завершения начального тестирования
    const handleTestComplete = (results) => {
        console.log("Результаты тестирования:", results);

        // Устанавливаем флаг завершения тестирования
        localStorage.setItem('initialTestCompleted', 'true');
        setInitialTestCompleted(true);

        // Устанавливаем рекомендованный уровень сложности
        setDifficulty(results.recommendedLevel);

        // Устанавливаем рекомендованные настройки
        setSettings(results.recommendedSettings);

        // Переходим на главный экран
        navigateTo(SCREENS.MAIN);
    };

    // Check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            console.error("Invalid token:", error);
            return true;
        }
    };

    // Effect to check authentication status on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);

            try {
                const decoded = jwtDecode(token);
                setUserInfo(decoded);

                // Проверяем, проходил ли пользователь начальное тестирование
                const testCompleted = localStorage.getItem('initialTestCompleted');
                if (testCompleted === 'true') {
                    setInitialTestCompleted(true);

                    // Загружаем сохраненные настройки и уровень сложности
                    const savedSettings = localStorage.getItem('mathSettings');
                    const savedLevel = localStorage.getItem('userLevel');

                    if (savedSettings) {
                        setSettings(JSON.parse(savedSettings));
                    }

                    if (savedLevel) {
                        setDifficulty(savedLevel);
                    }

                    navigateTo(SCREENS.MAIN);
                } else {
                    // Если тест не пройден, направляем на начальное тестирование
                    navigateTo(SCREENS.INITIAL_TEST);
                }
            } catch (error) {
                console.error("Ошибка при декодировании токена:", error);
                navigateTo(SCREENS.MAIN);
            }
        } else {
            // Show welcome screen briefly before redirecting to login
            const timer = setTimeout(() => navigateTo(SCREENS.LOGIN), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    // Render appropriate screen based on authentication and current screen
    const renderScreen = () => {
        if (!isAuthenticated) {
            switch (currentScreen) {
                case SCREENS.WELCOME:
                    return <WelcomeScreen />;
                case SCREENS.REGISTER:
                    return <Register onRegister={() => navigateTo(SCREENS.LOGIN)} toggleAuthForm={toggleRegister} />;
                case SCREENS.LOGIN:
                default:
                    return <Login onLogin={handleLogin} toggleAuthForm={toggleRegister} />;
            }
        }

        // User is authenticated
        return (
            <>
                {currentScreen === SCREENS.INITIAL_TEST && (
                    <InitialTest
                        onComplete={handleTestComplete}
                        birthDate={userInfo?.birthDate || '2000-01-01'}
                    />
                )}
                {currentScreen === SCREENS.MAIN && (
                    <DifficultySelection onSelectDifficulty={handleSelectDifficulty} />
                )}
                {currentScreen === SCREENS.EXAMPLE && (
                    <Example
                        difficulty={difficulty}
                        settings={settings}
                        onBack={() => navigateTo(SCREENS.MAIN)}
                    />
                )}
                {currentScreen === SCREENS.PROFILE && (
                    <Profile onLogout={handleLogout} />
                )}
                {currentScreen === SCREENS.SETTINGS && (
                    <Settings
                        onSaveSettings={handleSaveSettings}
                        onBack={() => navigateTo(SCREENS.MAIN)}
                        initialTime={settings.timeLimit}
                        onTimeChange={handleTimeChange}
                    />
                )}
                {currentScreen === SCREENS.ACHIEVEMENTS && <Achievements />}
                {currentScreen !== SCREENS.INITIAL_TEST && (
                    <NavMenu onNavigate={navigateTo} currentScreen={currentScreen} />
                )}
            </>
        );
    };

    return <div className="App">{renderScreen()}</div>;
}

export default App;