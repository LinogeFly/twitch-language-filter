// Set ups rewired module(s) for testing
// For example, disables logging so it doesn't spam test results

module.exports = setup = function (rewiredModule) {
    function apply(mod) {
        mod.__set__('log', {
            error: function () { },
            debug: function () { }
        });
    };

    if (Array.isArray(rewiredModule)) {
        rewiredModule.forEach(function (mod) {
            apply(mod);
        })
    } else {
        apply(rewiredModule);
    }
};
