var allowedUrls = [
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/all(/?|/.+)$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/random/?$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/[^/]*/?$',
    '^https?://([a-zA-Z]+\.)?twitch.tv/directory/game/Counter-Strike: Global Offensive/map/.+$'
];

module.exports = function isAllowedUrl() {
    return allowedUrls.some(function (x) {
        return (new RegExp(x)).test(decodeURIComponent(document.URL));
    });
};