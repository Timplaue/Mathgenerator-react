import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Achievements.css';

function Achievements() {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/auth/check-achievements',
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                setAchievements(response.data.achievements);
            } catch (error) {
                console.error("Ошибка загрузки достижений", error);
            }
        };

        fetchAchievements();
    }, []);

    return (
        <div className="achievements">
            <h2>Ваши достижения</h2>
            <div className="achievements-list">
                {achievements.length > 0 ? (
                    achievements.map((achievement) => (
                        <div key={achievement._id} className="achievement-card">
                            <div className="achievement-content">
                                <div className="achievement-image">
                                    <img src={achievement.icon} alt={achievement.title} />
                                </div>
                                <div className="achievement-info">
                                    <h3>{achievement.title}</h3>
                                    <p>{achievement.description}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Нет достижений</p>
                )}
            </div>
        </div>
    );
}

export default Achievements;