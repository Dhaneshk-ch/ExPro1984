// Axios instance with base URL
import axios from 'axios';

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'https://expro-backend.onrender.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to request headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Best-effort: handle 401 Unauthorized by clearing token and redirecting to login
        const status = error?.response?.status;
        if (status === 401) {
            try {
                localStorage.removeItem('token');
            } catch (e) {
                /* ignore storage errors */
            }
            // If we're in the browser, redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
