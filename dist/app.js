(function() {(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Cookies.js - 1.2.2
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }
            
            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

            return value === undefined ? undefined : decodeURIComponent(value);
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };

    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],2:[function(require,module,exports){
module.exports = {
    logLevel: "Error"
};
},{}],3:[function(require,module,exports){
module.exports = {
    storageKeys: {
        language: "Language",
        isDisabled: "IsDisabled"
    }
};
},{}],4:[function(require,module,exports){
var log = require('./log.js'),
    Storage = require('./storage.js'),
    Router = require('./router.js');

require('../core/string-helpers.js');

var Interceptor = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
    this._router = new Router();
    this._storage = new Storage();
};

Interceptor.prototype = {
    _onDomMutation: function (mutations) {
        if (!window.App || !window.Twitch || !window.jQuery)
            return;

        this._apply();
        this._stop();
    },
    _stop: function () {
        this._observer.disconnect();
    },
    _apply: function () {
        var self = this,
            ori = jQuery.ajax;

        jQuery.ajax = function (e) {
            try {
                var route = self._router.getTargetOrCurrentRoute(),
                    isRouteSupported = typeof route !== 'undefined';

                // Proceed next only for supported routes
                if (!isRouteSupported)
                    return ori.apply(this, arguments); // Call original $.ajax

                // Proceed next only when filtering is not disabled
                if (self._storage.isDisabled())
                    return ori.apply(this, arguments); // Call original $.ajax

                // Proceed next only if request is supported
                if (!(new RegExp(route.requestUrlRegExp).test(e.url)))
                    return ori.apply(this, arguments); // Call original $.ajax

                // Proceed next only if 'broadcaster_language' is empty
                if (e.data.broadcaster_language)
                    return ori.apply(this, arguments); // Call original $.ajax

                // Finbally we're here!
                // Set broadcaster_language parameter in the request
                var lang = self._storage.getLanguage();
                e.data.broadcaster_language = lang;
                log.debug('broadcaster_language was intercepted and set to "{0}"'.format(lang));
            } catch (err) {
                log.error(err);
            }

            // Call original $.ajax
            return ori.apply(this, arguments); 
        };
    },
    start: function() {
        this._observer.observe(document, {
            childList: true,
            subtree: true,
            characterData: true
        });
    },
};

module.exports = Interceptor;
},{"../core/string-helpers.js":11,"./log.js":7,"./router.js":9,"./storage.js":10}],5:[function(require,module,exports){
var LanguageBar = require('./language-bar.js'),
    Router = require('./router.js');

var LanguageBarInitializer = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    this._observer = new MutationObserver(this._onDomMutation.bind(this));
    this._router = new Router();
};

LanguageBarInitializer.prototype = {
    _appender: (function () {
        var buttonAnchorSelector = '#directory-list .directory_header .title';
        var menuAnchorSelector = '#main_col .tse-content';
        var wrapperId = 'tlf-languageBar-follow';

        function isAdded() {
            return $(buttonAnchorSelector).find('#' + wrapperId).length !== 0;
        }

        function add() {
            // There is no anchor in DOM yet
            if (!$(buttonAnchorSelector).length)
                return;

            var langBar = (new LanguageBar()).create();

            // Add language button
            $(buttonAnchorSelector).append(langBar.$button);
            $(langBar.$button).wrap(function () {
                return '<span id="' + wrapperId + '" class="follow-button"><div class="follow"></div></span>';
            });

            // Add language selection menu
            $(menuAnchorSelector).prepend(langBar.$menu);
        }

        function remove() {
            $(buttonAnchorSelector).find('#' + wrapperId).remove();
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

        var route = this._router.getCurrentRoute(),
            isRouteSupported = typeof route !== 'undefined';

        if (!isRouteSupported && this._appender.isAdded()) {
            this._appender.remove();
            return;
        }

        if (!isRouteSupported)
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
},{"./language-bar.js":6,"./router.js":9}],6:[function(require,module,exports){
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
},{"./constants.js":3,"./storage.js":10}],7:[function(require,module,exports){
var config = require('./config');

module.exports = {
    error: function (message) {
        if (config.logLevel.toLowerCase() === "none")
            return;

        console.log('TLF ERROR: ' + message);
    },
    debug: function (message) {
        if (config.logLevel.toLowerCase() === "none")
            return;

        if (config.logLevel.toLowerCase() === "error")
            return;

        console.log('TLF DEBUG: ' + message);
    }
};
},{"./config":2}],8:[function(require,module,exports){
var LanguageBarInitializer = require('./language-bar-initializer.js'),
    Interceptor = require('./interceptor.js');

(new Interceptor()).start();
(new LanguageBarInitializer()).start();

},{"./interceptor.js":4,"./language-bar-initializer.js":5}],9:[function(require,module,exports){
var log = require('./log.js');
require('../core/string-helpers.js');

var Router = function () { };

Router.prototype = {
    _routes: [
        { name: 'directory.game.index', requestUrlRegExp: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'directory.channels.all', requestUrlRegExp: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'directory.channels.psFour', requestUrlRegExp: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'directory.channels.xbOne', requestUrlRegExp: '^https?://streams.twitch.tv/kraken/streams/?$' }
    ],
    _getTwitchRouter: function() {
        return App.__container__.lookup('router:main');
    },
    _getTargetOrCurrentRouteName: function () {
        var twitchRouter = this._getTwitchRouter();

        // Return Target Route if it's found since Current Route might be not up to date.
        // Usually Current Route is "Loading" or something like that in such cases.

        var targetRouteName = '';
        if (twitchRouter.targetState.routerJs.activeTransition !== null)
            targetRouteName = twitchRouter.targetState.routerJs.activeTransition.targetName;

        if (targetRouteName !== '')
            return targetRouteName;

        // Otherwise return name of the Current Route
        return this._getCurrentRouteName();
    },
    _getCurrentRouteName: function () {
        var twitchRouter = this._getTwitchRouter();

        if (!twitchRouter.currentRouteName)
            throw 'Unable to fetch current route from Twitch Ember Router.';
        else
            return twitchRouter.currentRouteName;
    },
    getTargetOrCurrentRoute: function () {
        var name = this._getTargetOrCurrentRouteName();

        return this._routes.find(function (x) {
            return x.name.toLowerCase() === name.toLowerCase();
        });
    },
    getCurrentRoute: function() {
        var name = this._getCurrentRouteName();

        return this._routes.find(function (x) {
            return x.name.toLowerCase() === name.toLowerCase();
        });
    }
};

module.exports = Router;
},{"../core/string-helpers.js":11,"./log.js":7}],10:[function(require,module,exports){
var cookies = require('cookies-js'),
    log = require('./log.js'),
    constants = require('./constants.js');

var Storage = function () {
    this._localStorageSupport = true;
    this._prefix = 'TwitchLanguageFilter.';

    if (!window.localStorage) {
        log.error('LocalStorage is not supported.');
        this._localStorageSupport = false;
    }
};

Storage.prototype = {
    get: function (name, defaultValue) {
        /* jshint ignore:start */
        var defaultValue = typeof defaultValue !== 'undefined' ? defaultValue : '';
        /* jshint ignore:end */
        var fullName = this._prefix + name;
        var result;

        if (this._localStorageSupport)
            result = window.localStorage.getItem(fullName);
        else
            result = cookies.get(fullName);

        if (typeof result === 'undefined' || result === '' || result === null)
            return defaultValue;

        return result;
    },
    set: function (name, value) {
        var fullName = this._prefix + name;

        if (this._localStorageSupport)
            window.localStorage.setItem(fullName, value);
        else
            cookies.set(fullName, value, { expires: Infinity });
    },
    getLanguage: function () {
        return this.get(constants.storageKeys.language, 'en');
    },
    isDisabled: function () {
        return this.get(constants.storageKeys.isDisabled, 'false') === 'true';
    }
};

module.exports = Storage;
},{"./constants.js":3,"./log.js":7,"cookies-js":1}],11:[function(require,module,exports){
if (!String.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
},{}]},{},[8]);
}());