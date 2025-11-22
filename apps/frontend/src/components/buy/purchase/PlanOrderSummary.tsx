import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Crown, Star, Users, Zap, Calendar, CreditCard, Check, AlertTriangle } from 'lucide-react';
import { Plans } from '@shared/types/pricingTier';
import { OrderSummary } from '@/types/business/purchase';
import { UserDTO } from '@shared/types/user';

interface PlanOrderSummaryProps {
    orderSummary: OrderSummary;
    currentUser?: UserDTO;
}

const planIcons = {
    [Plans.FREE]: Users,
    [Plans.PRO]: Star,
    [Plans.UNLIMITED]: Crown,
    [Plans.ELITE]: Zap,
};

const planColors = {
    [Plans.FREE]: 'bg-gray-100 text-gray-800',
    [Plans.PRO]: 'bg-blue-100 text-blue-800',
    [Plans.UNLIMITED]: 'bg-yellow-100 text-yellow-800',
    [Plans.ELITE]: 'bg-purple-100 text-purple-800',
};

export function PlanOrderSummary({ orderSummary, currentUser }: PlanOrderSummaryProps) {
    const IconComponent = planIcons[orderSummary.name] || Zap;
    const colorClass = planColors[orderSummary.name] || 'bg-gray-100 text-gray-800';

    // Check if user has an active non-free plan
    const hasActiveNonFreePlan = currentUser?.planType && currentUser.planType !== Plans.FREE;
    const showWarning = hasActiveNonFreePlan && orderSummary.name !== Plans.FREE;

    return (
        <div className="space-y-4">
            {/* Warning Banner */}
            {showWarning && (
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                                    Plan Replacement Warning
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                                    <strong>Important:</strong> Purchasing this plan will completely
                                    replace your current{' '}
                                    <strong>{currentUser?.planType?.toUpperCase()}</strong> plan.
                                    Your current plan will be deactivated, and any remaining time on
                                    your current plan will be forfeited.{' '}
                                    <strong>This action cannot be reverted.</strong>
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                                    Please proceed with caution.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Order Summary Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            Prepaid Plan
                        </CardTitle>
                        <Badge className={colorClass}>
                            {orderSummary.name.charAt(0).toUpperCase() + orderSummary.name.slice(1)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Plan Details */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-lg capitalize">
                                {orderSummary.name} Plan
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {orderSummary.description}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Plan Features */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Credits</span>
                            </div>
                            <span className="font-medium">
                                {orderSummary.creditsIncluded === 'unlimited'
                                    ? 'Unlimited'
                                    : orderSummary.creditsIncluded}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Plan Duration</span>
                            </div>
                            <span className="font-medium">
                                {orderSummary.expiryInDays === 'unlimited'
                                    ? 'Lifetime'
                                    : orderSummary.expiryInDays
                                    ? `${orderSummary.expiryInDays} days`
                                    : 'N/A'}
                            </span>
                        </div>

                        {orderSummary.referencePPPCountry && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    PPP Adjusted for
                                </span>
                                <span className="text-sm font-medium">
                                    {orderSummary.referencePPPCountry}
                                </span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Features */}
                    {orderSummary.features && orderSummary.features.length > 0 && (
                        <>
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Plan Features:</h4>
                                <ul className="space-y-2">
                                    {orderSummary.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Pricing */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Plan Price</span>
                            <span>
                                {orderSummary.basePrice} {orderSummary.currency}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Per Credit Cost</span>
                            <span>
                                {orderSummary.creditsIncluded === 'unlimited'
                                    ? 'N/A'
                                    : `${(
                                          orderSummary.basePrice /
                                          (orderSummary.creditsIncluded as number)
                                      ).toFixed(2)} ${orderSummary.currency}`}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total Amount</span>
                        <span className="text-primary">
                            {orderSummary.basePrice} {orderSummary.currency}
                        </span>
                    </div>

                    {/* Benefits callout */}
                    <div className="bg-primary/5 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground text-center">
                            ✨ One-time payment • Instant activation • Credits included
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
