'use client';
import { createContext, useEffect, useState } from 'react';
import { getUserFromLS, setUserToLS, clearUserFromLS } from '@/fetch/auth';

import { Plans } from '@shared/types/pricingTier';
import { type UserDTO } from '@shared/types/user';

type Props = {
    children: React.ReactNode;
};

const initialUser: UserDTO = {
    id: '',
    name: '',
    email: '',
    role: 'user',
    isEmailVerified: false,
    accessToken: '',
    refreshToken: '',
    avatar: '',
    credits: 0,
    planType: Plans.FREE,
    planExpiry: new Date(),
    isAuthenticated: false,
    acceptedTerms: false,
    acceptedTermsAt: new Date(),
    acceptedPrivacyPolicy: false,
    acceptedPrivacyPolicyAt: new Date(),
};

type AuthContextProps = {
    user: UserDTO;
    setLocalUser: (user: UserDTO) => void;
    isLoading: boolean;
    resetAuthData: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
    user: initialUser,
    setLocalUser: () => {},
    isLoading: true,
    resetAuthData: () => {},
});

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<UserDTO>(initialUser);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //useEffect to load access token and refresh token from local storage
    useEffect(() => {
        const user = getUserFromLS();
        if (user) {
            setUser(() => {
                return {
                    ...user,
                };
            });
        }

        setIsLoading(false);
    }, []);

    //set access token and refresh token in local storage
    function setLocalUser(user: UserDTO) {
        setUserToLS<UserDTO>(user);
        setUser((prev) => {
            return {
                ...prev,
                ...Object.fromEntries(
                    Object.entries(user).filter(([, value]) => value !== undefined),
                ),
            };
        });
    }

    function resetAuthData() {
        setUser(initialUser);
        clearUserFromLS();
    }

    const value = {
        user,
        setLocalUser,
        isLoading,
        resetAuthData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
