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

    it("should add LanguageBar only once to a page when route is supported", function () {
        // Arrange

        var lbi = new LanguageBarInitializer();
        spyOn(lbi._router, 'getCurrentRoute').and.returnValue({ name: 'channels.all' });

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

    it("shouldn't add LanguageBar to a page if current route isn't supported", function () {
        // Arrange
        var lbi = new LanguageBarInitializer();
        spyOn(lbi._router, 'getCurrentRoute').and.returnValue(undefined);
        spyOn(lbi._appender, 'isAdded').and.returnValue(false);
        spyOn(lbi._appender, 'add');

        // Act
        lbi._onDomMutation();

        // Assert
        expect(lbi._appender.add.calls.count()).toBe(0);
    });

    it("should remove LanguageBar from a page if it was added but current route is not supported anymore", function () {
        // Arrange
        var lbi = new LanguageBarInitializer();
        spyOn(lbi._router, 'getCurrentRoute').and.returnValue(undefined);
        spyOn(lbi._appender, 'isAdded').and.returnValue(true);
        spyOn(lbi._appender, 'remove');

        // Act
        lbi._onDomMutation();

        // Assert
        expect(lbi._appender.remove.calls.any()).toBe(true);
    });
});