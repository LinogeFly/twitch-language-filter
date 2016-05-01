var LanguageBar = require('./language-bar.js');
var isAllowedUrl = require('./allowed-url.js');

var LanguageBarInitializer = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
};

LanguageBarInitializer.prototype = {
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
        if (!isAllowedUrl() && this._appender.isAdded())
            this._appender.remove();

        if (!isAllowedUrl())
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
        this._observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

module.exports = LanguageBarInitializer;