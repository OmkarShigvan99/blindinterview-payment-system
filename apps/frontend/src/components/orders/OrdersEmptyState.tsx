import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function OrdersEmptyState() {
    const router = useRouter();
    return (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Card className="p-6 sm:p-12 text-center border shadow-lg bg-card/80 backdrop-blur-sm">
                <div className="space-y-4">
                    <Package className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto" />
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        No Orders Yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
                        You haven&apos;t made any purchases yet. Start by buying some credits or subscribing to a plan.
                    </p>
                    <Button
                        onClick={() => router.push('/buy')}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm sm:text-base px-4 py-2"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Get Started
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
