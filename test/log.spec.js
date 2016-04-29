describe("Log module", function () {
    var rewire = require("rewire");
    var log = rewire('../src/js/app/log.js');

    function setLogLevel(level) {
        log.__set__('config', {
            logLevel: level
        });
    };

    describe("error()", function () {
        it("shouldn't write if level is 'Verbose'", function () {
            setLogLevel('Verbose');
            spyOn(console, 'log');

            log.error('Test message');

            expect(console.log.calls.count()).toBe(0);
        });

        it("should write if level is 'Error'", function () {
            setLogLevel('Error');
            spyOn(console, 'log');

            log.error('Test message');

            expect(console.log).toHaveBeenCalled();
        });

        it("shouldn't write if level is 'None'", function () {
            setLogLevel('None');
            spyOn(console, 'log');

            log.error('Test message');

            expect(console.log.calls.count()).toBe(0);
        });
    });

    describe("debug()", function () {
        it("should write if level is 'Verbose'", function () {
            setLogLevel('Verbose');
            spyOn(console, 'log');

            log.debug('Test message');

            expect(console.log).toHaveBeenCalled();
        });

        it("should write if level is 'Error'", function () {
            setLogLevel('Error');
            spyOn(console, 'log');

            log.debug('Test message');

            expect(console.log).toHaveBeenCalled();
        });

        it("shouldn't write if level is 'None'", function () {
            setLogLevel('None');
            spyOn(console, 'log');

            log.debug('Test message');

            expect(console.log.calls.count()).toBe(0);
        });
    });
});