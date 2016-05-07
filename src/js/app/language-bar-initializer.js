var LanguageBar = require('./language-bar.js'),
    Router = require('./router.js');

var LanguageBarInitializer = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
    this._router = new Router();
};

LanguageBarInitializer.prototype = {
    _appender: (function () {
        var buttonAnchorSelector = '#directory-list .directory_header .title';
        var menuAnchorSelector = '#main_col .tse-content';
        var wrapperId = 'tlf-languageBar-follow';

        function isAdded() {
            return $(buttonAnchorSelector).find('#' + wrapperId).length !== 0;
        }

        function add() {
            // There is no anchor in DOM yet
            if (!$(buttonAnchorSelector).length)
                return;

            var langBar = (new LanguageBar()).create();

            // Add language button
            $(buttonAnchorSelector).append(langBar.$button);
            $(langBar.$button).wrap(function () {
                return '<span id="' + wrapperId + '" class="follow-button"><div class="follow"></div></span>';
            });

            // Add language selection menu
            $(menuAnchorSelector).prepend(langBar.$menu);
        }

        function remove() {
            $(buttonAnchorSelector).find('#' + wrapperId).remove();
        }

        return {
            add: add,
            remove: remove,
            isAdded: isAdded
        };
    })(),
    _onDomMutation: function (mutations) {
        if (!window.App || !window.Twitch || !window.jQuery)
            return;

        var route = this._router.getCurrentRoute(),
            isRouteSupported = typeof route !== 'undefined';

        if (!isRouteSupported && this._appender.isAdded()) {
            this._appender.remove();
            return;
        }

        if (!isRouteSupported)
            return;

        if (this._appender.isAdded())
            return;

        this._stop();
        this._appender.add();
        this.start();
    },
    _stop: function () {
        this._observer.disconnect();
    },
    start: function () {
        this._observer.observe(document, {
            childList: true,
            subtree: true
        });
    }
};

module.exports = LanguageBarInitializer;