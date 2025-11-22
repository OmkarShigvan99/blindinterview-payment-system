import { Check, Package, Zap, Crown, Star, Sparkles, Award, Infinity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PricingTierDTO, Plans } from '@shared/types/pricingTier';
import { motion } from 'framer-motion';

interface PlanSelectionProps {
    pricingTiers: PricingTierDTO[];
    selectedPlan: PricingTierDTO | null;
    onPlanSelect: (plan: PricingTierDTO) => void;
    isLoading?: boolean;
}

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    [Plans.PRO]: Star,
    [Plans.UNLIMITED]: Crown,
    [Plans.ELITE]: Zap,
};

const planColors: Record<string, string> = {
    [Plans.PRO]: 'from-blue-500 to-blue-600',
    [Plans.UNLIMITED]: 'from-purple-500 to-purple-600',
    [Plans.ELITE]: 'from-yellow-500 to-yellow-600',
};

const planAccents: Record<string, string> = {
    [Plans.PRO]: 'border-blue-200 bg-blue-50 text-blue-700',
    [Plans.UNLIMITED]: 'border-purple-200 bg-purple-50 text-purple-700',
    [Plans.ELITE]: 'border-yellow-200 bg-yellow-50 text-yellow-700',
};

export function PlanSelection({
    pricingTiers,
    selectedPlan,
    onPlanSelect,
    isLoading,
}: PlanSelectionProps) {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-8 bg-muted rounded w-16"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded"></div>
                                <div className="h-4 bg-muted rounded w-24"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Filter out FREE plan from purchase options
    const availablePlans = pricingTiers.filter((tier) => tier.name !== Plans.FREE);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availablePlans.map((tier) => {
                const IconComponent = planIcons[tier.name] || Package;
                const isSelected = selectedPlan?.name === tier.name;
                const gradientClass = planColors[tier.name] || 'from-gray-500 to-gray-600';
                const accentClass =
                    planAccents[tier.name] || 'border-gray-200 bg-gray-50 text-gray-700';
                const isPopular = tier.name === Plans.UNLIMITED;

                return (
                    <motion.div
                        key={tier.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative"
                    >
                        {isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                                <Badge
                                    className={`${accentClass} font-semibold px-3 py-1 shadow-lg`}
                                >
                                    Most Popular
                                </Badge>
                            </div>
                        )}

                        <Card
                            className={`cursor-pointer transition-all duration-300 hover:shadow-xl relative overflow-hidden h-full ${
                                isSelected
                                    ? 'ring-2 ring-primary border-primary shadow-lg'
                                    : 'border-border hover:border-primary/50'
                            } ${isPopular ? 'border-2 border-purple-200' : ''}`}
                            onClick={() => onPlanSelect(tier)}
                        >
                            {/* Background gradient overlay */}
                            <div
                                className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${gradientClass} opacity-5`}
                            />

                            <CardHeader className="pb-4 relative">
                                <div className="flex items-center justify-between">
                                    <div
                                        className={`p-3 rounded-full bg-gradient-to-br ${gradientClass} shadow-lg`}
                                    >
                                        <IconComponent className="h-6 w-6 text-white" />
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-primary text-primary-foreground rounded-full p-1"
                                        >
                                            <Check className="h-4 w-4" />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <CardTitle className="text-xl capitalize flex items-center gap-2">
                                        {tier.name}
                                        {tier.creditsIncluded === 'unlimited' && (
                                            <Infinity className="h-5 w-5 text-primary" />
                                        )}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {tier.description}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Pricing */}
                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold">{tier.basePrice}</span>
                                        <span className="text-lg text-muted-foreground">
                                            {tier.currency}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {tier.expiryInDays === 'unlimited'
                                            ? 'One-time payment'
                                            : `Valid for ${tier.expiryInDays} days`}
                                    </p>
                                </div>

                                {/* Credits */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span className="font-medium">
                                            {tier.creditsIncluded === 'unlimited'
                                                ? 'Unlimited Credits'
                                                : `${tier.creditsIncluded} Credits`}
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                {tier.features && tier.features.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm flex items-center gap-2">
                                            <Award className="h-4 w-4 text-primary" />
                                            What&apos;s included:
                                        </h4>
                                        <ul className="space-y-2">
                                            {tier.features.slice(0, 5).map((feature, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-start gap-2 text-sm"
                                                >
                                                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="leading-relaxed">
                                                        {feature}
                                                    </span>
                                                </motion.li>
                                            ))}
                                            {tier.features.length > 5 && (
                                                <li className="text-sm text-muted-foreground">
                                                    + {tier.features.length - 5} more features
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Action indicator */}
                                <div className="pt-4 border-t border-border">
                                    <motion.div
                                        className={`text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : `${accentClass}`
                                        }`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSelected ? 'Selected' : 'Select Plan'}
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
