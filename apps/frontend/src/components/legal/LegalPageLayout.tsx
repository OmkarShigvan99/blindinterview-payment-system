'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface LegalPageLayoutProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
    breadcrumbs?: Array<{ label: string; href: string }>;
}

export default function LegalPageLayout({
    title,
    lastUpdated,
    children,
    breadcrumbs = [],
}: LegalPageLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
            {/* Background effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(180,255,100,0.08),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(150,255,120,0.06),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,255,80,0.03),transparent_80%)] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="container py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3">
                                <Image
                                    src="/assets/ui-icons/logo.svg"
                                    alt="Blind Interview Logo"
                                    width={160}
                                    height={26}
                                />
                            </Link>
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Link href="/">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 hover:text-primary hover:bg-primary/10 hover:border-primary"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Home
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container py-8 md:py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Breadcrumbs */}
                        {breadcrumbs.length > 0 && (
                            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                                <Link href="/" className="hover:text-primary transition-colors">
                                    Home
                                </Link>
                                {breadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <ChevronRight className="h-3 w-3" />
                                        <Link
                                            href={crumb.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    </div>
                                ))}
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-foreground">{title}</span>
                            </nav>
                        )}

                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-8 md:mb-12"
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                {title}
                            </h1>
                            {lastUpdated && (
                                <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                            )}
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-card border rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg"
                        >
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
