describe("Router", function () {
    var rewire = require("rewire"),
        router;

    beforeEach(function () {
        var Router = rewire('../src/js/app/router.js');
        require('../src/js/core/array-helpers.js');
        require('./helpers/module-setup.js')(Router);

        router = new Router();
        router._routes = [{ name: 'channels.all' }, { name: 'game-directory.index' }];
    });

    function spyOnTwitchRouter(router, currentRoute, targetRoute) {
        var twitchRouter = {
            currentRouteName: currentRoute,
            targetState: {
                routerJs: {
                    activeTransition: null
                }
            }
        };

        if (typeof targetRoute !== 'undefined')
            twitchRouter.targetState.routerJs.activeTransition = {
                targetName: targetRoute
            };

        return spyOn(router, '_getTwitchRouter').and.returnValue(twitchRouter);
    };

    describe("getCurrentRoute()", function () {
        it("should return value when route is supported", function () {
            spyOnTwitchRouter(router, 'channels.all');

            var result = router.getCurrentRoute();

            expect(result.name).toBe('channels.all');
        });

        it("shouldn't return value when route isn't supported", function () {
            spyOnTwitchRouter(router, 'following.index');

            var result = router.getCurrentRoute();

            expect(result).toBe(undefined);
        });
    });

    describe("getTargetOrCurrentRoute()", function () {
        it("should return value for TargetRoute when TargetRoute is supported, CurrentRoute is supported", function () {
            spyOnTwitchRouter(router, 'channels.all', 'game-directory.index');

            var result = router.getTargetOrCurrentRoute();

            expect(result.name).toBe('game-directory.index');
        });

        it("shouldn't return value when TargetRoute isn't supported, CurrentRoute is supported", function () {
            spyOnTwitchRouter(router, 'channels.all', 'following.index');

            var result = router.getTargetOrCurrentRoute();

            expect(result).toBe(undefined);
        });

        it("should return value for CurrentRoute when TargetRoute not found, CurrentRoute is supported", function () {
            spyOnTwitchRouter(router, 'channels.all');

            var result = router.getTargetOrCurrentRoute();

            expect(result.name).toBe('channels.all');
        });

        it("should return value for TargetRoute when TargetRoute is supported, CurrentRoute isn't supported", function () {
            spyOnTwitchRouter(router, 'following.index', 'game-directory.index');

            var result = router.getTargetOrCurrentRoute();

            expect(result.name).toBe('game-directory.index');
        });

        it("shouldn't return value when TargetRoute isn't supported, CurrentRoute isn't supported", function () {
            spyOnTwitchRouter(router, 'following.index', 'following.index');

            var result = router.getTargetOrCurrentRoute();

            expect(result).toBe(undefined);
        });

        it("shouldn't return value when TargetRoute not found, CurrentRoute isn't supported", function () {
            spyOnTwitchRouter(router, 'following.index');

            var result = router.getTargetOrCurrentRoute();

            expect(result).toBe(undefined);
        });
    });

    describe("_getCurrentRouteName()", function () {
        it("should throw error if route cannot be fetched", function () {
            spyOn(router, '_getTwitchRouter').and.returnValue({});

            expect(router._getCurrentRouteName).toThrowError();
        });
    });
});
