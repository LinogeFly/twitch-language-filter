xdescribe("Interceptor", function () {
    var rewire = require('rewire'),
        interceptor;

    beforeEach(function () {
        Twitch = {
            api: {
                get: function () { }
            }
        };

        window = {
            localStorage: {
                getItem: function () { return 'en' }
            }
        };

        document = {
            URL: 'https://www.twitch.tv/directory'
        };

        var Interceptor = rewire('../src/js/app/interceptor.js');
        require('./helpers/module-setup.js')(Interceptor);

        interceptor = new Interceptor();
    });

    it("should call original function", function () {
        var called = false;
        Twitch.api.get = function () { called = true; }
        interceptor.applyToGet();

        Twitch.api.get();

        expect(called).toBe(true);
    });

    it("should call original function if exception occurs", function () {
        var called = false;
        Twitch.api.get = function () { called = true; }
        spyOn(interceptor, '_getEndpoint').and.throwError();
        interceptor.applyToGet();

        Twitch.api.get();

        expect(called).toBe(true);
    });

    it("shouldn't overwrite \"broadcaster_language\" for unsupported URLs", function () {
        var options;
        Twitch.api.get = function (e, t, r) { options = t; }

        var Interceptor = rewire('../src/js/app/interceptor.js');
        Interceptor.__set__('isAllowedUrl', function () { return false; });
        interceptor = new Interceptor();

        spyOn(interceptor, '_getEndpoint').and.returnValue('streams');
        interceptor.applyToGet();

        Twitch.api.get('streams', {});

        expect(options.broadcaster_language).toBe(undefined);
    });

    it("should overwrite \"broadcaster_language\" when endpoint match is found", function () {
        var options;
        Twitch.api.get = function (e, t, r) { options = t; }

        var Interceptor = rewire('../src/js/app/interceptor.js');
        Interceptor.__set__('isAllowedUrl', function () { return true; });
        interceptor = new Interceptor();

        spyOn(interceptor, '_getEndpoint').and.returnValue('streams');
        interceptor.applyToGet();

        Twitch.api.get('streams', {});

        expect(options.broadcaster_language).toBe('en');
    });

    it("shouldn't overwrite \"broadcaster_language\" when endpoint match is not found", function () {
        var options;
        Twitch.api.get = function (e, t, r) { options = t; }

        var Interceptor = rewire('../src/js/app/interceptor.js');
        Interceptor.__set__('isAllowedUrl', function () { return true; });
        interceptor = new Interceptor();

        spyOn(interceptor, '_getEndpoint').and.returnValue('streams');
        interceptor.applyToGet();

        Twitch.api.get('not-streams', {});

        expect(options.broadcaster_language).toBe(undefined);
    });

    it("should search endpoint match from top to bottom", function () {
        interceptor._endpoints = [
            {
                url: '^https://www.twitch.tv/directory/following/?$',
                endpoint: 'follows'
            },
            {
                url: '^https://www.twitch.tv/directory/?.*$',
                endpoint: 'streams'
            }
        ];

        expect(interceptor._getEndpoint('https://www.twitch.tv/directory/following')).toBe('follows');
        expect(interceptor._getEndpoint('https://www.twitch.tv/directory/all')).toBe('streams');
    });

    it("shouldn't return endpoint if there is no match", function () {
        expect(interceptor._getEndpoint('http://contoso.com')).toBe(undefined);
    });
});
