'use client';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '@/forms/LoginForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Image from 'next/image';
// import CompanyLogo from '@/assets/icons/CompanyLogo';

function LoginContent() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
                {/* Left side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden lg:flex flex-col justify-center space-y-6 pl-8"
                >
                    <div className="flex items-center space-x-4">
                        <Image
                            src="/assets/ui-icons/logo.svg"
                            alt="logo"
                            className=""
                            width={200}
                            height={32}
                        />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-extrabold text-foreground leading-tight">
                            Welcome Back
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Sign in to continue managing your credits and exploring our platform
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold text-primary mb-2">Secure Access</h3>
                            <p className="text-sm text-muted-foreground">
                                Your data is protected with enterprise-grade security
                            </p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold text-primary mb-2">Easy Management</h3>
                            <p className="text-sm text-muted-foreground">
                                Intuitive dashboard for all your credit operations
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center lg:justify-end"
                >
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="flex items-center space-x-3">
                                <Image
                                    src="/assets/ui-icons/logo.svg"
                                    alt="logo"
                                    className=""
                                    width={200}
                                    height={32}
                                />
                            </div>
                        </div>

                        <LoginForm />
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

const LoginPage = () => {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-2xl border bg-card shadow-lg p-8">
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    </div>
                </main>
            }
        >
            <LoginContent />
        </Suspense>
    );
};

export default LoginPage;
