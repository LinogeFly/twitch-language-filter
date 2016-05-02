var script = document.createElement('script');
script.src = chrome.extension.getURL("app.js");
(document.head || document.documentElement).appendChild(script);

var styles = document.createElement('link');
styles.setAttribute('href', chrome.extension.getURL("app.css"));
styles.setAttribute('type', 'text/css');
styles.setAttribute('rel', 'stylesheet');
(document.head || document.documentElement).appendChild(styles);
