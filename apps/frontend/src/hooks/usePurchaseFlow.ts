import { useState, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { PricingTierDTO, Plans } from '@shared/types/pricingTier';
import { OrderType, PaymentProvider } from '@shared/types/order';
import { Step, OrderSummary } from '@/types/business/purchase';
import { API_PRICING_TIER_ENDPOINTS, API_ORDER_ENDPOINTS } from '@/fetch/endpoints';
import { usePaymentCheckout } from './usePaymentCheckout';
import { useCountryDetection } from './useCountryDetection';

export function usePurchaseFlow() {
    const [currentStep, setCurrentStep] = useState<Step>('selection');
    const [selectedPlan, setSelectedPlan] = useState<PricingTierDTO | null>(null);
    const [pricingTiers, setPricingTiers] = useState<PricingTierDTO[]>([]);
    const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const { countryCode, currency, loading: countryLoading } = useCountryDetection();

    // Initialize payment checkout hook
    const {
        processPayment,
        loading: paymentLoading,
        isRedirecting: paymentRedirecting,
        error: paymentError,
        clearError: clearPaymentError,
    } = usePaymentCheckout();

    const fetchPricingTiers = useCallback(async () => {
        if (countryLoading) return;
        try {
            setIsLoading(true);
            const response = await API_PRICING_TIER_ENDPOINTS.getPricingTiers(countryCode);
            if (response.status === 200) {
                setPricingTiers(response.data.data as PricingTierDTO[]);
            }
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.data?.reason ?? 'Something went wrong.');
            } else {
                setError('Something went wrong.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [countryCode, countryLoading]);

    const handlePlanSelection = useCallback((plan: PricingTierDTO) => {
        setSelectedPlan(plan);
        setOrderSummary(null); // Clear order summary when changing selection
        setError(null);
    }, []);

    // Function to clear order summary specifically
    const clearOrderSummary = useCallback(() => {
        setOrderSummary(null);
        setError(null);
    }, []);

    // Function to clear all selections and reset to initial state
    const clearAllSelections = useCallback(() => {
        setSelectedPlan(null);
        setOrderSummary(null);
        setError(null);
        setCurrentStep('selection');
    }, []);

    const proceedToSummary = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Validate that user has selected a plan
            if (!selectedPlan) {
                setError('Please select a plan.');
                setIsLoading(false);
                return;
            }

            // Validate plan is active
            if (!selectedPlan.isActive) {
                setError('Selected plan is not available.');
                setIsLoading(false);
                return;
            }

            // Create order summary from selected plan
            setOrderSummary({
                basePrice: selectedPlan.basePrice,
                creditsIncluded: selectedPlan.creditsIncluded,
                credits: selectedPlan.creditsIncluded,
                currency: currency,
                country: countryCode,
                description: selectedPlan.description,
                isActive: selectedPlan.isActive,
                name: selectedPlan.name as Plans,
                referencePPPCountry: 'IN', // Default fallback
                referencePPPValue: 1, // Default fallback
                referencePPPYear: '2024', // Default fallback
                type: OrderType.PLAN,
                expiryInDays: selectedPlan.expiryInDays,
                features: selectedPlan.features,
            } as OrderSummary);

            setCurrentStep('summary');
        } catch (err) {
            if (isAxiosError(err)) {
                setError(err.response?.data?.data?.reason ?? 'Something went wrong.');
            } else {
                setError('Something went wrong.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [selectedPlan, countryCode, currency]);

    const handlePayment = useCallback(
        async (
            provider: PaymentProvider,
            acceptedTerms: boolean,
            acceptedRefundPolicy: boolean,
            acceptedPrivacyPolicy: boolean,
        ) => {
            if (!orderSummary) {
                setError('No order summary available. Please go back and try again.');
                return;
            }

            // Validate policy acceptance
            if (!acceptedTerms) {
                setError('You must accept the Terms and Conditions to proceed.');
                return;
            }

            if (!acceptedRefundPolicy) {
                setError('You must acknowledge the No Refund Policy to proceed.');
                return;
            }

            if (!acceptedPrivacyPolicy) {
                setError('You must accept the Privacy Policy to proceed.');
                return;
            }

            // Validate order summary before payment
            if (!orderSummary.basePrice || orderSummary.basePrice <= 0) {
                setError('Invalid order amount. Please go back and try again.');
                clearOrderSummary();
                return;
            }

            if (
                !orderSummary.credits ||
                (typeof orderSummary.credits === 'number' && orderSummary.credits <= 0)
            ) {
                setError('Invalid credits amount. Please go back and try again.');
                clearOrderSummary();
                return;
            }

            try {
                setIsCreatingOrder(true);
                setError(null);
                clearPaymentError(); // Clear any previous payment errors

                // Create the order first
                const response = await API_ORDER_ENDPOINTS.createOrder({
                    country: orderSummary.country,
                    credits:
                        typeof orderSummary.creditsIncluded === 'number'
                            ? orderSummary.creditsIncluded
                            : 0, // Handle unlimited case
                    provider: provider,
                    type: OrderType.PLAN,
                    plan: orderSummary.name,
                    acceptedTerms,
                    acceptedRefundPolicy,
                    acceptedPrivacyPolicy,
                });

                if (response.status === 201) {
                    // Order created successfully, now process payment
                    const order = response.data.data;
                    processPayment(order); // Use the payment checkout hook
                    return order;
                } else {
                    setError('Failed to create order. Please try again.');
                    return null;
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    setError(err.response?.data?.data?.reason ?? 'Failed to create order.');
                } else {
                    setError('Failed to create order.');
                }
            } finally {
                setIsCreatingOrder(false);
            }
        },
        [orderSummary, clearOrderSummary, clearPaymentError, processPayment],
    );

    const goBack = useCallback(() => {
        if (currentStep === 'summary') {
            setCurrentStep('selection');
            // Clear order summary when going back to selection for security
            clearOrderSummary();
        } else if (currentStep === 'payment') {
            setCurrentStep('summary');
        }
        setError(null);
    }, [currentStep, clearOrderSummary]);

    const goToPayment = useCallback(() => {
        // Validate that we have a valid order summary before proceeding to payment
        if (!orderSummary || !orderSummary.basePrice || orderSummary.basePrice <= 0) {
            setError('Invalid order data. Please go back and try again.');
            clearOrderSummary();
            return;
        }
        setCurrentStep('payment');
        setError(null);
    }, [orderSummary, clearOrderSummary]);

    return {
        // State
        currentStep,
        selectedPlan,
        pricingTiers,
        orderSummary,
        error,
        isLoading,
        isCreatingOrder,

        // Actions
        fetchPricingTiers,
        handlePlanSelection,
        clearOrderSummary,
        clearAllSelections,
        proceedToSummary,
        handlePayment,
        goBack,
        goToPayment,
        setError,
        // Payment states from usePaymentCheckout
        paymentLoading,
        paymentRedirecting,
        paymentError,
        clearPaymentError,
    };
}
