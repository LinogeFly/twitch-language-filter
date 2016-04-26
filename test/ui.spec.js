describe("LanguageBarInitializer", function () {
    var LanguageBarInitializer = require('../src/js/app/language-bar-initializer.js');

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

    it("removes LanguageBar from a page if it was added but page is not supported anymore", function () {
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