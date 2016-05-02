var LanguageBarInitializer = require('./language-bar-initializer.js');
var Interceptor = require('./interceptor.js');

(new Interceptor()).start();
(new LanguageBarInitializer()).start();
