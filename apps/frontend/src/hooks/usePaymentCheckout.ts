import { useState } from 'react';
import { OrderDTO, PaymentProvider } from '@shared/types/order';
import { useRazorpayCheckout } from './useRazorpayCheckout';
import { useCashfreeCheckout } from './useCashfreeCheckout';

interface UsePaymentCheckoutReturn {
    processPayment: (
        order: OrderDTO,
        userInfo?: { name?: string; email?: string; contact?: string },
    ) => void;
    loading: boolean;
    isRedirecting: boolean;
    error: string | null;
    clearError: () => void;
}

export const usePaymentCheckout = (): UsePaymentCheckoutReturn => {
    const [generalError, setGeneralError] = useState<string | null>(null);

    const razorpayCheckout = useRazorpayCheckout();
    const cashfreeCheckout = useCashfreeCheckout();

    const clearError = () => {
        setGeneralError(null);
        razorpayCheckout.clearError();
        cashfreeCheckout.clearError();
    };

    const processPayment = (
        order: OrderDTO,
        userInfo: { name?: string; email?: string; contact?: string } = {},
    ) => {
        // Clear any previous errors
        clearError();

        // Validate order
        if (!order.id) {
            setGeneralError('Invalid order - Order ID not found');
            return;
        }

        if (!order.gatewayData) {
            setGeneralError('Payment gateway information not available for this order');
            return;
        }

        // Route to appropriate payment provider
        switch (order.provider) {
            case PaymentProvider.RAZORPAY:
                if (order.gatewayData.razorpay) {
                    razorpayCheckout.processPayment(order, userInfo);
                } else {
                    setGeneralError('Razorpay payment data not found for this order');
                }
                break;

            case PaymentProvider.CASHFREE:
                if (order.gatewayData.cashfree) {
                    cashfreeCheckout.processPayment(order);
                } else {
                    setGeneralError('Cashfree payment data not found for this order');
                }
                break;

            default:
                setGeneralError(`Payment provider "${order.provider}" is not supported`);
                break;
        }
    };

    // Combine loading states from both providers
    const loading = razorpayCheckout.loading || cashfreeCheckout.loading;

    // Combine redirecting states from both providers
    const isRedirecting = razorpayCheckout.isRedirecting || cashfreeCheckout.isRedirecting;

    // Combine error states - prioritize general errors, then provider-specific errors
    const error = generalError || razorpayCheckout.error || cashfreeCheckout.error;

    return {
        processPayment,
        loading,
        isRedirecting,
        error,
        clearError,
    };
};
