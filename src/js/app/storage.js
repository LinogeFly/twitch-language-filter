var cookies = require('cookies-js'),
    log = require('./log.js'),
    constants = require('./constants.js');

var Storage = function () {
    this._localStorageSupport = true;
    this._prefix = 'TwitchLanguageFilter.';

    if (!window.localStorage) {
        log.error('LocalStorage is not supported.');
        this._localStorageSupport = false;
    }
};

Storage.prototype = {
    get: function (name, defaultValue) {
        /* jshint ignore:start */
        var defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : '';
        /* jshint ignore:end */
        var fullName = this._prefix + name;
        var result;

        if (this._localStorageSupport)
            result = window.localStorage.getItem(fullName);
        else
            result = cookies.get(fullName);

        if (typeof result === 'undefined' || result === '' || result === null)
            return defaultValue;

        return result;
    },
    set: function (name, value) {
        var fullName = this._prefix + name;

        if (this._localStorageSupport)
            window.localStorage.setItem(fullName, value);
        else
            cookies.set(fullName, value, { expires: Infinity });
    },
    getLanguage: function () {
        return this.get(constants.storageKeys.language, 'en');
    },
    isDisabled: function () {
        return this.get(constants.storageKeys.isDisabled, 'false') === 'true';
    }
};

module.exports = Storage;