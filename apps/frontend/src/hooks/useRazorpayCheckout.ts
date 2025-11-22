import { useState } from 'react';
import { OrderDTO, OrderType } from '@shared/types/order';
import { BRAND_COLORS, BRAND_INFO } from '@shared/constants/brand';

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    image: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name?: string;
        email?: string;
    };
    theme: {
        color: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

interface RazorpayConstructor {
    new (options: RazorpayOptions): RazorpayInstance;
}

interface UseRazorpayCheckoutReturn {
    processPayment: (
        order: OrderDTO,
        userInfo?: { name?: string; email?: string; contact?: string },
    ) => void;
    loading: boolean;
    isRedirecting: boolean;
    error: string | null;
    clearError: () => void;
}

export const useRazorpayCheckout = (): UseRazorpayCheckoutReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const clearError = () => setError(null);

    const processPayment = (
        order: OrderDTO,
        userInfo: { name?: string; email?: string; contact?: string } = {},
    ) => {
        if (!order.gatewayData?.razorpay) {
            setError('Razorpay gateway data not found for this order');
            return;
        }

        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            setError('Razorpay configuration not found');
            return;
        }

        if (!(window as { Razorpay?: RazorpayConstructor }).Razorpay) {
            setError('Razorpay SDK not loaded. Please refresh the page and try again.');
            return;
        }

        setLoading(true);
        setError(null);

        const options: RazorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.gatewayData.razorpay.amount,
            currency: order.gatewayData.razorpay.currency,
            name: BRAND_INFO.DISPLAY_NAME,
            description:
                order.type === OrderType.PLAN
                    ? `${order.planType} Plan Subscription`
                    : `${order.credits} Credits Purchase`,
            order_id: order.gatewayData.razorpay.orderId,
            image: '/assets/ui-icons/logo-ico.svg',
            handler: function (response: RazorpayResponse) {
                setLoading(false);
                setIsRedirecting(true);
                // Redirect to verification page with payment details
                const params = new URLSearchParams({
                    orderId: order.gatewayData?.razorpay?.orderId ?? '',
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                    provider: 'razorpay',
                });
                window.location.href = `/verify-payment?${params.toString()}`;
            },
            prefill: {
                name: userInfo.name || '',
                email: userInfo.email || '',
            },
            theme: {
                color: BRAND_COLORS.RAZORPAY_THEME,
            },
            modal: {
                ondismiss: () => {
                    setLoading(false);
                    setError('Payment was cancelled');
                },
            },
        };

        try {
            const rzp = new (window as { Razorpay: RazorpayConstructor }).Razorpay(options);
            rzp.open();
        } catch (err) {
            setLoading(false);
            setError('Failed to initialize payment. Please try again.');
            console.error('Razorpay initialization error:', err);
        }
    };

    return {
        processPayment,
        loading,
        isRedirecting,
        error,
        clearError,
    };
};
