import { type AxiosInstance } from 'axios';
import { clearUserFromLS, getUserFromLS, setUserToLS } from './auth';
import { API_AUTH_ENDPOINTS } from './endpoints';
import { UserDTO } from '@shared/types/user';

let isRefreshing = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: { reject: (reason?: any) => void; resolve: (token: string | null) => void }[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
}

async function refreshAccessToken(): Promise<string> {
    const response = await API_AUTH_ENDPOINTS.refreshAccessToken();
    const user = response.data.data as UserDTO;
    user.isAuthenticated = true;
    setUserToLS(user);

    if (!user.accessToken) {
        throw new Error('No access token received');
    }

    return user.accessToken;
}

export function attachAuthTokenInterceptor(api: AxiosInstance) {
    api.interceptors.request.use(
        (config) => {
            if (config.skipAuth) {
                return config;
            }

            const token = getUserFromLS().accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // 👇 If the request opts out of refresh, just reject
            if (originalRequest?.skipRefresh) {
                return Promise.reject(error);
            }
            // Check for 401 and if it's the first retry
            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const newToken = await refreshAccessToken();
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    clearUserFromLS();
                    // Redirect is handled in the endpoint
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
}
