import { test, expect } from '@playwright/test';
import { getSkyTravelApiBaseUrl } from '../../base/BaseRawTest.js';

test('shouldBeAbleToGoToSkyTravel', async () => {
    const response = await fetch(`${getSkyTravelApiBaseUrl()}/health`);
    expect(response.status).toBe(200);
});
