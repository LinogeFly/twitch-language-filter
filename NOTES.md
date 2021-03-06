# Notes

## Filter by routes instead of URLs

There is a problem with URLs when it comes to interceptor inplementation. The thing is that `document.URL` is not up to date during Twitch.api.get request. So it's not possible to have interception only for specific URLs. However, it's possible to use Ember routing engine. This is how we get a router object:
```javascript
var router = App.__container__.lookup('router:main')
```

We can use `currentRouteName` property of the router. However, during streams loading request `currentRouteName` is not up to date so we shoud use `targetRouteName` instead. It can be accessed like this:
```javascript
var router = App.__container__.lookup('router:main');
router.targetState.routerJs.activeTransition.targetName;
```
Beautiful isn't it? :) Took me quite a bit of time to find that property. Now let's rewrite `allowed-url.js` module compleatelly so LanguageBar and Interceptor will be analyzing Ember routes instead of URLs.
