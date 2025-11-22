'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    UserPlus,
    Mail,
    Lock,
    User,
    ArrowRight,
    CheckCircle2,
    ArrowLeft,
    Home,
    ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { ErrorAlert, ButtonLoading } from '@/components/ui/global';
import { PasswordInput } from '@/components/ui/password-input';
import { userRegistrationSchema } from '@shared/schemas/user.schema';
import { AxiosResponse, isAxiosError } from 'axios';
import { API_AUTH_ENDPOINTS } from '@/fetch/endpoints';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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

type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
    acceptedPrivacyPolicy: boolean;
};

export default function RegisterForm() {
    const router = useRouter();
    const [emailSent, setEmailSent] = useState({
        email: '',
        success: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(userRegistrationSchema),
        mode: 'onChange', // Enable real-time validation
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptedTerms: false,
            acceptedPrivacyPolicy: false,
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            setError(null);
            setLoading(true);
            const response: AxiosResponse = await API_AUTH_ENDPOINTS.register({
                name: values.name,
                email: values.email,
                password: values.password,
                confirmPassword: values.confirmPassword,
                acceptedTerms: values.acceptedTerms,
                acceptedPrivacyPolicy: values.acceptedPrivacyPolicy,
            });
            if (response.status === 201) {
                setEmailSent({
                    email: values.email,
                    success: true,
                });
                form.reset({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    acceptedTerms: false,
                    acceptedPrivacyPolicy: false,
                });
                toast.success('Registration successful.');
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
                        <UserPlus className="w-6 h-6 text-primary" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold">Create your account</h1>
                <p className="text-muted-foreground">Join us today and start your journey</p>
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
                                A verification email has been sent to {emailSent.email}.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ErrorAlert message={error} title="Registration Error" />
                </motion.div>
            )}

            {!emailSent.success && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="border-2 border-accent/20">
                        <CardHeader>
                            <CardTitle className="text-lg">Sign Up</CardTitle>
                            <CardDescription>Create your account to get started</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Full Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your full name"
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
                                                        placeholder="Create a secure password"
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
                                                <FormLabel className="flex items-center gap-2">
                                                    <Lock className="w-4 h-4" />
                                                    Confirm Password
                                                </FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        placeholder="Confirm your password"
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
                                        name="acceptedTerms"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id="acceptedTerms"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        disabled={loading}
                                                        className="mt-1 h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <div className="space-y-1 leading-none">
                                                        <label
                                                            htmlFor="acceptedTerms"
                                                            className="text-sm font-medium cursor-pointer"
                                                        >
                                                            I accept the Terms and Conditions
                                                        </label>
                                                        <p className="text-xs text-muted-foreground">
                                                            By creating an account, you agree to our{' '}
                                                            <Link
                                                                href="/terms"
                                                                target="_blank"
                                                                className="text-primary hover:underline inline-flex items-center gap-1"
                                                            >
                                                                Terms and Conditions
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="acceptedPrivacyPolicy"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3">
                                                <div className="flex items-start space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id="acceptedPrivacyPolicy"
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        disabled={loading}
                                                        className="mt-1 h-4 w-4 rounded border border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <div className="space-y-1 leading-none">
                                                        <label
                                                            htmlFor="acceptedPrivacyPolicy"
                                                            className="text-sm font-medium cursor-pointer"
                                                        >
                                                            I accept the Privacy Policy
                                                        </label>
                                                        <p className="text-xs text-muted-foreground">
                                                            Please read and accept our{' '}
                                                            <Link
                                                                href="/privacy"
                                                                target="_blank"
                                                                className="text-primary hover:underline inline-flex items-center gap-1"
                                                            >
                                                                Privacy Policy
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </div>
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
                                                <ButtonLoading text="Creating Account..." />
                                            ) : (
                                                <>
                                                    Create Account
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
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
            >
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
