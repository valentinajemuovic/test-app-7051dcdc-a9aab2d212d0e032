import { test, forChannels, ChannelType } from '../../base/BaseScenarioDslTest.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('shouldBeAbleToGoToSkyTravel', async ({ scenario }) => {
        await scenario.assume().skyTravel().shouldBeRunning();
    });
});
