var LanguageBarInitializer = require('./language-bar-initializer.js'),
    Interceptor = require('./interceptor.js');

(new Interceptor()).start();
(new LanguageBarInitializer()).start();
