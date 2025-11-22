'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, ArrowRight } from 'lucide-react';

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorAlert, ButtonLoading } from '@/components/ui/global';
import { PasswordInput } from '@/components/ui/password-input';
import { API_AUTH_ENDPOINTS } from '@/fetch/endpoints';
import { resetPasswordSchema } from '@shared/schemas/user.schema';
import { isAxiosError } from 'axios';

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

type ResetPasswordValues = {
    newPassword: string;
    confirmPassword: string;
};

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: ResetPasswordValues) => {
        setError(null);
        setLoading(true);

        if (!token) {
            setError('Invalid or missing token');
            setLoading(false);
            return;
        }

        try {
            const response = await API_AUTH_ENDPOINTS.resetPassword({
                token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });

            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (err) {
            if (isAxiosError(err))
                setError(err.response?.data?.data?.reason ?? 'Something went wrong.');
            else setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

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
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold">Reset your password</h1>
                <p className="text-sm text-muted-foreground">
                    Enter a new password to regain access to your account.
                </p>
            </motion.div>

            {error && <ErrorAlert message={error} title="Password Reset Error" />}

            {success && (
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
                                Password reset successful!
                            </CardTitle>
                            <CardDescription className="text-green-700 dark:text-green-300">
                                You can now log in with your new password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="w-full"
                                    size="lg"
                                >
                                    Continue to Login
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {!success && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">New Password</CardTitle>
                            <CardDescription>
                                Choose a strong password for your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        placeholder="Enter your new password"
                                                        disabled={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        placeholder="Confirm your new password"
                                                        disabled={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                                <ButtonLoading text="Resetting..." />
                                            ) : (
                                                'Reset Password'
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
