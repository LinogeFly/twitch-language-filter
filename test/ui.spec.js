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
            body: {}
        };
    });

    it("adds LanguageBar on supported pages", function () {
        var lbi = new LanguageBarInitializer();

        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/all')).toEqual(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/all/ps4')).toEqual(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/all/xb1')).toEqual(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/random')).toEqual(true);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/game/Minecraft')).toEqual(true);
    });

    it("doesn't add LanguageBar on unsupported pages", function () {
        var lbi = new LanguageBarInitializer();

        expect(lbi._isUrlAllowed('https://www.twitch.tv/')).toEqual(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory')).toEqual(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/videos/week')).toEqual(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/videos/month')).toEqual(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/game/Minecraft/videos/week')).toEqual(false);
        expect(lbi._isUrlAllowed('https://www.twitch.tv/directory/game/Minecraft/videos/month')).toEqual(false);
    });

    it("adds LanguageBar only once on a page", function () {
        // Arrange

        document.URL = 'https://www.twitch.tv/directory/all'
        var lbi = new LanguageBarInitializer();

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

        expect(lbi._appender.add.calls.count()).toEqual(1);
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