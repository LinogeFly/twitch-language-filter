var Storage = require('./storage.js');
var constants = require('./constants.js');

var LanguageBar = function () {
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

LanguageBar.prototype = (function () {
    function create() {
        var self = this;

        // Create component

        var $component = $(self.layout);
        var $menu = $component.find('.tfl-languageBar-menu');
        var $button = $component.find('.tlf-languageBar-current');
        var $langItems = $menu.find('li');

        // Binding

        self._bind($component);

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

            var langCode = $(this).data('code');
            self._languageChanged($component, langCode);
        });

        return $component;
    }

    function _bind($component) {
        var langCode = (new Storage()).get(constants.storageKeys.language, 'en');
        $component.find('.tlf-languageBar-current').text(langCode);
    }

    function _languageChanged($component, langCode) {
        // Save new language
        (new Storage()).set(constants.storageKeys.language, langCode);

        // Re-bind
        this._bind($component);

        // Reload page
        location.reload();
    }

    return {
        _languageChanged: _languageChanged,
        _bind: _bind,
        create: create
    };
})();

module.exports = LanguageBar;