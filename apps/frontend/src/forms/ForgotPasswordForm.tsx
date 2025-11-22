'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ErrorAlert, ButtonLoading } from '@/components/ui/global';
import { AxiosResponse, isAxiosError } from 'axios';
import { API_AUTH_ENDPOINTS } from '@/fetch/endpoints';

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

const forgotPasswordSchema = z.object({
    email: z.string().email('Enter a valid email'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
    const [emailSent, setEmailSent] = useState({
        email: '',
        success: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: { email: '' },
    });

    const onSubmit = async (values: ForgotPasswordValues) => {
        try {
            setError(null);
            setLoading(true);
            const response: AxiosResponse = await API_AUTH_ENDPOINTS.sendPasswordResetEmail({
                email: values.email,
            });

            if (response.status === 200) {
                setLoading(false);
                setEmailSent({ email: values.email, success: true });
                setResendTimer(60);
            }
        } catch (err) {
            if (isAxiosError(err))
                setError(err.response?.data?.data?.reason ?? 'Something went wrong.');
            else setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Countdown timer effect
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer((t) => t - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2 text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold">Forgot your password?</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </motion.div>

            {emailSent.success && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="text-green-800 dark:text-green-200">
                                Check your inbox
                            </CardTitle>
                            <CardDescription className="text-green-700 dark:text-green-300">
                                If an account exists for that email ({emailSent.email}), you&apos;ll
                                receive a reset link shortly.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>
            )}

            {error && <ErrorAlert message={error} title="Password Reset Error" />}

            {!emailSent.success && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Reset Password</CardTitle>
                            <CardDescription>
                                We&apos;ll send you a secure link to reset your password
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="you@example.com"
                                                        type="email"
                                                        disabled={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex flex-col gap-3">
                                        <motion.div
                                            variants={buttonVariants}
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                size="lg"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <ButtonLoading text="Sending..." />
                                                ) : (
                                                    'Send Reset Link'
                                                )}
                                            </Button>
                                        </motion.div>

                                        <Link href="/login">
                                            <motion.div
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    className="w-full"
                                                    type="button"
                                                >
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                    Back to login
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {emailSent.success && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center"
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Didn&apos;t receive the email? Check your spam folder or try
                                    again.
                                </p>
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        onClick={() => {
                                            setEmailSent({ email: '', success: false });
                                            form.reset();
                                            setError(null);
                                        }}
                                        variant="outline"
                                        className="w-full hover:text-primary hover:bg-primary/10 hover:border-primary"
                                        disabled={resendTimer > 0}
                                    >
                                        {resendTimer > 0
                                            ? `Resend in ${resendTimer}s`
                                            : 'Try Again'}
                                    </Button>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
