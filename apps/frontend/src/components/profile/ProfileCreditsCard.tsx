import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileCreditsCardProps {
    credits: number | string | undefined;
}

export function ProfileCreditsCard({ credits }: ProfileCreditsCardProps) {
    if (credits === undefined) return null;
    return (
        <Card className="p-6 border shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
            <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Coins className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    Available Credits
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <motion.div
                    className="text-3xl font-bold text-yellow-700 dark:text-yellow-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                    {credits === 'unlimited' ? '∞' : credits}
                </motion.div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    {credits === 'unlimited' ? 'Unlimited credits' : 'Credits remaining'}
                </p>
            </CardContent>
        </Card>
    );
}
