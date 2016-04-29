var LanguageBar = require('./language-bar.js');

var LanguageBarInitializer = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
};

LanguageBarInitializer.prototype = {
    _allowedUrls: [
        '^https?://([a-zA-Z]+\.)?twitch.tv/directory/all(/?|/.+)$',
        '^https?://([a-zA-Z]+\.)?twitch.tv/directory/random/?$',
        '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/[^/]*/?$',
        '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/Counter-Strike: Global Offensive/map/.+$'
    ],
    _appender: (function () {
        var anchorSelector = '#directory-list .directory_header > ul.nav';
        var wrapperClass = 'tlf-languageBarContainer-directoryHeader';

        function isAdded() {
            return $(anchorSelector).find('.' + wrapperClass).length !== 0;
        }

        function add() {
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
        var isUrlAllowed = this._isUrlAllowed(document.URL);

        if (!isUrlAllowed && this._appender.isAdded())
            this._appender.remove();

        if (!isUrlAllowed)
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
    _isUrlAllowed: function (url) {
        return this._allowedUrls.some(function (x) {
            return (new RegExp(x)).test(decodeURIComponent(url));
        });
    },
    start: function () {
        this._observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

module.exports = LanguageBarInitializer;