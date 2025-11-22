'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, RotateCcw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { API_ORDER_ENDPOINTS } from '@/fetch/endpoints';
import { PaymentProvider } from '@shared/types/order';
import { isAxiosError } from 'axios';
import { ErrorAlert, PageLoading } from '@/components/ui/global';

type BasePaymentData = {
    provider: string;
    orderId: string;
};

type RazorpayPaymentData = BasePaymentData & {
    provider: PaymentProvider.RAZORPAY;
    paymentId: string;
    signature: string;
};

type PaymentData = BasePaymentData | RazorpayPaymentData;

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

function PaymentVerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(3);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
    };

    const pulseVariants = {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
        },
    };

    // Get payment data from query params
    useEffect(() => {
        const provider = searchParams.get('provider');
        const orderId = searchParams.get('orderId');
        const paymentId = searchParams.get('paymentId');
        const signature = searchParams.get('signature');

        if (!provider || !orderId) {
            setStatus('error');
            setMessage('Missing required query parameters.');
            return;
        }

        if (provider === PaymentProvider.RAZORPAY) {
            if (!paymentId || !signature) {
                setStatus('error');
                setMessage('Missing Razorpay-specific parameters.');
                return;
            }

            const data: RazorpayPaymentData = {
                provider: PaymentProvider.RAZORPAY,
                orderId,
                paymentId,
                signature,
            };
            setPaymentData(data);
        } else {
            const data: BasePaymentData = {
                provider,
                orderId,
            };
            setPaymentData(data);
        }
    }, [searchParams]);

    // Automatically trigger verification after setting payment data
    useEffect(() => {
        if (paymentData && status === 'idle') {
            handleVerify(); // auto-run on first load
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentData]);

    // Automatically redirect after successful verification
    useEffect(() => {
        if (status === 'success') {
            setCountdown(3); // Reset countdown when verification succeeds
            
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        router.replace('/profile');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [status, router]);

    const handleVerify = async () => {
        if (!paymentData) return;

        setLoading(true);
        setStatus('idle');
        setMessage(null);

        try {
            const response = await API_ORDER_ENDPOINTS.verifyPayment({
                provider: paymentData.provider as PaymentProvider,
                orderId: paymentData.orderId,
                paymentId: (paymentData as RazorpayPaymentData).paymentId,
                signature: (paymentData as RazorpayPaymentData).signature,
            });

            if (response?.status === 200) {
                setStatus('success');
                setMessage('Payment verified successfully! Your order has been confirmed.');
                toast.success('Payment verified successfully!');
            }
        } catch (err) {
            if (isAxiosError(err)) {
                setStatus('error');
                setMessage(
                    err.response?.data?.data?.reason ||
                        'Payment verification failed. Please try again.',
                );
                toast.error('Verification failed.');
            } else {
                setStatus('error');
                setMessage('Payment verification failed. Please try again.');
                toast.error('Verification failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoToProfile = () => {
        router.replace('/profile');
    };

    // Show loading state
    if (loading && status === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/20">
                <PageLoading text="Verifying your payment..." className="text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-muted/20 flex items-center justify-center px-4 py-8">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-2xl font-bold text-foreground">
                                Payment Verification
                            </CardTitle>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4">
                        <AnimatePresence mode="wait">
                            {status === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center space-y-4"
                                >
                                    <motion.div
                                        animate={pulseVariants}
                                        className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            Payment Verified!
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{message}</p>
                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                Please wait - do not close this window
                                            </p>
                                            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                                                Redirecting automatically in {countdown} second{countdown !== 1 ? 's' : ''}...
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-4"
                                >
                                    <ErrorAlert
                                        message={message || 'Verification failed'}
                                        title="Verification Failed"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Payment Details (Collapsible) */}
                        {paymentData && (
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <motion.div
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <Button
                                            variant="ghost"
                                            className="w-full text-sm text-muted-foreground hover:text-foreground"
                                            size="sm"
                                        >
                                            <span>Show Payment Details</span>
                                            <ChevronDown className="h-4 w-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs overflow-hidden"
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Provider:</span>
                                            <span className="font-medium capitalize">
                                                {paymentData.provider}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Order ID:</span>
                                            <span className="font-mono text-xs">
                                                {paymentData.orderId}
                                            </span>
                                        </div>
                                        {'paymentId' in paymentData && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Payment ID:
                                                </span>
                                                <span className="font-mono text-xs">
                                                    {paymentData.paymentId}
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}

                        {/* Action Buttons */}
                        <motion.div variants={itemVariants} className="space-y-3 pt-2">
                            <AnimatePresence mode="wait">
                                {status === 'error' && paymentData && (
                                    <motion.div
                                        key="error-actions"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex gap-2"
                                    >
                                        <motion.div
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="flex-1"
                                        >
                                            <Button
                                                onClick={handleVerify}
                                                disabled={loading}
                                                className="w-full hover:text-primary hover:bg-primary/10 hover:border-primary"
                                                variant="outline"
                                            >
                                                <RotateCcw className="w-4 h-4 mr-2" />
                                                Retry Verification
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="flex-1"
                                        >
                                            <Button
                                                onClick={handleGoToProfile}
                                                variant="ghost"
                                                className="w-full"
                                            >
                                                Go to Profile
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <motion.div variants={itemVariants} className="text-center mt-6">
                    <p className="text-xs text-muted-foreground">
                        Having issues? Contact our support team for assistance.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function PaymentVerifyPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex items-center justify-center p-4">
                    <PageLoading />
                </div>
            }
        >
            <PaymentVerifyContent />
        </Suspense>
    );
}
