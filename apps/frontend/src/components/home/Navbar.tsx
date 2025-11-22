'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UserNav from '@/components/home/UserNav';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
    { label: 'Home', href: '#', id: 'Home' },
    { label: 'Features', href: '#features', id: 'Features' },
    { label: 'How to Use', href: '#tutorial', id: 'Tutorial' },
    { label: 'Demo', href: '/demo', id: 'Demo', external: true },
    { label: 'Pricing', href: '#pricing', id: 'Pricing' },
    { label: 'FAQs', href: '#FAQs', id: 'FAQs' },
];

// Scroll till ID or navigate to external link
interface HandleScrollToProps {
    id: string;
    href?: string;
    external?: boolean;
}

const handleScrollTo = ({ id, href, external }: HandleScrollToProps) => {
    if (external && href) {
        window.location.href = href;
        return;
    }

    const element = document.getElementById(id);
    if (element) {
        const yOffset = -100;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
};

export default function Navbar() {
    const { user } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Simple Floating Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-4">
                <div className="max-w-6xl mx-auto">
                    <div
                        className={cn(
                            'bg-background/80 backdrop-blur border border-border/50',
                            'rounded-2xl md:rounded-full shadow-lg',
                            'transition-all duration-200',
                        )}
                    >
                        <div className="flex items-center justify-between p-3 md:p-4 px-4 md:px-6">
                            {/* Logo */}
                            <div className="flex items-center">
                                <Image
                                    src="/assets/ui-icons/logo.svg"
                                    alt="logo"
                                    className="h-8 md:h-9 w-auto"
                                    width={32}
                                    height={32}
                                />
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-6">
                                {navLinks.map(({ label, id, href, external }, index) => {
                                    // Hide Demo link on medium devices (show only on large devices)
                                    if (label === 'Demo') {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    handleScrollTo({ id, href, external })
                                                }
                                                className="hidden lg:block text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-primary/10"
                                            >
                                                {label}
                                            </button>
                                        );
                                    }
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleScrollTo({ id, href, external })}
                                            className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors px-3 py-2 rounded-full hover:bg-primary/10"
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Side */}
                            <div className="flex items-center gap-3">
                                {/* Mobile Menu Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="md:hidden w-9 h-9 p-0 rounded-full"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="w-4 h-4" />
                                    ) : (
                                        <Menu className="w-4 h-4" />
                                    )}
                                </Button>

                                {/* Auth Buttons / User Nav */}
                                {user.isAuthenticated ? (
                                    <UserNav user={user} />
                                ) : (
                                    <div className="hidden md:flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full font-semibold"
                                            onClick={() => router.push('/login')}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="rounded-full font-semibold"
                                            onClick={() => router.push('/register')}
                                        >
                                            Get Started
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute top-25 left-4 right-4 bg-background border border-border rounded-2xl shadow-xl p-4">
                        {/* Navigation Links */}
                        <div className="space-y-2">
                            {navLinks.map(({ label, id, href, external }, index) => {
                                // Hide Demo link on small and medium devices
                                if (label === 'Demo') {
                                    return null;
                                }
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            handleScrollTo({ id, href, external });
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left p-3 rounded-xl hover:bg-primary/10 transition-colors font-medium"
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Auth Buttons for Mobile */}
                        {!user.isAuthenticated && (
                            <div className="pt-4 mt-4 border-t border-border space-y-2">
                                <Button
                                    variant="ghost"
                                    className="w-full rounded-xl"
                                    onClick={() => {
                                        router.push('/login');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    className="w-full rounded-xl"
                                    onClick={() => {
                                        router.push('/register');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Get Started
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Spacer */}
            <div className="h-16 md:h-20" />
        </>
    );
}
