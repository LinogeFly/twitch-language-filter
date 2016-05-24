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