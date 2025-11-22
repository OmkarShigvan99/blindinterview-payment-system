'use client';

import { Button } from '@/components/ui/button';
import { SectionContent } from '@/components/home/SectionContent';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';
import { PricingTierDTO } from '@shared/types/pricingTier';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useEffect, useState } from 'react';
import Tag from '@/components/home/Tag';
import { useRouter } from 'next/navigation';

async function getPricingTiers(countryCode: string): Promise<PricingTierDTO[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/pricing-tier/?country=${countryCode}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch pricing tiers');
    }

    const data = await response.json();
    return data.data || data;
}

const getColorClasses = (tierName: string) => {
    switch (tierName) {
        case 'free':
            return {
                titleColor: 'text-yellow-400',
                gradientFrom: 'from-yellow-400/20',
                gradientTo: 'to-yellow-400/5',
                borderColor: 'border-yellow-400/20',
                shadowColor: 'shadow-yellow-400/10',
            };
        case 'pro':
            return {
                titleColor: 'text-blue-400',
                gradientFrom: 'from-blue-400/20',
                gradientTo: 'to-blue-400/5',
                borderColor: 'border-blue-400/20',
                shadowColor: 'shadow-blue-400/10',
            };
        case 'unlimited':
            return {
                titleColor: 'text-primary',
                gradientFrom: 'from-primary/20',
                gradientTo: 'to-primary/5',
                borderColor: 'border-primary/20',
                shadowColor: 'shadow-primary/10',
            };
        case 'elite':
            return {
                titleColor: 'text-purple-400',
                gradientFrom: 'from-purple-400/20',
                gradientTo: 'to-purple-400/5',
                borderColor: 'border-purple-400/20',
                shadowColor: 'shadow-purple-400/10',
            };
        default:
            return {
                titleColor: 'text-primary',
                gradientFrom: 'from-primary/20',
                gradientTo: 'to-primary/5',
                borderColor: 'border-primary/20',
                shadowColor: 'shadow-primary/10',
            };
    }
};

const getPlanDisplayName = (name: string) => {
    switch (name) {
        case 'free':
            return 'Free';
        case 'pro':
            return 'Pro';
        case 'unlimited':
            return 'Unlimited';
        case 'elite':
            return 'Elite';
        default:
            return name.charAt(0).toUpperCase() + name.slice(1);
    }
};

