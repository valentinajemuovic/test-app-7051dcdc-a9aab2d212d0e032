import { uiTest as test, expect } from '../fixtures.js';

test('shouldBeAbleToGoToSkyTravel', async ({ skyTravelPage, skyTravelUiUrl }) => {
    const response = await skyTravelPage.goto(skyTravelUiUrl);
    expect(response?.status()).toBe(200);
});
