describe("LanguageBarInitializer", function () {
    var rewire = require("rewire"),
        LanguageBarInitializer;

    beforeEach(function () {
        window = {
            MutationObserver: function () {
                this.observe = function () { };
                this.disconnect = function () { };
            }
        };

        document = {
            body: {},
            URL: ''
        };

        LanguageBarInitializer = rewire('../src/js/app/language-bar-initializer.js');
        require('./helpers/module-setup.js')(LanguageBarInitializer);
    });

    var expectAllowedUrl = function (url, expected, lbi) {
        if (lbi._isUrlAllowed(url) !== expected)
            fail(url);
    };

    it("adds LanguageBar on supported pages", function () {
        var lbi = new LanguageBarInitializer();

        expectAllowedUrl('https://www.twitch.tv/directory/all', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/all/ps4', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/all/xb1', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/random', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Minecraft', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive/map/de_dust2', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive/map/de_dust2?sortBy=skill', true, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Hearthstone: Heroes of Warcraft', true, lbi);
    });

    it("doesn't add LanguageBar on unsupported pages", function () {
        var lbi = new LanguageBarInitializer();

        expectAllowedUrl('https://www.twitch.tv/', false, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory', false, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/videos/week', false, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/videos/month', false, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Minecraft/videos/week', false, lbi);
        expectAllowedUrl('https://www.twitch.tv/directory/game/Minecraft/videos/month', false, lbi);
    });

    it("adds LanguageBar only once on a page", function () {
        // Arrange

        var lbi = new LanguageBarInitializer();
        spyOn(lbi, '_isUrlAllowed').and.returnValue(true);

        // Mock for _appender
        var isAdded = false;
        spyOn(lbi._appender, 'add').and.callFake(function () {
            isAdded = true;
        });
        spyOn(lbi._appender, 'isAdded').and.callFake(function () {
            return isAdded;
        });

        // Act

        lbi._onDomMutation();
        lbi._onDomMutation();

        // Assert

        expect(lbi._appender.add.calls.count()).toBe(1);
    });

    it("removes LanguageBar from a page if it was added first but URL then got changed to not supported one", function () {
        // Arrange
        var lbi = new LanguageBarInitializer();
        spyOn(lbi, '_isUrlAllowed').and.returnValue(false);
        spyOn(lbi._appender, 'isAdded').and.returnValue(true);
        spyOn(lbi._appender, 'remove');

        // Act
        lbi._onDomMutation();

        // Assert
        expect(lbi._appender.remove.calls.any()).toBe(true);
    });
});