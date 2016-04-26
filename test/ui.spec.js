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

    it("adds LanguageBar on supported pages", function () {
        var lbi = new LanguageBarInitializer();

        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/all')).toBe(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/all/ps4')).toBe(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/all/xb1')).toBe(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/random')).toBe(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/game/Minecraft')).toBe(true);
    });

    it("doesn't add LanguageBar on unsupported pages", function () {
        var lbi = new LanguageBarInitializer();

        expect(lbi._isUrlAllowed('https://www.twitch.tv/')).toBe(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory')).toBe(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/videos/week')).toBe(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/videos/month')).toBe(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/game/Minecraft/videos/week')).toBe(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/game/Minecraft/videos/month')).toBe(false);
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