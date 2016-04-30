describe('Interceptor', function () {
    var rewire = require('rewire'),
        interceptor;

    beforeEach(function () {
        Twitch = {
            api: {
                get: function () { }
            }
        };

        document = {
            URL: 'https://www.twitch.tv/directory'
        };

        var Interceptor = rewire('../src/js/app/interceptor.js');
        require('./helpers/module-setup.js')(Interceptor);

        interceptor = new Interceptor();
    });

    it('should call original function', function () {
        var called = false;
        Twitch.api.get = function () { called = true; }
        interceptor.applyToGet();

        Twitch.api.get();

        expect(called).toBe(true);
    });

    it('should add "broadcaster_language" value to original function arguments', function () {
        var options;
        Twitch.api.get = function (e, t, r) { options = t; }
        interceptor.applyToGet();

        Twitch.api.get('streams', {});

        expect(options.broadcaster_language).toBe('en');
    });

    it('should call original function if exception occurs', function () {
        var called = false;
        Twitch.api.get = function () { called = true; }
        spyOn(interceptor, '_getEndpoint').and.throwError();
        interceptor.applyToGet();

        Twitch.api.get();

        expect(called).toBe(true);
    });

    it('should overwrite "broadcaster_language" request option for allowed URLs only', function () {

    });

    it('should search endpoint from top to bottom', function () {
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
        interceptor._endpoints = [
            {
                url: '^https://www.twitch.tv/directory/?.*$',
                endpoint: 'streams'
            }
        ];

        expect(interceptor._getEndpoint('https://google.com')).toBe(undefined);
    });
});