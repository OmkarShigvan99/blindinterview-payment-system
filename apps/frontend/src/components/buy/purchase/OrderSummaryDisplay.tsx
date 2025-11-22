import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { OrderType } from '@shared/types/order';
import { OrderSummary } from '@/types/business/purchase';

interface OrderSummaryDisplayProps {
    orderSummary: OrderSummary;
}

export function OrderSummaryDisplay({ orderSummary }: OrderSummaryDisplayProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">{orderSummary.name || 'Custom Credits'}</h3>
                        <p className="text-sm text-muted-foreground">
                            {orderSummary.description || `${orderSummary.credits} credits`}
                        </p>
                    </div>
                    <Badge variant="outline">
                        {orderSummary.type === OrderType.PLAN ? 'Prepaid Plan' : 'One-time'}
                    </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {orderSummary.type === OrderType.PLAN ? 'Plan Price' : 'Total Price'}
                        </span>
                        <span>
                            {orderSummary.basePrice} {orderSummary.currency}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits</span>
                        <span>
                            {orderSummary.type === OrderType.PLAN
                                ? orderSummary.creditsIncluded
                                : orderSummary.credits}
                        </span>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                        {orderSummary.basePrice} {orderSummary.currency}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
