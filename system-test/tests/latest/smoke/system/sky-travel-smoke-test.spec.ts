import { test, forChannels, ChannelType } from '../fixtures.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('shouldBeAbleToGoToSkyTravel', async ({ scenario }) => {
        await scenario.assume().skyTravel().shouldBeRunning();
    });
});
