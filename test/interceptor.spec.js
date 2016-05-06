describe("Interceptor", function () {
    var rewire = require("rewire"),
        Interceptor;

    beforeEach(function () {
        window = {
            MutationObserver: function () {
                this.observe = function () { };
                this.disconnect = function () { };
            },
            localStorage: {
                getItem: function () { return 'en' }
            },
            App: {},
            Twitch: {},
            jQuery: {}
        };

        jQuery = {};

        document = {
            body: {}
        };

        Interceptor = rewire('../src/js/app/interceptor.js');
        require('./helpers/module-setup.js')(Interceptor);
    });

    it("should set 'broadcaster_language' and call $.ajax when supported, enabled, empty", function () {
        // Arrange
        var isCalled = false;
        jQuery.ajax = function () { isCalled = true }
        var interceptor = new Interceptor();
        spyOn(interceptor._router, 'isRouteSupported').and.returnValue(true);
        spyOn(interceptor._storage, 'isDisabled').and.returnValue(false);
        spyOn(interceptor._router, 'getRequestUrlRegExp').and.returnValue('^https?://streams.twitch.tv/kraken/streams/?$');
        interceptor._apply();

        // Act
        var options = {
            url: 'https://streams.twitch.tv/kraken/streams',
            data: {}
        };
        jQuery.ajax(options);

        // Assert
        expect(options.data.broadcaster_language).toBe('en');
        expect(isCalled).toBe(true);
    });

    it("shouldn't set 'broadcaster_language' and call $.ajax when not supported, enabled, empty", function () {
        // Arrange
        var isCalled = false;
        jQuery.ajax = function () { isCalled = true }
        var interceptor = new Interceptor();
        spyOn(interceptor._router, 'isRouteSupported').and.returnValue(false);
        spyOn(interceptor._storage, 'isDisabled').and.returnValue(false);
        spyOn(interceptor._router, 'getRequestUrlRegExp').and.returnValue('^https?://streams.twitch.tv/kraken/streams/?$');
        interceptor._apply();

        // Act
        var options = {
            url: 'https://streams.twitch.tv/kraken/streams',
            data: {}
        };
        jQuery.ajax(options);

        // Assert
        expect(options.data.broadcaster_language).toBe(undefined);
        expect(isCalled).toBe(true);
    });

    it("shouldn't set 'broadcaster_language' and call $.ajax when supported, disabled, empty", function () {
        // Arrange
        var isCalled = false;
        jQuery.ajax = function () { isCalled = true }
        var interceptor = new Interceptor();
        spyOn(interceptor._router, 'isRouteSupported').and.returnValue(true);
        spyOn(interceptor._storage, 'isDisabled').and.returnValue(true);
        spyOn(interceptor._router, 'getRequestUrlRegExp').and.returnValue('^https?://streams.twitch.tv/kraken/streams/?$');
        interceptor._apply();

        // Act
        var options = {
            url: 'https://streams.twitch.tv/kraken/streams',
            data: {}
        };
        jQuery.ajax(options);

        // Assert
        expect(options.data.broadcaster_language).toBe(undefined);
        expect(isCalled).toBe(true);
    });

    it("shouldn't set 'broadcaster_language' and call $.ajax when not supported, disabled, empty", function () {
        // Arrange
        var isCalled = false;
        jQuery.ajax = function () { isCalled = true }
        var interceptor = new Interceptor();
        spyOn(interceptor._router, 'isRouteSupported').and.returnValue(false);
        spyOn(interceptor._storage, 'isDisabled').and.returnValue(true);
        spyOn(interceptor._router, 'getRequestUrlRegExp').and.returnValue('^https?://streams.twitch.tv/kraken/streams/?$');
        interceptor._apply();

        // Act
        var options = {
            url: 'https://streams.twitch.tv/kraken/streams',
            data: {}
        };
        jQuery.ajax(options);

        // Assert
        expect(options.data.broadcaster_language).toBe(undefined);
        expect(isCalled).toBe(true);
    });

    it("shouldn't set 'broadcaster_language' and call $.ajax when supported, enabled, not empty", function () {
        // Arrange
        var isCalled = false;
        jQuery.ajax = function () { isCalled = true }
        var interceptor = new Interceptor();
        spyOn(interceptor._router, 'isRouteSupported').and.returnValue(true);
        spyOn(interceptor._storage, 'isDisabled').and.returnValue(false);
        spyOn(interceptor._router, 'getRequestUrlRegExp').and.returnValue('^https?://streams.twitch.tv/kraken/streams/?$');
        interceptor._apply();

        // Act
        var options = {
            url: 'https://streams.twitch.tv/kraken/streams',
            data: {
                broadcaster_language: 'ru'
            }
        };
        jQuery.ajax(options);

        // Assert
        expect(options.data.broadcaster_language).toBe('ru');
        expect(isCalled).toBe(true);
    });

    it("should call original $.ajax function if exception occurs", function () {
        // Arrange
        var isCalled = false;
        jQuery.ajax = function () { isCalled = true }
        var interceptor = new Interceptor();
        spyOn(interceptor._router, 'isRouteSupported').and.throwError();
        interceptor._apply();

        // Act
        jQuery.ajax();

        // Assert
        expect(isCalled).toBe(true);
    });
});
