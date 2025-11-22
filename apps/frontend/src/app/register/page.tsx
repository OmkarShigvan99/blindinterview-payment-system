'use client';
import { motion } from 'framer-motion';
import RegisterForm from '@/forms/RegisterForm';
import Image from 'next/image';

export default function RegisterPage() {
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
                            Join Our Platform
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Create your account and start managing your plans
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 pt-6">
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold text-primary mb-2">🚀 Quick Setup</h3>
                            <p className="text-sm text-muted-foreground">
                                Get started in minutes with our streamlined onboarding process
                            </p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold text-primary mb-2">
                                💳 Credit Management
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Powerful tools to track, manage, and optimize your credit usage
                            </p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold text-primary mb-2">
                                🔐 Secure & Reliable
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Enterprise-grade security with reliable performance you can trust
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - Register Form */}
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

                        <RegisterForm />
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
