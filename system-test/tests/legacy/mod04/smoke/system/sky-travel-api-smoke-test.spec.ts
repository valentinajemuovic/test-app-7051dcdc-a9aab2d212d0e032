import { apiTest as test, expect } from '../fixtures.js';

test('shouldBeAbleToGoToSkyTravel', async ({ skyTravelApiClient }) => {
    const result = await skyTravelApiClient.health().checkHealth();
    expect(result.success).toBe(true);
});
