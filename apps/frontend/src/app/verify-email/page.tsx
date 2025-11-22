'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { AxiosResponse, isAxiosError } from 'axios';
import { API_AUTH_ENDPOINTS } from '@/fetch/endpoints';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Invalid or missing verification token.');
            return;
        }

        const verifyEmail = async () => {
            try {
                setStatus('loading');
                const response: AxiosResponse = await API_AUTH_ENDPOINTS.verifyEmail(token);

                if (response.status === 200) {
                    setStatus('success');
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    setStatus('error');
                    setErrorMessage(err.response?.data?.data?.reason ?? 'Something went wrong.');
                } else {
                    setStatus('error');
                    setErrorMessage('Something went wrong.');
                }
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/20 px-4">
            <div className="w-full max-w-md bg-card border rounded-2xl shadow-md p-8 space-y-6 text-center">
                {status === 'loading' && (
                    <>
                        <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                        </div>
                        <h2 className="text-xl font-semibold">Verifying your email...</h2>
                        <p className="text-sm text-muted-foreground">
                            Please wait while we verify your account.
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Email Verified!</h2>
                        <p className="text-sm text-muted-foreground">
                            Your email has been successfully verified. You can now log in.
                        </p>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button className="w-full mt-4" onClick={() => router.push('/login')}>
                                Go to Login
                            </Button>
                        </motion.div>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex justify-center">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                        <h2 className="text-xl font-semibold text-destructive">
                            Verification Failed
                        </h2>
                        <p className="text-sm text-muted-foreground">{errorMessage}</p>
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button
                                variant="secondary"
                                className="w-full mt-4"
                                onClick={() => router.push('/')}
                            >
                                Back to Home
                            </Button>
                        </motion.div>
                    </>
                )}
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background to-primary/20">
                    <div className="w-full max-w-md rounded-2xl border bg-card shadow-lg p-8">
                        <div className="text-center space-y-4">
                            <LoadingSpinner
                                className="text-primary"
                                size="md"
                                text="Verifying your email..."
                            ></LoadingSpinner>
                        </div>
                    </div>
                </main>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
