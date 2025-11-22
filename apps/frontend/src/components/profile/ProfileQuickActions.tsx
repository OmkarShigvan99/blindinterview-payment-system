import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronRight, Home, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

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

export function ProfileQuickActions() {
    const router = useRouter();
    return (
        <Card className="p-6 border shadow-lg bg-card/80 backdrop-blur-sm">
            <CardHeader className="p-0">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        onClick={() => router.push('/buy')}
                        className="w-full justify-between"
                        size="lg"
                    >
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Buy More Credits
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        onClick={() => router.push('/')}
                        variant={'outline'}
                        className="w-full justify-between hover:text-primary hover:bg-primary/10 hover:border-primary"
                        size="lg"
                    >
                        <div className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Home
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        onClick={() => router.push('/orders')}
                        variant="outline"
                        className="w-full justify-between border-border hover:text-primary hover:bg-primary/10 hover:border-primary"
                        size="lg"
                    >
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5" />
                            View Purchase History
                        </div>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </motion.div>
            </CardContent>
        </Card>
    );
}
