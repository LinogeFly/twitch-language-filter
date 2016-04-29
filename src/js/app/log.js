var config = require('./config');

module.exports = {
    error: function (message) {
        if (config.logLevel.toLowerCase() === "none")
            return;

        console.log('TLF ERROR: ' + message);
    },
    debug: function (message) {
        if (config.logLevel.toLowerCase() === "none")
            return;

        if (config.logLevel.toLowerCase() === "error")
            return;

        console.log('TLF DEBUG: ' + message);
    }
};