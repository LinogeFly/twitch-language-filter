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
                    <li data-action="disable">(Pause Filter)</li>\
                    <li data-action="enable">(Unpause Filter)</li>\
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
            var $this = $(this);

            component.$menu.hide();

            var langCode = $this.data('code');
            if (langCode)
                self._language_click(component, langCode);

            if ($this.data('action') === 'enable')
                self._enable_click(component);

            if ($this.data('action') === 'disable')
                self._disable_click(component);
        });

        return component;
    }

    function _bind(component) {
        var storage = new Storage();

        component.$button.find('.tlf-languageBar-current').text(storage.getLanguage());
        component.$button.toggleClass('tlf-disabled', storage.isDisabled());
        component.$menu.find('[data-action=disable]').toggle(!storage.isDisabled());
        component.$menu.find('[data-action=enable]').toggle(storage.isDisabled());
    }

    function _disable_click(component) {
        // Turn off "isDisabled" status
        (new Storage()).set(constants.storageKeys.isDisabled, 'true');

        // Re-bind
        this._bind(component);

        // Reload page
        location.reload();
    }

    function _enable_click(component) {
        // Turn on "isDisabled" status
        (new Storage()).set(constants.storageKeys.isDisabled, 'false');

        // Re-bind
        this._bind(component);

        // Reload page
        location.reload();
    }

    function _language_click(component, langCode) {
        var storage = new Storage();

        // Save new language
        storage.set(constants.storageKeys.language, langCode);
        // Turn off "isDisabled" status
        storage.set(constants.storageKeys.isDisabled, 'false');

        // Re-bind
        this._bind(component);

        // Reload page
        location.reload();
    }

    function _setMenuPosition(component) {
        var button = component.$button[0],
            menu = component.$menu[0],
            menuParent = component.$menu.parent()[0];

        // Top
        var top = button.getBoundingClientRect().top + button.offsetHeight + 8;

        // Left
        var left = button.getBoundingClientRect().left - menu.offsetWidth + button.offsetWidth;
        // Adjust left if goes outside of its parent
        var parentLeft = menuParent.getBoundingClientRect().left;
        if (left < parentLeft)
            left = parentLeft;

        component.$menu.offset({ 'top': top, 'left': left });
    }

    return {
        _disable_click: _disable_click,
        _enable_click: _enable_click,
        _language_click: _language_click,
        _bind: _bind,
        _setMenuPosition: _setMenuPosition,
        create: create
    };
})();

module.exports = LanguageBar;