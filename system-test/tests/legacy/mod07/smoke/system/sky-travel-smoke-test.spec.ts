import { test, forChannels, ChannelType } from '../fixtures.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('shouldBeAbleToGoToSkyTravel', async ({ app }) => {
        (await app.skyTravel().goToSkyTravel().execute()).shouldSucceed();
    });
});
