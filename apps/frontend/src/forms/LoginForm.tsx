'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight, ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { userLoginSchema } from '@shared/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorAlert, ButtonLoading } from '@/components/ui/global';
import { AxiosResponse, isAxiosError } from 'axios';
import { API_AUTH_ENDPOINTS } from '@/fetch/endpoints';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { UserDTO } from '@shared/types/user';

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

type LoginFormValues = {
    email: string;
    password: string;
    onError?: (error: string) => void;
};

export const LoginForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(userLoginSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const router = useRouter();
    const { setLocalUser } = useAuth();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo');

    const onSubmit = async (values: LoginFormValues) => {
        try {
            setError(null);
            setLoading(true);
            const response: AxiosResponse = await API_AUTH_ENDPOINTS.login({
                email: values.email,
                password: values.password,
            });

            if (response.status === 200) {
                toast.success('Logged in successfully.');
                const user = response.data.data as UserDTO;
                user.isAuthenticated = true;
                setLocalUser(user);
                router.push(redirectTo ?? '/profile');
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
            {/* Back to Home Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
            >
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 hover:text-primary hover:bg-primary/10 hover:border-primary"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <Home className="w-4 h-4" />
                        Home
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-2"
            >
                <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="text-muted-foreground">Sign in to your account to continue</p>
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ErrorAlert message={error} title="Login Error" />
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="border-2 border-accent/20">
                    <CardHeader>
                        <CardTitle className="text-lg">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
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
                                            <FormLabel className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </FormLabel>
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

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                Password
                                            </FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="••••••••"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <Link
                                            href="/forgot-password"
                                            className="text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        type="submit"
                                        className="w-full text-background"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ButtonLoading
                                                text="Signing in..."
                                                className="text-background"
                                            />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
            >
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};
