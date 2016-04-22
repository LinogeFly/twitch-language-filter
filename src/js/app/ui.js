var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var Ui = function () { };
Ui.prototype = {
    initLanguageBar: function (storage) {
        var allowedUrls = [
            '^https?://([a-zA-Z]+\.)?twitch.tv/directory/all(/?|/.+)$'
        ];

        var languageBarAppender = (function () {
            var anchorSelector = '#directory-list .directory_header > ul.nav';
            var wrapperClass = 'tlf-languageBarContainer-directoryHeader';

            function isAdded() {
                return $(anchorSelector).find('.' + wrapperClass).length !== 0;
            }

            function add() {
                var $langBar = (new LanguageBar(storage)).create();
                $(anchorSelector).append($langBar);

                $($langBar).wrap(function () {
                    return '<li class="' + wrapperClass + '"></li>';
                });
            }

            return {
                add: add,
                isAdded: isAdded
            };
        })();

        var observer = new MutationObserver(function (mutations) {
            if (!isUrlAllowed(document.URL))
                return;

            if (languageBarAppender.isAdded())
                return;

            stopMutationObserver();
            languageBarAppender.add();
            startMutationObserver();
        });

        function isUrlAllowed(url) {
            return allowedUrls.some(function (x) {
                return (new RegExp(x)).test(decodeURIComponent(url));
            });
        }

        function startMutationObserver() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        function stopMutationObserver() {
            observer.disconnect();
        }

        startMutationObserver();
    }
};