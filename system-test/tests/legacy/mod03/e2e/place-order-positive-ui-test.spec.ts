import { uiTest as test, expect } from './base/BaseE2eTest.js';
import { randomUUID } from 'node:crypto';
import { loginToSkyTravelUiIfRequired } from '../../../../src/testkit/driver/adapter/shared/client/playwright/keycloak-ui-login.js';

const TIMEOUT = 30_000;

test('shouldPlaceOrderForValidInput', async ({ config, skyTravelPage }) => {
    const sku = `SKU-${randomUUID().substring(0, 8)}`;
    const erpBaseUrl = config.externalSystems.erp.url;
    const skyTravelUiUrl = config.skyTravel.frontendUrl;

    // Given: create product in real ERP
    const createProductResponse = await fetch(`${erpBaseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sku, title: 'Test Product', description: 'Test', category: 'Test', brand: 'Test', price: '20.00' }),
    });
    expect(createProductResponse.status).toBe(201);

    // When: place order via UI
    await skyTravelPage.goto(skyTravelUiUrl);
    await loginToSkyTravelUiIfRequired(skyTravelPage, config.keycloakUrl);
    await skyTravelPage.locator("a[href='/new-order']").click({ timeout: TIMEOUT });
    await skyTravelPage.locator('[aria-label="SKU"]').fill(sku, { timeout: TIMEOUT });
    await skyTravelPage.locator('[aria-label="Quantity"]').fill('5', { timeout: TIMEOUT });
    await skyTravelPage.locator('[aria-label="Country"]').fill('US', { timeout: TIMEOUT });
    await skyTravelPage.locator('[aria-label="Place Order"]').click({ timeout: TIMEOUT });

    // Then: should see success notification with order number
    const notification = skyTravelPage.locator("[role='alert'].notification.success");
    await notification.waitFor({ state: 'visible', timeout: TIMEOUT });
    const successText = await notification.textContent({ timeout: TIMEOUT });
    expect(successText).toContain('Order has been created with Order Number');
    const orderNumber = /Order has been created with Order Number ([\w-]+)/.exec(successText ?? '')?.[1] ?? '';
    expect(orderNumber).not.toBe('');

    // Then: navigate to order history, filter, view details, assert fields
    // A full page load drops the in-memory token and login lands on the home page, so navigate in-app.
    await skyTravelPage.goto(skyTravelUiUrl);
    await loginToSkyTravelUiIfRequired(skyTravelPage, config.keycloakUrl);
    await skyTravelPage.locator("a[href='/order-history']").click({ timeout: TIMEOUT });
    await skyTravelPage.locator("[aria-label='Order Number']").fill(orderNumber, { timeout: TIMEOUT });
    await skyTravelPage.locator("[aria-label='Refresh Order List']").click({ timeout: TIMEOUT });
    const row = skyTravelPage.locator(`//tr[contains(., '${orderNumber}')]`);
    await row.locator("//a[contains(text(), 'View Details')]").click({ timeout: TIMEOUT });

    await skyTravelPage.locator("[aria-label='Display Order Number']").waitFor({ state: 'visible', timeout: TIMEOUT });
    const detailsOrderNumber = (await skyTravelPage.locator("[aria-label='Display Order Number']").textContent({ timeout: TIMEOUT }))?.trim();
    expect(detailsOrderNumber).toBe(orderNumber);

    const detailsSku = (await skyTravelPage.locator("[aria-label='Display SKU']").textContent({ timeout: TIMEOUT }))?.trim();
    expect(detailsSku).toBe(sku);

    const quantityText = (await skyTravelPage.locator("[aria-label='Display Quantity']").textContent({ timeout: TIMEOUT }))?.trim() ?? '';
    expect(Number.parseInt(quantityText, 10)).toBe(5);

    const unitPriceText = (await skyTravelPage.locator("[aria-label='Display Unit Price']").textContent({ timeout: TIMEOUT }))?.trim() ?? '';
    expect(Number.parseFloat(unitPriceText.replace('$', ''))).toBe(20);

    const basePriceText = (await skyTravelPage.locator("[aria-label='Display Base Price']").textContent({ timeout: TIMEOUT }))?.trim() ?? '';
    expect(Number.parseFloat(basePriceText.replace('$', ''))).toBe(100);

    const totalPriceText = (await skyTravelPage.locator("[aria-label='Display Total Price']").textContent({ timeout: TIMEOUT }))?.trim() ?? '';
    expect(Number.parseFloat(totalPriceText.replace('$', ''))).toBeGreaterThan(0);

    const status = (await skyTravelPage.locator("[aria-label='Display Status']").textContent({ timeout: TIMEOUT }))?.trim();
    expect(status).toBe('PLACED');
});
