describe("LanguageBarInitializer", function () {
    var rewire = require("rewire"),
        LanguageBarInitializer;

    beforeEach(function () {
        window = {
            MutationObserver: function () {
                this.observe = function () { };
                this.disconnect = function () { };
            },
            App: {},
            Twitch: {},
            jQuery: {}
        };

        document = {
            body: {}
        };

        LanguageBarInitializer = rewire('../src/js/app/language-bar-initializer.js');
        require('./helpers/module-setup.js')(LanguageBarInitializer);
    });

    it("adds LanguageBar only once on a page", function () {
        // Arrange
        var lbi = new LanguageBarInitializer();
        spyOn(lbi._router, 'isRouteSupported').and.returnValue(true);

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
        spyOn(lbi._router, 'isRouteSupported').and.returnValue(false);
        spyOn(lbi._appender, 'isAdded').and.returnValue(true);
        spyOn(lbi._appender, 'remove');

        // Act
        lbi._onDomMutation();

        // Assert
        expect(lbi._appender.remove.calls.any()).toBe(true);
    });
});