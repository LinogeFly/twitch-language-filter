describe("isAllowedUrl()", function () {
    var rewire = require("rewire"),
        isAllowedUrl;

    beforeEach(function () {
        document = {};

        isAllowedUrl = rewire('../src/js/app/allowed-url.js');
        require('./helpers/module-setup.js')(isAllowedUrl);
    });

    var expectAllowedUrl = function (url, expected) {
        document.URL = url;
        if (isAllowedUrl() !== expected)
            fail(url);
    };

    it("should return \"true\" for supported URLs", function () {
        expectAllowedUrl('https://www.twitch.tv/directory/all', true);
        expectAllowedUrl('https://www.twitch.tv/directory/all/ps4', true);
        expectAllowedUrl('https://www.twitch.tv/directory/all/xb1', true);
        expectAllowedUrl('https://www.twitch.tv/directory/random', true);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Minecraft', true);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive', true);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive/map/de_dust2', true);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive/map/de_dust2?sortBy=skill', true);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Hearthstone: Heroes of Warcraft', true);
    });

    it("should return \"false\" for unsupported URLs", function () {
        expectAllowedUrl('https://www.twitch.tv/', false);
        expectAllowedUrl('https://www.twitch.tv/directory', false);
        expectAllowedUrl('https://www.twitch.tv/directory/videos/week', false);
        expectAllowedUrl('https://www.twitch.tv/directory/videos/month', false);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Minecraft/videos/week', false);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Minecraft/videos/month', false);
    });
});