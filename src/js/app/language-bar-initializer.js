var LanguageBar = require('./language-bar.js'),
    Router = require('./router.js');

var LanguageBarInitializer = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
    this._router = new Router();
};

LanguageBarInitializer.prototype = {
    _appender: (function () {
        var anchorSelector = '#directory-list .directory_header > ul.nav';
        var wrapperClass = 'tlf-languageBarContainer-directoryHeader';

        function isAdded() {
            return $(anchorSelector).find('.' + wrapperClass).length !== 0;
        }

        function add() {
            // There is no anchor in DOM yet
            if (!$(anchorSelector).length)
                return;

            var $langBar = (new LanguageBar()).create();
            $(anchorSelector).append($langBar);

            $($langBar).wrap(function () {
                return '<li class="' + wrapperClass + '"></li>';
            });
        }

        function remove() {
            $(anchorSelector).find('.' + wrapperClass).remove();
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

        if (!this._router.isRouteSupported() && this._appender.isAdded())
            this._appender.remove();

        if (!this._router.isRouteSupported())
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