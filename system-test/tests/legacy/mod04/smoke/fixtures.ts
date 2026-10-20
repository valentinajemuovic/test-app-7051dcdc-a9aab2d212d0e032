import { test as base } from '@playwright/test';
import { chromium } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { loadConfiguration } from '../../../../config/configuration-loader.js';
import { SkyTravelApiClient } from '../../../../src/testkit/driver/adapter/api/client/SkyTravelApiClient.js';
import { ErpRealClient } from '../../../../src/testkit/driver/adapter/external/erp/client/ErpRealClient.js';
import { TaxRealClient } from '../../../../src/testkit/driver/adapter/external/tax/client/TaxRealClient.js';

const config = loadConfiguration();

export const apiTest = base.extend<{ skyTravelApiClient: SkyTravelApiClient; erpClient: ErpRealClient; taxClient: TaxRealClient }>({
    skyTravelApiClient: async ({}, use) => {
        await use(new SkyTravelApiClient(config.skyTravel.backendApiUrl, config.keycloakUrl));
    },
    erpClient: async ({}, use) => {
        await use(new ErpRealClient(config.externalSystems.erp.url));
    },
    taxClient: async ({}, use) => {
        await use(new TaxRealClient(config.externalSystems.tax.url));
    },
});

export const uiTest = base.extend<{ skyTravelPage: Page; skyTravelUiUrl: string; _skyTravelBrowser: Browser; _skyTravelContext: BrowserContext }>({
    skyTravelUiUrl: async ({}, use) => {
        await use(config.skyTravel.frontendUrl);
    },
    _skyTravelBrowser: async ({}, use) => {
        const browser = await chromium.launch();
        await use(browser);
        await browser.close();
    },
    _skyTravelContext: async ({ _skyTravelBrowser }, use) => {
        const context = await _skyTravelBrowser.newContext({ viewport: { width: 1920, height: 1080 } });
        await use(context);
        await context.close();
    },
    skyTravelPage: async ({ _skyTravelContext }, use) => {
        const page = await _skyTravelContext.newPage();
        await use(page);
        await page.close();
    },
});

export { expect } from '@playwright/test';
export { config };
