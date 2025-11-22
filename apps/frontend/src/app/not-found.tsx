'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Prevent hydration mismatch
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* 404 Number with glow effect */}
                <div className="relative mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text animate-pulse">
                        404
                    </h1>
                    {/* Glow effect */}
                    <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-primary/20 blur-2xl -z-10 animate-pulse">
                        404
                    </div>
                </div>

                {/* Error message card */}
                <Card className="p-8 backdrop-blur-sm bg-card/80 border-primary/20 shadow-2xl">
                    <div className="space-y-6">
                        {/* Icon */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <Zap className="w-16 h-16 text-primary animate-bounce" />
                                <div className="absolute inset-0 w-16 h-16 text-primary/30 blur-xl animate-pulse">
                                    <Zap className="w-16 h-16" />
                                </div>
                            </div>
                        </div>

                        {/* Title and description */}
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                Oops! Page Not Found
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                The page you&apos;re looking for seems to have vanished into the
                                digital void. Don&apos;t worry, it happens to the best of us!
                            </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto group hover:scale-105 transition-transform"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Go Back
                            </Button>

                            <Link href="/" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full group hover:scale-105 transition-transform bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25"
                                >
                                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>

                        {/* Additional help */}
                        <div className="pt-6 border-t border-border/50">
                            <p className="text-sm text-muted-foreground mb-4">
                                Can&apos;t find what you&apos;re looking for?
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Link href="/profile">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:text-primary"
                                    >
                                        Profile
                                    </Button>
                                </Link>
                                <Link href="/buy">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:text-primary"
                                    >
                                        Buy Credits
                                    </Button>
                                </Link>
                                <Link href="/orders">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:text-primary"
                                    >
                                        Orders
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Fun animation elements */}
                <div className="absolute top-10 left-10 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
                <div className="absolute bottom-10 right-10 w-6 h-6 bg-accent/30 rounded-full animate-ping delay-500" />
                <div className="absolute top-1/2 left-5 w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-1000" />
                <div className="absolute top-1/3 right-5 w-3 h-3 bg-accent/50 rounded-full animate-pulse delay-700" />
            </div>
        </div>
    );
}
