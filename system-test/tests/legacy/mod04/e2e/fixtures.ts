import { test as base } from '@playwright/test';
import { chromium } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { loadConfiguration } from '../../../../config/configuration-loader.js';
import { SkyTravelApiClient } from '../../../../src/testkit/driver/adapter/api/client/SkyTravelApiClient.js';
import { SkyTravelUiClient } from '../../../../src/testkit/driver/adapter/ui/client/SkyTravelUiClient.js';
import { ErpRealClient } from '../../../../src/testkit/driver/adapter/external/erp/client/ErpRealClient.js';

const config = loadConfiguration();

// Client fixtures for API tests
export const apiTest = base.extend<{ skyTravelApiClient: SkyTravelApiClient; erpClient: ErpRealClient }>({
    skyTravelApiClient: async ({}, use) => {
        await use(new SkyTravelApiClient(config.skyTravel.backendApiUrl, config.keycloakUrl));
    },
    erpClient: async ({}, use) => {
        await use(new ErpRealClient(config.externalSystems.erp.url));
    },
});

// Client fixtures for UI tests
export const uiTest = base.extend<{ skyTravelUiClient: SkyTravelUiClient; _skyTravelBrowser: Browser; erpClient: ErpRealClient }>({
    _skyTravelBrowser: async ({}, use) => {
        const browser = await chromium.launch();
        await use(browser);
        await browser.close();
    },
    skyTravelUiClient: async ({ _skyTravelBrowser }, use) => {
        const client = new SkyTravelUiClient(config.skyTravel.frontendUrl, _skyTravelBrowser, config.keycloakUrl);
        await use(client);
        await client.close();
    },
    erpClient: async ({}, use) => {
        await use(new ErpRealClient(config.externalSystems.erp.url));
    },
});

export { expect } from '@playwright/test';
export { config };
