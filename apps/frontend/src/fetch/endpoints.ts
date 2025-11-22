import { type AxiosResponse } from 'axios';
import api from './axios';
import { CountryCode2 } from '@shared/utils/country.utils';
import { OrderType, PaymentProvider } from '@shared/types/order';
import { Plans } from '@shared/types/pricingTier';
declare module 'axios' {
    interface AxiosRequestConfig {
        skipAuth?: boolean;
        skipRefresh?: boolean;
    }
}

export const API_AUTH_ENDPOINTS = {
    register: async function (params: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        acceptedTerms: boolean;
        acceptedPrivacyPolicy: boolean;
    }): Promise<AxiosResponse> {
        return await api.post('/auth/register', params, {
            skipAuth: true,
            skipRefresh: true,
        });
    },
    login: async function (params: { email: string; password: string }) {
        return await api.post('/auth/login', params, {
            skipRefresh: true,
        });
    },
    logout: async function (): Promise<AxiosResponse> {
        return await api.get('/auth/logout');
    },
    verifyEmail: async function (token: string): Promise<AxiosResponse> {
        return await api.post(
            '/auth/verify-email',
            {},
            {
                headers: {
                    'x-token': token,
                },
                skipRefresh: true,
            },
        );
    },
    sendVerificationEmail: async function (params: { email: string }): Promise<AxiosResponse> {
        return await api.post('/auth/send-verification-email', params);
    },
    sendPasswordResetEmail: async function (params: { email: string }) {
        return await api.post('/auth/send-password-reset-email', params);
    },
    resetPassword: async function (params: {
        token: string;
        newPassword: string;
        confirmPassword: string;
    }): Promise<AxiosResponse> {
        return await api.post(
            '/auth/reset-password',
            {
                newPassword: params.newPassword,
                confirmPassword: params.confirmPassword,
            },
            {
                headers: {
                    'x-token': params.token,
                },
                skipRefresh: true,
            },
        );
    },
    refreshAccessToken: async function (): Promise<AxiosResponse> {
        try {
            return await api.post(
                '/auth/refresh-access-token',
                {},
                {
                    skipRefresh: true,
                },
            );
        } catch (error) {
            // If refresh fails, redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw error;
        }
    },
};

export const API_USER_ENDPOINTS = {
    getUser: async function (params: { id: string }): Promise<AxiosResponse> {
        return await api.get(`/user/${params.id}`);
    },
};

export const API_PRICING_TIER_ENDPOINTS = {
    getPricingTiers: async function (country: CountryCode2): Promise<AxiosResponse> {
        return await api.get('/pricing-tier/', {
            params: {
                country,
            },
        });
    },
};

export const API_CREDITS_ENDPOINTS = {
    getCreditsCost: async function (params: { credits: number; country: CountryCode2 }) {
        return await api.get('/credits/cost', {
            params,
        });
    },
};

export const API_ORDER_ENDPOINTS = {
    createOrder: async function (params: {
        country: CountryCode2;
        credits: number;
        provider: PaymentProvider;
        plan?: Plans;
        type: OrderType;
        acceptedTerms: boolean;
        acceptedRefundPolicy: boolean;
        acceptedPrivacyPolicy: boolean;
    }) {
        return await api.post('/order/create', params);
    },
    verifyPayment: async function (params: {
        provider: PaymentProvider;
        orderId: string;
        paymentId: string;
        signature: string;
    }) {
        if (params.provider === PaymentProvider.RAZORPAY)
            return await api.post('/order/verify-payment/razorpay', params);
        else if (params.provider === PaymentProvider.CASHFREE)
            return await api.post('/order/verify-payment/cashfree', params);
    },
    getUserOrders: async function (params: {
        page?: number;
        limit?: number;
        userId: string;
    }): Promise<AxiosResponse> {
        return await api.get(`/order/user/${params.userId}`, {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
            },
        });
    },
};
