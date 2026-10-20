import { test, expect } from '@playwright/test';
import { loginToSkyTravelUiIfRequired } from '../../../../../src/testkit/driver/adapter/shared/client/playwright/keycloak-ui-login.js';
import { getConfiguration, getSkyTravelUiBaseUrl, setUpSkyTravelBrowser, tearDownSkyTravelBrowser, type SkyTravelBrowser } from '../../base/BaseRawTest.js';

test('shouldBeAbleToGoToSkyTravel', async () => {
    let skyTravelBrowser: SkyTravelBrowser | null = null;
    try {
        skyTravelBrowser = await setUpSkyTravelBrowser();
        const response = await skyTravelBrowser.page.goto(getSkyTravelUiBaseUrl());

        expect(response?.status()).toBe(200);

        await loginToSkyTravelUiIfRequired(skyTravelBrowser.page, getConfiguration().keycloakUrl);

        const contentType = response?.headers()['content-type'];
        expect(contentType).toBeDefined();
        expect(contentType).toContain('text/html');

        const pageContent = await skyTravelBrowser.page.content();
        expect(pageContent).toContain('<html');
        expect(pageContent).toContain('</html>');
    } finally {
        await tearDownSkyTravelBrowser(skyTravelBrowser);
    }
});
