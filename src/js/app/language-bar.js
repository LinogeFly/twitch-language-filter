var Storage = require('./storage.js'),
    constants = require('./constants.js');

var LanguageBar = function () {
    /*jshint multistr: true */
    this._layouts = {
        button: '\
            <div class="tlf-languageBar">\
                <span class="tlf-languageBar-current"></span>\
            </div>',
        menu: '\
            <div class="tlf-languageMenu" style="display: none;">\
                <ul class="tlf-languageMenu-select" >\
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
            </div>'
    };
};

LanguageBar.prototype = (function () {
    /**
     * Creates jQuery elements 'button' and 'menu'
     * @returns {Object}
     */
    function create() {
        var self = this;

        // Create component
        var component = {
            $menu: $(self._layouts.menu),
            $button: $(self._layouts.button)
        };
        var $langItems = component.$menu.find('li');

        // Binding
        self._bind(component);

        // Add event handlers

        component.$button.click(function (e) {
            e.stopPropagation();
            component.$menu.toggle();
            self._setMenuPosition(component);
        });

        component.$menu.click(function (e) {
            e.stopPropagation();
        });

        $(document).click(function () {
            component.$menu.hide();
        });

        $langItems.click(function () {
            component.$menu.hide();

            var langCode = $(this).data('code');
            self._languageChanged(component, langCode);
        });

        return component;
    }

    function _bind(component) {
        component.$button.find('.tlf-languageBar-current').text((new Storage()).getLanguage());
    }

    function _languageChanged(component, langCode) {
        // Save new language
        (new Storage()).set(constants.storageKeys.language, langCode);

        // Re-bind
        this._bind(component);

        // Reload page
        location.reload();
    }

    function _setMenuPosition(component) {
        var top = component.$button.offset().top + component.$button.height() + 10;

        // Default left
        var left = component.$button.offset().left - component.$menu.width() + component.$button.width();
        // Adjust left if goes of parent
        var parentLeft = component.$menu.parent().offset().left;
        if (left < parentLeft)
            left = parentLeft;

        component.$menu.offset({ 'top': top, 'left': left });
    }

    return {
        _languageChanged: _languageChanged,
        _bind: _bind,
        _setMenuPosition: _setMenuPosition,
        create: create
    };
})();

module.exports = LanguageBar;