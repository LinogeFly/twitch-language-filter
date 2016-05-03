describe("Router", function () {
    var rewire = require("rewire"),
        Router;

    beforeEach(function () {
        Router = rewire('../src/js/app/router.js');
        require('../src/js/core/array-helpers.js');
        require('./helpers/module-setup.js')(Router);
    });

    it("_getCurrentRouteName() should prioritize TargetRoute value over CurrentRoute", function () {
        var router = new Router();
        spyOn(router, '_getTwitchRouter').and.returnValue({
            currentRouteName: 'following.index',
            targetState: {
                routerJs: {
                    activeTransition: {
                        targetName: 'channels.all'
                    }
                }
            }
        });
        
       var result = router._getCurrentRouteName();

       expect(result).toBe('channels.all');
    });

    it("_getCurrentRouteName() should throw error if route cannot be fetched", function () {
        var router = new Router();
        spyOn(router, '_getTwitchRouter').and.returnValue({});

        expect(router._getCurrentRouteName).toThrowError();
    });

    it("isRouteSupported() should return 'true' when route match is found", function () {
        var router = new Router();
        spyOn(router, '_getCurrentRouteName').and.returnValue('channels.all');
        router._routes = [
            { name: 'channels.all', url: '^https?://streams.twitch.tv/kraken/streams/?$' }
        ];

        expect(router.isRouteSupported()).toBe(true);
    });

    it("isRouteSupported() should return 'false' when route match isn't found", function () {
        var router = new Router();
        spyOn(router, '_getCurrentRouteName').and.returnValue('following.index');
        router._routes = [
            { name: 'channels.all', url: '^https?://streams.twitch.tv/kraken/streams/?$' }
        ];

        expect(router.isRouteSupported()).toBe(false);
    });

    it("getRequestUrlRegExp() should return value when route is supported", function () {
        var router = new Router();
        spyOn(router, '_getCurrentRouteName').and.returnValue('channels.all');
        router._routes = [
            { name: 'channels.all', url: '^https?://streams.twitch.tv/kraken/streams/?$' }
        ];

        expect(router.getRequestUrlRegExp()).toBe('^https?://streams.twitch.tv/kraken/streams/?$');
    });

    it("getRequestUrlRegExp() should return 'undefined' when route isn't supported", function () {
        var router = new Router();
        spyOn(router, '_getCurrentRouteName').and.returnValue('following.index');
        router._routes = [
            { name: 'channels.all', url: '^https?://streams.twitch.tv/kraken/streams/?$' }
        ];

        expect(router.getRequestUrlRegExp()).toBe(undefined);
    });
});