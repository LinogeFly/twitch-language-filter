var log = require('./log.js');

var Router = function () { };

Router.prototype = {
    _routes: [
        {
            name: 'game-directory.index',
            endpoint: 'streams'
        },
        {
            name: 'channels.all',
            endpoint: 'streams'
        },
        {
            name: 'channels.random',
            endpoint: 'beta/streams/random'
        }
    ],
    isRouteSupported: function () {

    },
    getEndpoint: function () {

    }
};

module.exports = Router;