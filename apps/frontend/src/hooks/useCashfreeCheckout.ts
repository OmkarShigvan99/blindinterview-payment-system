import { useState } from 'react';
import { OrderDTO } from '@shared/types/order';

// Cashfree SDK v3 types based on official documentation
interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_parent' | '_top';
}

interface UseCashfreeCheckoutReturn {
    processPayment: (order: OrderDTO) => void;
    loading: boolean;
    isRedirecting: boolean;
    error: string | null;
    clearError: () => void;
}

export const useCashfreeCheckout = (): UseCashfreeCheckoutReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRedirecting] = useState(false);

    const clearError = () => setError(null);

    const processPayment = (order: OrderDTO) => {
        if (!order.gatewayData?.cashfree) {
            setError('Cashfree gateway data not found for this order');
            return;
        }

        if (!order.gatewayData.cashfree.paymentSessionId) {
            setError('Payment session not found for this order');
            return;
        }

        // Check if Cashfree SDK v3 is loaded (loaded via Next.js Script)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(window as any).Cashfree) {
            setError('Cashfree SDK not loaded. Please refresh the page and try again.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Initialize Cashfree instance with mode configuration
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cashfree = (window as any).Cashfree({
                mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            });

            const checkoutOptions: CashfreeCheckoutOptions = {
                paymentSessionId: order.gatewayData.cashfree.paymentSessionId,
                redirectTarget: '_self', // This will redirect in the same tab after payment
            };

            // Start the checkout process - this will redirect to payment page
            cashfree.checkout(checkoutOptions);

            // Note: After payment completion, Cashfree will redirect back to your return URL
            // which should be configured in your Cashfree dashboard or during session creation
            setLoading(false);
        } catch (err) {
            setLoading(false);
            const errorMessage =
                err instanceof Error ? err.message : 'Payment failed. Please try again.';
            setError(errorMessage);
            console.error('Cashfree checkout error:', err);
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
