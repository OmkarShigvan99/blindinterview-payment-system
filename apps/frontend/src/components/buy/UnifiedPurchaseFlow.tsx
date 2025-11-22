import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ErrorAlert, ButtonLoading } from '@/components/ui/global';

import { useAuth } from '@/hooks/useAuth';
import { usePurchaseFlow } from '@/hooks/usePurchaseFlow';

// Import separated components
import { StepIndicator } from './purchase/StepIndicator';
import { CurrentPlanCard } from './purchase/CurrentPlanCard';
import { PlanSelection } from './purchase/PlanSelection';
import { PlanOrderSummary } from './purchase/PlanOrderSummary';
import { PaymentSelection } from './purchase/PaymentSelection';
import { PaymentProvider, OrderType } from '@shared/types/order';
import { useRouter } from 'next/navigation';

interface UnifiedPurchaseFlowProps {
    onComplete?: () => void;
}

const buttonVariants = {
    hover: {
        scale: 1.02,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

export function UnifiedPurchaseFlow({ onComplete }: UnifiedPurchaseFlowProps) {
    const { user } = useAuth();
    const {
        currentStep,
        selectedPlan,
        pricingTiers,
        orderSummary,
        error,
        isLoading,
        isCreatingOrder,
        paymentLoading,
        paymentRedirecting,
        fetchPricingTiers,
        handlePlanSelection,
        proceedToSummary,
        handlePayment,
        goBack,
        goToPayment,
    } = usePurchaseFlow();
    const router = useRouter();

    const formattedPlan = user?.planType
        ? user.planType.charAt(0).toUpperCase() + user.planType.slice(1)
        : 'Free';

    const formattedDate =
        user?.planExpiry && user.planExpiry !== 'unlimited'
            ? format(new Date(user.planExpiry), 'PPPP')
            : user?.planExpiry === 'unlimited'
              ? 'Unlimited'
              : 'N/A';

    useEffect(() => {
        fetchPricingTiers();
    }, [fetchPricingTiers]);

    const handlePaymentSelect = async (
        provider: PaymentProvider,
        acceptedTerms: boolean,
        acceptedRefundPolicy: boolean,
        acceptedPrivacyPolicy: boolean,
    ) => {
        try {
            const result = await handlePayment(
                provider,
                acceptedTerms,
                acceptedRefundPolicy,
                acceptedPrivacyPolicy,
            );
            if (result) {
                onComplete?.();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Error already handled in the hook
        }
    };

    const canProceed = selectedPlan;

    // Check if user has an active non-free plan and is selecting a different plan
    const hasActiveNonFreePlan = user?.planType && user.planType !== 'free';
    const showUpgradeWarning = hasActiveNonFreePlan && selectedPlan && selectedPlan.name !== 'free';

    const renderSelection = () => (
        <motion.div
            key="selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            {user && (
                <CurrentPlanCard
                    user={user}
                    formattedPlan={formattedPlan}
                    formattedDate={formattedDate}
                />
            )}

            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Choose Your Plan</h2>
                    <p className="text-muted-foreground">
                        Upgrade your experience with our premium features
                    </p>
                </div>

                <PlanSelection
                    pricingTiers={pricingTiers}
                    selectedPlan={selectedPlan}
                    onPlanSelect={handlePlanSelection}
                    isLoading={isLoading}
                />

                {/* Warning for plan upgrade */}
                {showUpgradeWarning && (
                    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                                        Plan Change Notice
                                    </h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                                        You currently have an active{' '}
                                        <strong>{user?.planType?.toUpperCase()}</strong> plan.
                                        Purchasing this new plan will immediately replace your
                                        current plan and deactivate it. Any remaining time on your
                                        current plan will be lost.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {error && <ErrorAlert message={error} />}

            <div className="flex justify-between">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        className="hover:text-primary hover:bg-primary/10 hover:border-primary"
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        onClick={proceedToSummary}
                        disabled={!canProceed || isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? (
                            <ButtonLoading text="Loading..." />
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );

    const renderSummary = () => (
        <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {orderSummary && orderSummary.type === OrderType.PLAN && (
                <PlanOrderSummary orderSummary={orderSummary} currentUser={user} />
            )}

            {error && <ErrorAlert message={error} />}

            <div className="flex justify-between">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        className="hover:text-primary hover:bg-primary/10 hover:border-primary"
                        onClick={goBack}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button onClick={goToPayment}>
                        Proceed to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );

    const renderPayment = () => (
        <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <PaymentSelection
                onPaymentSelect={handlePaymentSelect}
                isProcessing={isCreatingOrder || paymentLoading}
                isRedirecting={paymentRedirecting}
            />

            {error && <ErrorAlert message={error} />}

            <div className="flex justify-between ">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        className="hover:text-primary hover:bg-primary/10 hover:border-primary"
                        onClick={goBack}
                        disabled={isCreatingOrder || paymentLoading || paymentRedirecting}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <StepIndicator currentStep={currentStep} />

            <AnimatePresence mode="wait">
                {currentStep === 'selection' && renderSelection()}
                {currentStep === 'summary' && renderSummary()}
                {currentStep === 'payment' && renderPayment()}
            </AnimatePresence>
        </div>
    );
}
