'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
        const router = useRouter();
        const { user } = useAuth();

        const handleLogin = () => {
            router.replace(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
        };

        if (!user.id) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
                    <div className="w-full max-w-md">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-xl animate-pulse delay-700"></div>
                        </div>

                        <Card className="relative backdrop-blur-sm bg-background/95 shadow-2xl border border-border/50 hover:shadow-3xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4">
                            <CardHeader className="text-center pb-4">
                                {/* Icon with animation */}
                                <div className="mx-auto mb-4 relative">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-in zoom-in-50 duration-700 delay-200">
                                        <Shield className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center">
                                        <Lock className="w-3 h-3 text-destructive" />
                                    </div>
                                </div>

                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-in slide-in-from-top-2 duration-700 delay-300">
                                    Authentication Required
                                </CardTitle>

                                <p className="text-sm text-muted-foreground mt-2 animate-in slide-in-from-top-2 duration-700 delay-400">
                                    Secure access to protected content
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-6 pt-2">
                                {/* Message with better styling */}
                                <div className="text-center space-y-2 animate-in fade-in-0 duration-700 delay-500">
                                    <p className="text-muted-foreground leading-relaxed">
                                        This page contains protected content that requires
                                        authentication.
                                    </p>
                                    <p className="text-sm text-muted-foreground/80">
                                        Please log in to continue with your secure session.
                                    </p>
                                </div>

                                {/* Enhanced button */}
                                <Button
                                    onClick={handleLogin}
                                    className="w-full group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300 animate-in slide-in-from-bottom-2 delay-600"
                                    size="lg"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Login to Continue
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Button>

                                {/* Additional info */}
                                <div className="text-center animate-in fade-in-0 duration-700 delay-700">
                                    <p className="text-xs text-muted-foreground/60">
                                        You&apos;ll be redirected back here after login
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional security indicator */}
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground/60 animate-in fade-in-0 duration-1000 delay-800">
                            <Shield className="w-3 h-3" />
                            <span>Secured by BlindInterview</span>
                        </div>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
}
