import CallToAction from '@/components/home/CallToAction';
import Downloads from '@/components/home/Downloads';
import Faqs from '@/components/home/Faqs';
import Features from '@/components/home/Features';
import Footer from '@/components/home/Footer';
import Hero from '@/components/home/Hero';
import Integrations from '@/components/home/Integrations';
import Introduction from '@/components/home/Introduction';
import KeyboardTutorial from '@/components/home/KeyboardTutorial';
import LogoTicker from '@/components/home/LogoTicker';
import Navbar from '@/components/home/Navbar';
import Pricing from '@/components/home/Pricing';
import React from 'react';
import { getServerSideUSPricing } from '@/lib/server-pricing';

const page = async () => {
    // Fetch US pricing on server side
    const initialPricingTiers = await getServerSideUSPricing();
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
            {/* Neon lime glow effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(180,255,100,0.08),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(150,255,120,0.06),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,255,80,0.03),transparent_80%)] pointer-events-none" />

            {/* Subtle animated glow */}
            <div className="fixed inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(180,255,100,0.02)_60deg,transparent_120deg)] animate-pulse pointer-events-none" />

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <LogoTicker />
                <Introduction />
                <Features />
                <KeyboardTutorial />
                <Pricing initialPricingTiers={initialPricingTiers} />
                <Integrations />
                <Faqs />
                <Downloads />
                <CallToAction />
                <Footer />
            </div>
        </div>
    );
};

export default page;
