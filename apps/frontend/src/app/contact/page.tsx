'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, HelpCircle, CreditCard, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
};

const contactReasons = [
    {
        label: 'Technical Support',
        icon: HelpCircle,
        description: 'Get help with platform issues, bugs, or technical difficulties',
    },
    {
        label: 'Billing & Payments',
        icon: CreditCard,
        description: 'Questions about payments, credits, or subscription issues',
    },
    {
        label: 'Feedback & Suggestions',
        icon: MessageSquare,
        description: 'Share your thoughts on how we can improve the platform',
    },
    {
        label: 'Partnership Inquiry',
        icon: Mail,
        description: 'Business partnerships and collaboration opportunities',
    },
];

export default function ContactPage() {
    const [emailCopied, setEmailCopied] = useState(false);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText('team@blindinterview.com');
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
            {/* Background effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(180,255,100,0.08),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(150,255,120,0.06),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,255,80,0.03),transparent_80%)] pointer-events-none" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="container py-3 md:py-4 px-4 md:px-6">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center space-x-3">
                                <Image
                                    src="/assets/ui-icons/logo.svg"
                                    alt="Blind Interview Logo"
                                    width={140}
                                    height={22}
                                    className="md:w-[160px] md:h-[26px]"
                                />
                            </Link>
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                <Link href="/">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 text-sm hover:text-primary hover:bg-primary/10 hover:border-primary"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Back to Home</span>
                                        <span className="sm:hidden">Back</span>
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container py-6 md:py-8 lg:py-12 px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-8 md:mb-12"
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">
                                Get in Touch
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                                Have questions about our AI-powered interview platform? Contact
                                BlindInterview for customer service, partnership, or general
                                inquiries. We aim to respond within 24–48 business hours.
                            </p>
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-8 md:mb-12 px-4"
                        >
                            <Card className="max-w-2xl mx-auto shadow-lg">
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">Contact Us via Email</CardTitle>
                                    <CardDescription className="text-lg">
                                        Send us an email and we&apos;ll get back to you within 24-48
                                        hours
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-6">
                                    <div className="p-4 md:p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
                                        <p className="text-xl md:text-2xl font-bold text-primary mb-4 break-all">
                                            team@blindinterview.com
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <motion.div
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button
                                                    onClick={() =>
                                                        window.open(
                                                            'mailto:team@blindinterview.com',
                                                            '_blank',
                                                        )
                                                    }
                                                    className="gap-2 w-full sm:w-auto hover:text-primary-foreground hover:bg-primary/90"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    Send Email
                                                </Button>
                                            </motion.div>
                                            <motion.div
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                            >
                                                <Button
                                                    variant="outline"
                                                    onClick={copyEmail}
                                                    className="gap-2 w-full sm:w-auto hover:text-primary hover:bg-primary/10 hover:border-primary"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                    {emailCopied ? 'Copied!' : 'Copy Email'}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Include details about your inquiry, and we&apos;ll respond
                                        as quickly as possible.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact Reasons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mb-8 md:mb-12 px-4"
                        >
                            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">
                                What can we help you with?
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {contactReasons.map((reason, index) => {
                                    const IconComponent = reason.icon;
                                    return (
                                        <Card
                                            key={index}
                                            className="hover:shadow-lg transition-shadow"
                                        >
                                            <CardHeader className="text-center">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <IconComponent className="h-6 w-6 text-primary" />
                                                </div>
                                                <CardTitle className="text-lg">
                                                    {reason.label}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="text-center">
                                                <CardDescription>
                                                    {reason.description}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Business Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12 px-4"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Business Information</CardTitle>
                                    <CardDescription>
                                        Our company details and contact information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                            COMPANY NAME
                                        </h4>
                                        <p className="font-medium">BlindInterview</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                            EMAIL
                                        </h4>
                                        <p className="font-medium text-primary">
                                            team@blindinterview.com
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                            RESPONSE TIME
                                        </h4>
                                        <p className="font-medium">Within 24-48 hours</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                            BUSINESS HOURS
                                        </h4>
                                        <p className="font-medium">Monday - Friday</p>
                                        <p className="text-sm text-muted-foreground">
                                            9:00 AM - 6:00 PM (Your local time)
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Frequently Asked Questions</CardTitle>
                                    <CardDescription>
                                        Quick answers to common questions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            How does BlindInterview work?
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Our AI-powered platform conducts unbiased interviews by
                                            focusing on skills and qualifications rather than
                                            personal characteristics.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">
                                            What payment methods do you accept?
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            We accept all major credit cards and digital payment
                                            methods through our secure payment partners.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Yes, please check our{' '}
                                            <Link
                                                href="/refund-policy"
                                                className="text-primary hover:underline"
                                            >
                                                refund policy
                                            </Link>{' '}
                                            for detailed information.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mt-8 md:mt-12"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Need Something Specific?</CardTitle>
                                    <CardDescription>
                                        Quick links to common resources and information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Link href="/terms" className="group">
                                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow group-hover:border-primary">
                                                <h4 className="font-semibold mb-2 group-hover:text-primary">
                                                    Terms & Conditions
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Service terms and user agreements
                                                </p>
                                            </div>
                                        </Link>
                                        <Link href="/privacy" className="group">
                                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow group-hover:border-primary">
                                                <h4 className="font-semibold mb-2 group-hover:text-primary">
                                                    Privacy Policy
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    How we protect your data
                                                </p>
                                            </div>
                                        </Link>
                                        <Link href="/refund-policy" className="group">
                                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow group-hover:border-primary">
                                                <h4 className="font-semibold mb-2 group-hover:text-primary">
                                                    Refund Policy
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Cancellation and refund terms
                                                </p>
                                            </div>
                                        </Link>
                                        <Link href="/#pricing" className="group">
                                            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow group-hover:border-primary">
                                                <h4 className="font-semibold mb-2 group-hover:text-primary">
                                                    Pricing
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    View our credit packages
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
