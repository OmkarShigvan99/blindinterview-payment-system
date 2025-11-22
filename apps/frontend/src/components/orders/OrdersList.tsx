import { OrderDTO } from '@shared/types/order';
import { OrderCard } from './OrderCard';

interface OrdersListProps {
    orders: OrderDTO[];
    paymentLoading: boolean;
    onPayNow: (order: OrderDTO) => void;
}

export function OrdersList({ orders, paymentLoading, onPayNow }: OrdersListProps) {
    return (
        <div className="space-y-4">
            {orders.map((order, index) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    paymentLoading={paymentLoading}
                    onPayNow={onPayNow}
                />
            ))}
        </div>
    );
}
