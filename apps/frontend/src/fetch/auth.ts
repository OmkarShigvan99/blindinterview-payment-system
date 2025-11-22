import { UserDTO } from '@shared/types/user';

export const TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_KEY = 'user';

export function setUserToLS<T>(user: T) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserFromLS(): UserDTO {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}');
}

export function clearUserFromLS() {
    localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
    return !!getUserFromLS().accessToken;
}
