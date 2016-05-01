var log = require('./log.js');
var Storage = require('./storage.js');
var constants = require('./constants.js');
require('../core/array-helpers.js');
require('../core/string-helpers.js');

var Interceptor = function () { };

Interceptor.prototype = {
    // Order does matter here.
    // Matching check goes from top to bottom, so URLs should be defined in Specific-to-General pattern
    _endpoints: [
        {
            url: '^https?://([a-zA-Z]+\.)?twitch.tv/directory/?.*$',
            endpoint: 'streams'
        },
    ],
    _getEndpoint: function (url) {
        var ep = this._endpoints.find(function (x) {
            return (new RegExp(x.url)).test(decodeURIComponent(url));
        });

        if (typeof ep !== 'undefined')
            return ep.endpoint;
    },
    applyToGet: function () {
        var self = this,
            ori = Twitch.api.get;

        Twitch.api.get = function (e, t, r) {
            try {
                // TODO: Check if current  URL is allowed

                // Get endpoint to overwrite
                var endpoint = self._getEndpoint(document.URL);
                if (typeof endpoint === 'undefined')
                    throw 'Endpoint not found for "{0}"'.format(document.URL);

                // Overwrite/set language
                if (typeof t !== 'undefined' && e === endpoint) {
                    var lang =  (new Storage()).getLanguage();
                    t.broadcaster_language = lang;
                    log.debug('broadcaster_language was intercepted and set to "{0}"'.format(lang));
                }
            } catch (err) {
                log.error(err);
            }

            // Call original
            return ori.apply(this, arguments);
        };
    },
    applyToGet2: function () {
        var self = this,
            ori = Twitch.api._ajax;

        Twitch.api._ajax = function (s, o, u, a) {
            try {
                if (s.toLowerCase() === 'get') {
                    var router = App.__container__.lookup('router:main');
                    var currentRouteName = router.currentRouteName;

                    var targetRouteName = '';
                    if (router.targetState.routerJs.activeTransition !== null)
                        targetRouteName = router.targetState.routerJs.activeTransition.targetName;

                    log.debug('endpoint "{0}", targetRouteName "{1}", currentRouteName "{2}"'.format(o, targetRouteName, currentRouteName));
                }
            } catch (err) {
                log.error(err);
            }

            return ori.apply(this, arguments);
        }
    }
};

module.exports = Interceptor;