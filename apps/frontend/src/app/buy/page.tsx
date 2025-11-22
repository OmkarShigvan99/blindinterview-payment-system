'use client';

import { withAuth } from '@/lib/withAuth';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { UnifiedPurchaseFlow } from '@/components/buy/UnifiedPurchaseFlow';

const BuyPage = withAuth(function BuyPage() {
    const handlePurchaseComplete = () => {
        // No longer redirect to profile - let the verification page handle the flow
        // The user will be redirected to verify-payment page which will show wait message
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            Upgrade Your Experience
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Choose the perfect plan to unlock premium features and boost your
                            productivity
                        </p>
                    </div>

                    <UnifiedPurchaseFlow onComplete={handlePurchaseComplete} />
                </div>
            </div>
        </DashboardLayout>
    );
});

export default BuyPage;
