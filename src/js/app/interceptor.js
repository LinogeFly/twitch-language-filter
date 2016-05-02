var log = require('./log.js'),
    Storage = require('./storage.js'),
    Router = require('./router.js');

require('../core/string-helpers.js');

var Interceptor = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
    this._router = new Router();
};

Interceptor.prototype = {
    _onDomMutation: function (mutations) {
        if (!window.App || !window.Twitch || !window.jQuery)
            return;

        this._apply();
        this._stop();
    },
    _stop: function () {
        this._observer.disconnect();
    },
    _apply: function () {
        var self = this,
            ori = jQuery.ajax;

        jQuery.ajax = function (e) {
            try {
                // Proceed next only for supported pages
                if (!self._router.isRouteSupported())
                    return ori.apply(this, arguments); // Call original $.ajax

                // Overwrite/set broadcaster_language parameter in the request
                if (new RegExp(self._router.getRequestUrlRegExp()).test(e.url)) {
                    var lang = (new Storage()).getLanguage();
                    e.data.broadcaster_language = lang;
                    log.debug('broadcaster_language was intercepted and set to "{0}"'.format(lang));
                }
            } catch (err) {
                log.error(err);
            }

            // Call original $.ajax
            return ori.apply(this, arguments); 
        };
    },
    start: function() {
        this._observer.observe(document, {
            childList: true,
            subtree: true,
            characterData: true
        });
    },
};

module.exports = Interceptor;