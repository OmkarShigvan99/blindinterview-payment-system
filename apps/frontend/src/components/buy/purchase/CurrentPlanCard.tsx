import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserDTO } from '@shared/types/user';
import { Plans } from '@shared/types/pricingTier';
import { motion } from 'framer-motion';
import {
    Crown,
    Star,
    Users,
    Zap,
    Coins,
    Calendar,
    CheckCircle,
    Infinity,
    Sparkles,
} from 'lucide-react';

interface CurrentPlanCardProps {
    user: UserDTO;
    formattedPlan: string;
    formattedDate: string;
}

const planIcons = {
    [Plans.FREE]: Users,
    [Plans.PRO]: Star,
    [Plans.UNLIMITED]: Crown,
    [Plans.ELITE]: Zap,
};

const planColors = {
    [Plans.FREE]: {
        gradient: 'from-slate-500 to-slate-600',
        bg: 'bg-slate-50 dark:bg-slate-950',
        border: 'border-slate-200 dark:border-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
    },
    [Plans.PRO]: {
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50 dark:bg-blue-950',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
    },
    [Plans.UNLIMITED]: {
        gradient: 'from-purple-500 to-violet-600',
        bg: 'bg-purple-50 dark:bg-purple-950',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
    },
    [Plans.ELITE]: {
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50 dark:bg-amber-950',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-300',
    },
};

export function CurrentPlanCard({ user, formattedPlan, formattedDate }: CurrentPlanCardProps) {
    const currentPlan = user?.planType || Plans.FREE;
    const colors = planColors[currentPlan] || planColors[Plans.FREE];
    const IconComponent = planIcons[currentPlan] || Users;
    const isUnlimited = user.credits === 'unlimited';
    const isPlanUnlimited = user.planExpiry === 'unlimited';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={`relative overflow-hidden ${colors.border} ${colors.bg} shadow-lg`}>
                {/* Background decoration */}
                <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full transform translate-x-12 -translate-y-12`}
                />

                <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                            <motion.div
                                className={`p-2 rounded-full bg-gradient-to-br ${colors.gradient} shadow-lg`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <IconComponent className="h-5 w-5 text-white" />
                            </motion.div>
                            Current Plan
                        </CardTitle>

                        {currentPlan !== Plans.FREE && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Badge
                                    className={`${colors.text} border ${colors.border} bg-transparent font-semibold px-3 py-1`}
                                >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                </Badge>
                            </motion.div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 relative">
                    {/* Plan Information */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Plan Type</p>
                                <Badge
                                    variant="outline"
                                    className={`${colors.text} ${colors.border} text-lg px-4 py-2 font-bold capitalize`}
                                >
                                    {formattedPlan}
                                </Badge>
                            </div>

                            <div className="text-right space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <div className="flex items-center gap-2">
                                    {isPlanUnlimited ? (
                                        <>
                                            <Infinity className="h-4 w-4 text-primary" />
                                            <span className="font-medium text-primary">
                                                Lifetime
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{formattedDate}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className={colors.border} />

                        {/* Credits Section */}
                        <div className={`${colors.bg} p-4 rounded-lg border ${colors.border}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className={`p-2 rounded-full bg-gradient-to-br ${colors.gradient}`}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {isUnlimited ? (
                                            <Infinity className="h-4 w-4 text-white" />
                                        ) : (
                                            <Coins className="h-4 w-4 text-white" />
                                        )}
                                    </motion.div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Available Credits
                                        </p>
                                        <p className={`text-xl font-bold ${colors.text}`}>
                                            {isUnlimited ? 'Unlimited' : user?.credits || 0}
                                        </p>
                                    </div>
                                </div>

                                {isUnlimited && (
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatType: 'reverse',
                                        }}
                                    >
                                        <Sparkles className={`h-6 w-6 ${colors.text}`} />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Plan Benefits */}
                        {currentPlan !== Plans.FREE && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    Premium Benefits Active
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {currentPlan === Plans.PRO && (
                                        <Badge variant="outline" className="text-xs">
                                            Priority Support
                                        </Badge>
                                    )}
                                    {currentPlan === Plans.UNLIMITED && (
                                        <>
                                            <Badge variant="outline" className="text-xs">
                                                Unlimited Credits
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                Advanced Features
                                            </Badge>
                                        </>
                                    )}
                                    {currentPlan === Plans.ELITE && (
                                        <>
                                            <Badge variant="outline" className="text-xs">
                                                Premium Support
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                Exclusive Features
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                Priority Processing
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Free Plan Upgrade Notice */}
                        {currentPlan === Plans.FREE && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
                            >
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <p className="font-medium text-blue-900 dark:text-blue-100">
                                            Ready to upgrade?
                                        </p>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Unlock premium features and get more credits with our
                                            paid plans!
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
