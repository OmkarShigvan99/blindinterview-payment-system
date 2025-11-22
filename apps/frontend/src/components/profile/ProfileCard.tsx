import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, User, Crown, Calendar } from 'lucide-react';
import { InlineLoading } from '@/components/ui/global';
import { Plans } from '@shared/types/pricingTier';
import { UserDTO } from '@shared/types/user';

const planColors = {
    [Plans.FREE]: 'bg-muted text-muted-foreground border-border',
    [Plans.PRO]:
        'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800',
    [Plans.UNLIMITED]:
        'bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800',
    [Plans.ELITE]:
        'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950 dark:text-purple-100 dark:border-purple-800',
};

const planIcons = {
    [Plans.FREE]: User,
    [Plans.PRO]: Crown,
    [Plans.UNLIMITED]: Crown,
    [Plans.ELITE]: Crown,
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 },
    },
};

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

interface ProfileCardProps {
    user: UserDTO;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export function ProfileCard({ user, isSubmitting, onSubmit }: ProfileCardProps) {
    const planType = (user.planType ?? Plans.FREE) as Plans;
    const PlanIcon = planIcons[planType];
    const formattedPlanType = (user.planType ?? Plans.FREE).replace(/^./, (c: string) =>
        c.toUpperCase(),
    );
    return (
        <Card className="p-6 border shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="space-y-6 p-0">
                {/* User Info Section */}
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                    {user.avatar ? (
                        <motion.img
                            src={user.avatar}
                            alt={user.name}
                            className="w-16 h-16 rounded-full border-4 border-background shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        />
                    ) : (
                        <motion.div
                            className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shadow-lg border-4 border-background"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <span className="text-2xl font-bold text-muted-foreground">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </motion.div>
                    )}
                    <div className="flex-1 space-y-1">
                        <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2">
                            {user.isEmailVerified ? (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-1 text-green-600 text-sm font-medium"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Email Verified
                                </motion.span>
                            ) : (
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        onClick={onSubmit}
                                        variant="outline"
                                        size="sm"
                                        disabled={isSubmitting}
                                        className="text-xs"
                                    >
                                        {isSubmitting ? (
                                            <InlineLoading size="sm" />
                                        ) : (
                                            <Mail className="w-3 h-3" />
                                        )}
                                        Verify Email
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <Separator />

                {/* Plan Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Plan Details</h3>
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                            <Badge
                                className={`flex items-center gap-2 px-3 py-1 ${
                                    planColors[user.planType ?? Plans.FREE]
                                }`}
                                variant="outline"
                            >
                                <PlanIcon className="w-4 h-4" />
                                {formattedPlanType} Plan
                            </Badge>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Plan Type</p>
                            <p className="font-medium text-foreground">{formattedPlanType}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="font-medium text-foreground">
                                {user.planExpiry === 'unlimited' ? 'Unlimited' : 'Active'}
                            </p>
                        </div>
                        {user.planExpiry && user.planExpiry !== 'unlimited' && (
                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-sm text-muted-foreground">Plan Expiry</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <p className="font-medium text-foreground">
                                        {new Date(user.planExpiry).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                <Separator />

                {/* Role Information */}
                <motion.div variants={itemVariants} className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Account Details</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Role</span>
                        <Badge variant="secondary" className="capitalize">
                            {user.role}
                        </Badge>
                    </div>
                </motion.div>
            </CardContent>
        </Card>
    );
}
