describe("Storage", function () {
    var rewire = require("rewire"),
        Storage;

    beforeEach(function () {
        window = {};

        Storage = rewire('../src/js/app/storage.js');
        require('./helpers/module-setup.js')(Storage);
    });

    describe("set()", function () {
        it("should put value to localStorage if it's available", function () {
            var storedVal = '';
            window.localStorage = {
                setItem: function (name, val) { storedVal = val; }
            };

            (new Storage()).set('Language', 'en');

            expect(storedVal).toBe('en');
        });

        it("should put value to cookies if localStorage isn't available", function () {
            var storedVal = '';
            var cookiesFake = {
                set: function (name, val) { storedVal = val; }
            };
            spyOn(cookiesFake, 'set').and.callThrough();
            Storage.__set__('cookies', cookiesFake);

            (new Storage()).set('Language', 'en');

            expect(storedVal).toBe('en');
        });
    });

    describe("get()", function () {
        it("should get value from localStorage if it's available", function () {
            window.localStorage = {
                getItem: function () { return 'en'; }
            };

            expect((new Storage()).get('Language')).toBe('en');
        });

        it("should get value from cookies if localStorage isn't available", function () {
            var cookiesFake = {
                get: function () { return 'en'; }
            };
            spyOn(cookiesFake, 'get').and.callThrough();
            Storage.__set__('cookies', cookiesFake);

            expect((new Storage()).get('Language')).toBe('en');
        });

        it("should return default value if it hasn't been set yet", function () {
            window.localStorage = {
                getItem: function () { }
            };

            expect((new Storage()).get('Language', 'en')).toBe('en');
        });
    });

    describe("getLanguage()", function () {
        it("should return 'en' by default", function () {
            window.localStorage = {
                getItem: function () { }
            };

            expect((new Storage()).getLanguage()).toBe('en');
        });
    });
});