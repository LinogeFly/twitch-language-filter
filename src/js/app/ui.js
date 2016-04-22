var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var Ui = function () { };
Ui.prototype = {
    initLanguageBar: function (storage) {
        var directoryHeaderAppender = (function () {
            var anchorSelector = '#directory-list > div.streams-grid.items-grid > div.directory_header > ul';
            var wrapperClass = 'tlf-languageBarContainer-directoryHeader';

            function isAdded() {
                return $(anchorSelector).find('.' + wrapperClass).length !== 0;
            }

            function add() {
                if (isAdded())
                    return;

                var $langBar = (new LanguageBar(storage)).create();
                $(anchorSelector).append($langBar);

                $($langBar).wrap(function () {
                    return '<li class="' + wrapperClass + '"></li>';
                });
            }

            return {
                add: add
            };
        })();

        var routes = [
            { urlPattern: '^https?://([a-zA-Z]+\.)?twitch.tv/directory/?$', domModifySelector: '.section_header.first > .title', appender: directoryHeaderAppender }
        ];

        var observer = new MutationObserver(function (mutations) {
            var route = routes[0];

            // TODO: Check URL pattern

            if (!isNodeAdded(mutations, route.domModifySelector))
                return;

            // TODO: Check if isAddedTo

            stop();
            route.appender.add();
            start();
        });

        function isNodeAdded(mutations, selector) {
            return mutations.some(function (item) {
                return $(item.addedNodes).find(selector).length !== 0;
            });
        }

        function start() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function stop() {
            observer.disconnect();
        }

        start();
    }
};