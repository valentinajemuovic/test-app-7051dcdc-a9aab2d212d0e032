import { test as base } from '@playwright/test';
import { chromium } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { loadConfiguration, type TestConfig } from '../../../../config/configuration-loader.js';

const config = loadConfiguration();

// Raw HTTP fixtures for API tests
export const apiTest = base.extend<{ config: TestConfig }>({
    config: async ({}, use) => {
        await use(config);
    },
});

// Raw Playwright fixtures for UI tests
export const uiTest = base.extend<{ config: TestConfig; skyTravelPage: Page; _skyTravelBrowser: Browser; _skyTravelContext: BrowserContext }>({
    config: async ({}, use) => {
        await use(config);
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
