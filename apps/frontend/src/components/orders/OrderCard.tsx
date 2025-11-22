import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Coins,
    Crown,
    Calendar,
    CreditCard,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderDTO, OrderStatus, OrderType } from '@shared/types/order';
import { Plans } from '@shared/types/pricingTier';

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

const statusColors = {
    [OrderStatus.CREATED]:
        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800',
    [OrderStatus.PAID]:
        'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800',
    [OrderStatus.FAILED]:
        'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800',
    [OrderStatus.REFUNDED]: 'bg-muted text-muted-foreground border-border',
};

const statusIcons = {
    [OrderStatus.CREATED]: Clock,
    [OrderStatus.PAID]: CheckCircle2,
    [OrderStatus.FAILED]: XCircle,
    [OrderStatus.REFUNDED]: RefreshCw,
};

const planColors = {
    [Plans.FREE]: 'bg-muted text-muted-foreground',
    [Plans.PRO]: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-100',
    [Plans.UNLIMITED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
    [Plans.ELITE]: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-100',
};

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatCurrency(amount: number, currency: string) {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
}

interface OrderCardProps {
    order: OrderDTO;
    index: number;
    paymentLoading: boolean;
    onPayNow: (order: OrderDTO) => void;
}

export function OrderCard({ order, index, paymentLoading, onPayNow }: OrderCardProps) {
    const StatusIcon = statusIcons[order.status];
    const isSubscription = order.type === OrderType.PLAN;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
        >
            <Card className="p-3 sm:p-6 border shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <div className="space-y-3">
                    {/* Mobile-First Order Header */}
                    <div className="space-y-3">
                        {/* Top Row: Plan/Credits + Status */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                {isSubscription ? (
                                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                                ) : (
                                    <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                                        {isSubscription
                                            ? `${order.planType?.charAt(0).toUpperCase()}${order.planType?.slice(1)} Plan`
                                            : `${order.credits} Credits`}
                                    </h3>
                                    {isSubscription && order.planType && (
                                        <Badge
                                            className={`${planColors[order.planType]} text-xs mt-1`}
                                            variant="secondary"
                                        >
                                            {order.planType.toUpperCase()}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`flex items-center gap-1 text-xs flex-shrink-0 ${statusColors[order.status]}`}
                            >
                                <StatusIcon className="w-3 h-3" />
                                <span className="hidden xs:inline">
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </Badge>
                        </div>

                        {/* Second Row: Price + Date */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="text-lg sm:text-xl font-bold text-foreground">
                                {formatCurrency(order.amount, order.currency)}
                            </div>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="hidden xs:inline">
                                    {formatDate(order.createdAt)}
                                </span>
                                <span className="xs:hidden">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Compact Order Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-medium">Order ID</p>
                            <p className="font-mono text-foreground break-all">
                                {order.id.slice(-8)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground font-medium">Method</p>
                            <div className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                                <p className="font-medium text-foreground capitalize truncate">
                                    {order.provider}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                            <p className="text-muted-foreground font-medium">Type</p>
                            <p className="font-medium text-foreground">
                                {order.type === OrderType.PLAN ? 'Subscription' : 'Credits'}
                            </p>
                        </div>
                    </div>
                    {/* Pay Now Button for Created Orders */}
                    {order.status === OrderStatus.CREATED && order.gatewayData && (
                        <div className="pt-3">
                            <motion.div
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                className="w-full"
                            >
                                <Button
                                    onClick={() => onPayNow(order)}
                                    disabled={paymentLoading}
                                    className="w-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    {paymentLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span className="hidden sm:inline">
                                                Processing Payment...
                                            </span>
                                            <span className="sm:hidden">Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            <span className="hidden sm:inline">Pay Now</span>
                                            <span className="sm:hidden">Pay</span>
                                            <div className="ml-2 bg-white/20 rounded-full px-2 py-1 text-xs">
                                                {formatCurrency(order.amount, order.currency)}
                                            </div>
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </Card>
        </motion.div>
    );
}
