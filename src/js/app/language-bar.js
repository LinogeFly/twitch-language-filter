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
        (new LanguageBar()).init($header);
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

var LanguageBar = function (storage) {
    this.storage = storage;

    /*jshint multistr: true */
    this.layout = '\
        <div class="tlf-languageBar">\
            <a href="javascript:void(0);" class="tlf-languageBar-current">EN</a>\
            <ul class="tfl-languageBar-menu" style="display: none;">\
                <li data-code="en">English</li>\
                <li data-code="da">Dansk</li>\
                <li data-code="de">Deutsch</li>\
                <li data-code="es">Español</li>\
                <li data-code="fr">Français</li>\
                <li data-code="it">Italiano</li>\
                <li data-code="hu">Magyar</li>\
                <li data-code="nl">Nederlands</li>\
                <li data-code="no">Norsk</li>\
                <li data-code="pl">Polski</li>\
                <li data-code="pt">Português</li>\
                <li data-code="sk">Slovenčina</li>\
                <li data-code="fi">Suomi</li>\
                <li data-code="sv">Svenska</li>\
                <li data-code="vi">Tiếng Việt</li>\
                <li data-code="tr">Türkçe</li>\
                <li data-code="cs">Čeština</li>\
                <li data-code="bg">Български</li>\
                <li data-code="ru">Русский</li>\
                <li data-code="ar">العربية</li>\
                <li data-code="th">ภาษาไทย</li>\
                <li data-code="zh">中文</li>\
                <li data-code="ja">日本語</li>\
                <li data-code="ko">한국어</li>\
            </ul>\
        </div>\
    ';
};

LanguageBar.prototype = (function() {
    function init ($insertBeforeElem) {
        var self = this;

        // Create component

        var $container = $(self.layout);
        var $menu = $container.find('.tfl-languageBar-menu');
        var $button = $container.find('.tlf-languageBar-current');
        var $langItems = $menu.find('li');

        // Add event handlers

        $button.click(function (e) {
            e.stopPropagation();

            // Save menu visibility status before hiding all menus
            var isVisible = $menu.is(':visible');

            // Hide all menus (there could be multiple language bar components on the page)
            $('.tfl-languageBar-menu').hide();

            // Toggle menu
            if (isVisible) $menu.hide(); else $menu.show();
        });

        $menu.click(function (e) {
            e.stopPropagation();
        });

        $(document).click(function () {
            $menu.hide();
        });

        $langItems.click(function () {
            $menu.hide();
            language_changed();
        });

        // Add component to DOM
        $insertBeforeElem.before($container);
    }

    function language_changed() {
        console.log('Language changed');
    }

    return {
        init: init
    };
})();
