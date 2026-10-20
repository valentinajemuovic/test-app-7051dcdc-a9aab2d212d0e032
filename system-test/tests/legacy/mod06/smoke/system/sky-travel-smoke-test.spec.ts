import { test, expect, forChannels, ChannelType } from '../fixtures.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('shouldBeAbleToGoToSkyTravel', async ({ skyTravelDriver }) => {
        const result = await skyTravelDriver.goToSkyTravel({});
        expect(result.success).toBe(true);
    });
});
