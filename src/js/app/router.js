var log = require('./log.js');
require('../core/string-helpers.js');

var Router = function () { };

Router.prototype = {
    _routes: [
        { name: 'game-directory.index', url: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'channels.all', url: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'channels.random', url: '^https?://api.twitch.tv/kraken/beta/streams/random/?$' },
        { name: 'channels.psFour', url: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'channels.xbOne', url: '^https?://streams.twitch.tv/kraken/streams/?$' },
        { name: 'csgo.channels.index', url: '^https?://api.twitch.tv/api/cs/?$' },
        { name: 'csgo.channels.filtered', url: '^https?://api.twitch.tv/api/cs/?$' }
    ],
    _getTwitchRouter: function() {
        return App.__container__.lookup('router:main');
    },
    _getCurrentRouteName: function () {
        var twitchRouter = this._getTwitchRouter();

        // Return Target Route if it's found since Current Route might be not up to date.
        // Usually Current Route is "Loading" or something like that in such cases.

        var targetRouteName = '';
        if (twitchRouter.targetState.routerJs.activeTransition !== null)
            targetRouteName = twitchRouter.targetState.routerJs.activeTransition.targetName;

        if (targetRouteName !== '')
            return targetRouteName;

        // Otherwise return Current Route
        if (!twitchRouter.currentRouteName)
            throw 'Unable to fetch current route from Twitch Ember Router.';
        else
            return twitchRouter.currentRouteName;
    },
    _getCurrentRoute: function() {
        var name = this._getCurrentRouteName();

        return this._routes.find(function (x) {
            return x.name.toLowerCase() === name.toLowerCase();
        });
    },
    isRouteSupported: function () {
        return (typeof this._getCurrentRoute() !== 'undefined');
    },
    getRequestUrlRegExp: function () {
        var route = this._getCurrentRoute();

        if (typeof route !== 'undefined')
            return route.url;
    }
};

module.exports = Router;