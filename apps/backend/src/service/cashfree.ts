import { ENV } from '@src/config/env';
import { Cashfree, CFEnvironment, type CreateOrderRequest, type OrderEntity } from 'cashfree-pg';

export const cashfree = new Cashfree(
    ENV.NODE_ENV === 'development' ? CFEnvironment.SANDBOX : CFEnvironment.PRODUCTION,
    ENV.CASHFREE_APP_ID,
    ENV.CASHFREE_KEY_SECRET,
);

export async function createCashfreeOrder(orderOptions: CreateOrderRequest): Promise<OrderEntity> {
    const response = await cashfree.PGCreateOrder(orderOptions);
    return response.data;
}
