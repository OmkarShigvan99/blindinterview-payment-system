import axios from 'axios';
import { attachAuthTokenInterceptor } from './interceptors';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // 🛠️ Replace with your API base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 🔐 Attach token injector
attachAuthTokenInterceptor(api);

export default api;
