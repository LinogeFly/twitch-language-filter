var LanguageBarInitializer = require('./language-bar-initializer.js');
var Interceptor = require('./interceptor.js');

(new Interceptor()).applyToGet();
(new LanguageBarInitializer()).start();
