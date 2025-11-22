import { Button } from '@/components/ui/button';
import { History, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

export function OrdersHeader() {
    const router = useRouter();
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="flex items-center justify-between gap-3"
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-1 hover:text-primary hover:bg-primary/10 hover:border-primary flex-shrink-0"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden xs:inline">Back</span>
                    </Button>
                </motion.div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                        <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                            <span className="hidden sm:inline">Purchase History</span>
                            <span className="sm:hidden">Orders</span>
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        <span className="hidden sm:inline">
                            View all your past transactions and subscriptions
                        </span>
                        <span className="sm:hidden">Your order history</span>
                    </p>
                </div>
            </div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                    onClick={() => router.push('/buy')}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                    size="sm"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden xs:inline ml-2">Buy</span>
                    <span className="hidden sm:inline ml-2">Credits</span>
                </Button>
            </motion.div>
        </motion.div>
    );
}
