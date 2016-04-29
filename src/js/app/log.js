var config = require('./config');

module.exports = {
    error: function (message) {
        if (config.logLevel.toLowerCase() != "error")
            return;

        console.log('TFL ERROR: ' + message);
    },
    debug: function (message) {
        if (config.logLevel.toLowerCase() === "none")
            return;

        console.log('TFL DEBUG: ' + message);
    }
};