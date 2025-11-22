'use client';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { isAxiosError } from 'axios';
import { ErrorAlert, PageLoading } from '@/components/ui/global';
import { withAuth } from '@/lib/withAuth';
import { API_ORDER_ENDPOINTS } from '@/fetch/endpoints';
import { OrderDTO } from '@shared/types/order';
import { usePaymentCheckout } from '@/hooks/usePaymentCheckout';
import { useAuth } from '@/hooks/useAuth';
import { OrdersHeader } from '@/components/orders/OrdersHeader';
import { OrdersEmptyState } from '@/components/orders/OrdersEmptyState';
import { OrdersList } from '@/components/orders/OrdersList';
import { OrdersPagination } from '@/components/orders/OrdersPagination';

interface OrdersPageState {
    orders: OrderDTO[];
    loading: boolean;
    error: string | null;
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    } | null;
}

const OrdersPage = withAuth(function OrdersPage() {
    const { user } = useAuth();
    const {
        processPayment,
        loading: paymentLoading,
        error: paymentError,
        clearError,
    } = usePaymentCheckout();

    const [state, setState] = useState<OrdersPageState>({
        orders: [],
        loading: true,
        error: null,
        pagination: null,
    });

    const fetchOrders = useCallback(
        async (page = 1) => {
            if (!user.id) {
                setState((prev) => ({
                    ...prev,
                    error: 'Failed to fetch orders',
                    loading: false,
                }));
                return;
            }

            try {
                setState((prev) => ({ ...prev, loading: true, error: null }));
                const response = await API_ORDER_ENDPOINTS.getUserOrders({
                    page,
                    limit: 10,
                    userId: user.id,
                });

                if (response.data.success) {
                    setState((prev) => ({
                        ...prev,
                        orders: response.data.data.data,
                        pagination: response.data.data.pagination,
                        loading: false,
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        error: response.data.data.reason ?? 'Failed to fetch orders',
                        loading: false,
                    }));
                }
            } catch (err) {
                const errorMessage = isAxiosError(err)
                    ? (err.response?.data?.data?.reason ?? 'Failed to fetch orders')
                    : 'Something went wrong';

                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    loading: false,
                }));
            }
        },
        [user.id],
    );

    useEffect(() => {
        if (user.id) {
            fetchOrders();
        }
    }, [user.id, fetchOrders]);

    const handlePayNow = (order: OrderDTO) => {
        // Clear any previous payment errors
        clearError();

        // Use the payment checkout hook to process the payment
        processPayment(order);
    };

    if (state.loading && state.orders.length === 0) {
        return <PageLoading text="Loading your orders..." className="text-primary" />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <OrdersHeader />
                {/* Error Alert */}
                <AnimatePresence>
                    {(state.error || paymentError) && (
                        <ErrorAlert
                            message={state.error || paymentError || 'An error occurred'}
                            title="Error"
                        />
                    )}
                </AnimatePresence>
                {/* Orders List or Empty State */}
                {state.orders.length === 0 && !state.loading ? (
                    <OrdersEmptyState />
                ) : (
                    <>
                        <OrdersList
                            orders={state.orders}
                            paymentLoading={paymentLoading}
                            onPayNow={handlePayNow}
                        />
                        {state.pagination && state.pagination.totalPages > 1 && (
                            <OrdersPagination
                                page={state.pagination.page}
                                totalPages={state.pagination.totalPages}
                                hasNextPage={state.pagination.hasNextPage}
                                hasPrevPage={state.pagination.page > 1}
                                loading={state.loading}
                                onPageChange={fetchOrders}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default OrdersPage;
