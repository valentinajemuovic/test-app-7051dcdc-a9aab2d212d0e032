import { expect, type TestType } from '@playwright/test';
import type { SkyTravelDriver } from '../../../../../src/testkit/driver/port/sky-travel-driver.js';

// Playwright's TestType is invariant in its fixture shape, so the helper is generic
// over the concrete fixtures and only requires `skyTravelDriver` to be among them.
export function runSkyTravelBaseSmokeTest<TTestArgs extends { skyTravelDriver: SkyTravelDriver }, TWorkerArgs extends object>(
  test: TestType<TTestArgs, TWorkerArgs>,
): void {
  test('shouldBeAbleToGoToSkyTravel', async ({ skyTravelDriver }) => {
    const result = await skyTravelDriver.goToSkyTravel({});
    expect(result.success).toBe(true);
  });
}
