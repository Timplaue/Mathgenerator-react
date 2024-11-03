import React from 'react';
import axios from 'axios';

function AvatarUpload({ onAvatarUpload }) {
    const handleUpload = async (event) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            onAvatarUpload(response.data.avatarUrl); // Передаем URL нового аватара
        } catch (error) {
            console.error("Ошибка загрузки аватара:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleUpload} />
        </div>
    );
}

export default AvatarUpload;
