// src/services/uploadService.js
// Handles all file upload API calls from frontend

const BASE_URL = 'http://localhost:3000/api';

const getToken = () => {
    try {
        return JSON.parse(localStorage.getItem('devconnect_token'));
    } catch {
        return null;
    }
};

export const uploadService = {

    // ─── Upload Profile Picture ───
    uploadProfilePicture: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('profilePicture', file);
        // ↑ field name must match multer .single('profilePicture')

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // ↑ use XHR instead of fetch for upload progress tracking

            // Track upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress?.(percent);
                    // ↑ call callback with percentage
                }
            });

            xhr.addEventListener('load', () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data);
                } else {
                    reject(new Error(data.message ?? 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${BASE_URL}/upload/profile`);
            xhr.setRequestHeader(
                'Authorization',
                `Bearer ${getToken()}`
            );
            // NOTE: do NOT set Content-Type for FormData
            // Browser sets it automatically with boundary
            xhr.send(formData);
        });
    },


    // ─── Upload Resume ───
    uploadResume: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('resume', file);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress?.(percent);
                }
            });

            xhr.addEventListener('load', () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data);
                } else {
                    reject(new Error(data.message ?? 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${BASE_URL}/upload/resume`);
            xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
            xhr.send(formData);
        });
    },


    // ─── Upload Company Logo ───
    uploadCompanyLogo: async (file, companyId, onProgress) => {
        const formData = new FormData();
        formData.append('logo', file);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress?.(percent);
                }
            });

            xhr.addEventListener('load', () => {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(data);
                } else {
                    reject(new Error(data.message ?? 'Upload failed'));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });

            xhr.open('POST', `${BASE_URL}/upload/logo/${companyId}`);
            xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
            xhr.send(formData);
        });
    },
};