export default function Pricing({
    initialPricingTiers,
}: {
    initialPricingTiers?: PricingTierDTO[];
}) {
    const { countryCode, loading: countryLoading } = useCountryDetection();
    const [pricingTiers, setPricingTiers] = useState<PricingTierDTO[]>(initialPricingTiers || []);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPricingTiers = async () => {
            if (countryLoading) return;

            try {
                // If we have initial pricing and country is US, don't fetch again
                if (initialPricingTiers && countryCode === 'US') {
                    return;
                }

                // We have initial pricing, just show updating indicator
                setIsUpdating(true);

                const tiers = await getPricingTiers(countryCode);
                setPricingTiers(tiers);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch pricing tiers');
            } finally {
                setIsUpdating(false);
            }
        };

        fetchPricingTiers();
    }, [countryCode, countryLoading, initialPricingTiers]);

    // If there's an error, log it but don't show error UI - just continue with current pricing
    if (error) {
        console.warn('Pricing error:', error);
    }

    return (
        <section id="Pricing">
            <div className="container">
                <SectionContent>
                    <div className="flex justify-center mb-6">
                        <Tag>Pricing</Tag>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground text-center">
                        Flexible plans for every need
                    </h2>
                    {isUpdating && (
                        <div className="flex justify-center mt-4">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                Updating prices for your region...
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 lg:items-start">
                        {pricingTiers.map((tier: PricingTierDTO, index: number) => {
                            const colors = getColorClasses(tier.name);
                            const isPopular = tier.name === 'unlimited';
                            const isPremium = tier.name === 'elite';

                            return (
                                <div
                                    key={tier.name}
                                    className={twMerge(
                                        'group relative overflow-hidden transition-all duration-500 ease-out',
                                        'border border-border rounded-3xl px-6 py-12 max-w-sm mx-auto w-full min-h-full',
                                        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
                                        'hover:scale-105 hover:-translate-y-2',
                                        'bg-gradient-to-br from-card/80 via-card to-card/50 backdrop-blur-sm',
                                        isPopular &&
                                            'lg:py-16 ring-2 ring-primary/30 shadow-lg shadow-primary/20',
                                        isPremium &&
                                            'lg:py-16 ring-2 ring-purple-400/30 shadow-lg shadow-purple-400/20',
                                        !isPopular && !isPremium && 'lg:py-12',
                                        isUpdating && 'opacity-75 transition-opacity duration-300',
                                    )}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    {/* Subtle background gradient */}
                                    <div
                                        className={twMerge(
                                            'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                                            'bg-gradient-to-br',
                                            colors.gradientFrom,
                                            colors.gradientTo,
                                        )}
                                    />

                                    {/* Popular badge */}
                                    {isPopular && (
                                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground px-3 py-1 rounded-bl-2xl rounded-tr-3xl text-xs font-semibold">
                                            Best Value
                                        </div>
                                    )}

                                    {/* Premium badge */}
                                    {isPremium && (
                                        <div className="absolute -top-1 -right-1 bg-purple-500 text-white px-3 py-1 rounded-bl-2xl rounded-tr-3xl text-xs font-semibold">
                                            Premium
                                        </div>
                                    )}

                                    {/* Updating indicator */}
                                    {isUpdating && (
                                        <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                    )}

                                    <div className="relative z-10">
                                        <h3
                                            className={twMerge(
                                                'font-semibold text-4xl transition-colors duration-300',
                                                colors.titleColor,
                                            )}
                                        >
                                            {getPlanDisplayName(tier.name)}
                                        </h3>

                                        <p className="mt-4 text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                            {tier.description}
                                        </p>

                                        <div className="mt-8">
                                            {tier.basePrice === 0 ? (
                                                <span className="text-7xl font-semibold text-foreground">
                                                    Free
                                                </span>
                                            ) : (
                                                <div className="flex items-start">
                                                    <span className="text-7xl font-semibold text-foreground">
                                                        {tier.basePrice}
                                                    </span>
                                                    <span className="text-2xl font-medium text-muted-foreground ml-2 mt-2">
                                                        {tier.currency}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Credits and expiry info */}
                                        <div className="mt-4 space-y-1">
                                            <div className="text-sm text-muted-foreground">
                                                {tier.creditsIncluded === 'unlimited'
                                                    ? 'Unlimited credits'
                                                    : `${tier.creditsIncluded} credits included`}
                                            </div>
                                            <div className="text-xs text-muted-foreground/80">
                                                {tier.expiryInDays === 'unlimited'
                                                    ? 'No expiry'
                                                    : `Valid for ${tier.expiryInDays} days`}
                                            </div>
                                        </div>

                                        {tier.basePrice === 0 ? null : (
                                            <Button
                                                className={twMerge(
                                                    'mt-8 w-full transition-all duration-300',
                                                    'group-hover:shadow-lg group-hover:shadow-primary/20',
                                                    'hover:scale-105',
                                                    isPopular && 'bg-primary hover:bg-primary/90',
                                                    isPremium &&
                                                        'bg-purple-500 hover:bg-purple-600',
                                                    tier.name === 'free' &&
                                                        'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0',
                                                    tier.name === 'pro' &&
                                                        'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0',
                                                )}
                                                variant={
                                                    tier.name === 'free' || tier.name === 'pro'
                                                        ? 'default'
                                                        : isPopular || isPremium
                                                          ? 'default'
                                                          : 'outline'
                                                }
                                                disabled={isUpdating}
                                                onClick={() => router.push('/buy')}
                                            >
                                                {tier.basePrice === 0
                                                    ? 'Get Started Free'
                                                    : tier.name === 'elite'
                                                      ? 'Go Premium'
                                                      : 'Choose Plan'}
                                            </Button>
                                        )}

                                        <ul className="flex flex-col gap-4 mt-8">
                                            {tier.features.map(
                                                (feature: string, featureIndex: number) => (
                                                    <li
                                                        key={`${feature}-${featureIndex}`}
                                                        className="flex gap-4 pt-4 border-t border-border/50 group-hover:border-border transition-colors duration-300"
                                                        style={{
                                                            animationDelay: `${
                                                                index * 100 + featureIndex * 50
                                                            }ms`,
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faCheckCircle}
                                                            className={twMerge(
                                                                'size-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300',
                                                                isPopular && 'text-primary',
                                                                isPremium && 'text-purple-400',
                                                                tier.name === 'free' &&
                                                                    'text-yellow-400',
                                                                tier.name === 'pro' &&
                                                                    'text-blue-400',
                                                            )}
                                                        />
                                                        <span className="font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionContent>
            </div>
        </section>
    );
}
