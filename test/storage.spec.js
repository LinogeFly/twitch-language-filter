describe("Storage", function () {
    var rewire = require("rewire");
    var Storage = rewire('../src/js/app/storage.js');

    require('./helpers/module-setup.js')(Storage);

    beforeEach(function () {
        window = {};
    });

    describe("set()", function () {
        it("should put value to localStorage if it's available", function () {
            window.localStorage = {
                setItem: function () { }
            };
            var storage = new Storage();
            spyOn(window.localStorage, 'setItem');

            storage.set('Language', 'en');

            expect(window.localStorage.setItem).toHaveBeenCalledWith('TwitchLanguageFilter.Language', 'en');
        });

        it("should put value to cookies if localStorage isn't available", function () {
            var cookiesFake = {
                set: function () { }
            };
            spyOn(cookiesFake, 'set');
            Storage.__set__('cookies', cookiesFake);
            var storage = new Storage();

            storage.set('Language', 'en');

            expect(cookiesFake.set).toHaveBeenCalledWith('TwitchLanguageFilter.Language', 'en', jasmine.any(Object));
        });
    });

    describe("get()", function () {
        it("should get value from localStorage if it's available", function () {

        });

        it("should get value from cookies if localStorage isn't available", function () {

        });

        it("should return value that has been set", function () {

        });

        it("should return default value if it hasn't been set yet", function () {

        });
    });
});