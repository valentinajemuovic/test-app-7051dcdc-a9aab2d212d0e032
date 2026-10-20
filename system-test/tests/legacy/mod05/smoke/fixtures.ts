import { test as base } from '@playwright/test';
import { chromium } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { loadConfiguration } from '../../../../config/configuration-loader.js';
import type { SkyTravelDriver } from '../../../../src/testkit/driver/port/sky-travel-driver.js';
import type { ErpDriver } from '../../../../src/testkit/driver/port/external/erp/erp-driver.js';
import type { TaxDriver } from '../../../../src/testkit/driver/port/external/tax/tax-driver.js';
import { SkyTravelApiDriver } from '../../../../src/testkit/driver/adapter/api/sky-travel-api-driver.js';
import { SkyTravelUiDriver } from '../../../../src/testkit/driver/adapter/ui/sky-travel-ui-driver.js';
import { ErpRealDriver } from '../../../../src/testkit/driver/adapter/external/erp/erp-real-driver.js';
import { TaxRealDriver } from '../../../../src/testkit/driver/adapter/external/tax/tax-real-driver.js';

const config = loadConfiguration();

export const apiTest = base.extend<{ skyTravelDriver: SkyTravelDriver; erpDriver: ErpDriver; taxDriver: TaxDriver }>({
    skyTravelDriver: async ({}, use) => {
        const driver = new SkyTravelApiDriver(config.skyTravel.backendApiUrl, config.keycloakUrl);
        await use(driver);
        await driver.close();
    },
    erpDriver: async ({}, use) => {
        const driver = new ErpRealDriver(config.externalSystems.erp.url);
        await use(driver);
        await driver.close();
    },
    taxDriver: async ({}, use) => {
        const driver = new TaxRealDriver(config.externalSystems.tax.url);
        await use(driver);
        await driver.close();
    },
});

export const uiTest = base.extend<{ skyTravelDriver: SkyTravelDriver; erpDriver: ErpDriver; taxDriver: TaxDriver; _skyTravelBrowser: Browser }>({
    _skyTravelBrowser: async ({}, use) => {
        const browser = await chromium.launch();
        await use(browser);
        await browser.close();
    },
    skyTravelDriver: async ({ _skyTravelBrowser }, use) => {
        const driver = new SkyTravelUiDriver(config.skyTravel.frontendUrl, _skyTravelBrowser, config.keycloakUrl);
        await use(driver);
        await driver.close();
    },
    erpDriver: async ({}, use) => {
        const driver = new ErpRealDriver(config.externalSystems.erp.url);
        await use(driver);
        await driver.close();
    },
    taxDriver: async ({}, use) => {
        const driver = new TaxRealDriver(config.externalSystems.tax.url);
        await use(driver);
        await driver.close();
    },
});

export { expect } from '@playwright/test';
