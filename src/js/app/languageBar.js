(function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
        addLanguageBar(mutations);
    });

    function addLanguageBar(mutations) {
        var $header = getHeader(mutations);
        if (!$header.length)
            return;

        stop();
        $header.before(tlf.layouts.languageBar);
        start();
    }

    function getHeader(mutations) {
        var selector = '.section_header.first > .title';

        if (!isNodeAdded(mutations, selector))
            return $();

        return $(selector);
    }

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
})();