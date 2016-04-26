(function () {
    var f = Twitch.api.get;
    Twitch.api.get = function (e, t, r) {
        if (e === 'streams') {
            arguments[1].broadcaster_language = 'en';
        }

        return f.apply(this, arguments);
    };
})();