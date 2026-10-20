import { expect, type TestType } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { assertThatResult } from '../../../../src/testkit/common/result-assert.js';
import type { SkyTravelDriver } from '../../../../src/testkit/driver/port/sky-travel-driver.js';
import type { ErpDriver } from '../../../../src/testkit/driver/port/external/erp/erp-driver.js';

export function runPlaceOrderPositive<TTestArgs extends { skyTravelDriver: SkyTravelDriver; erpDriver: ErpDriver }, TWorkerArgs extends object>(
  test: TestType<TTestArgs, TWorkerArgs>,
): void {
  test('shouldPlaceOrderForValidInput', async ({ skyTravelDriver, erpDriver }) => {
    const sku = `SKU-${randomUUID().substring(0, 8)}`;

    const productResult = await erpDriver.returnsProduct({ sku, price: '20.00' });
    expect(productResult.success).toBe(true);

    const result = await skyTravelDriver.placeOrder({ sku, quantity: '5', country: 'US' });

    expect(result.success).toBe(true);
    const placedOrder = assertThatResult(result).getValue();
    expect(placedOrder.orderNumber).toMatch(/^ORD-/);

    const viewResult = await skyTravelDriver.viewOrder({ orderNumber: placedOrder.orderNumber });
    expect(viewResult.success).toBe(true);
    const order = assertThatResult(viewResult).getValue();
    expect(order.sku).toBe(sku);
    expect(order.quantity).toBe(5);
    expect(order.unitPrice).toBe(20);
    expect(order.status).toBe('PLACED');
    expect(order.totalPrice).toBeGreaterThan(0);
  });
}
