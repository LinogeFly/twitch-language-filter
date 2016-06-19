# About

This is a browser extension for [twitch.tv](https://www.twitch.tv) that allows to filter live channels by broadcaster language. 

BUT, recently Twitch added their own standard language filtering feature so there is no point in this excension anymore, RIP.

# Known issues

- Doesn't work on [CS:GO](https://www.twitch.tv/directory/game/Counter-Strike:%20Global%20Offensive) page
- Doesn't work on [Random Channels](https://www.twitch.tv/directory/random) page

# Working with the source code

## Prerequisites
Before you can work with the source code, you must install and configure the following tools on your machine:
- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/)
- [Gulp](http://gulpjs.com/). Install gulp globally with:
```
npm install gulp --global
```
When it's done, clone this repository and run the following command in the solution's directory to install all its dependencies:
```
npm install
```

## Building
To build this solution, use the following command:
```
gulp build
```

## Running tests
To run tests, use the following command:
```
gulp test
```

# TODO

## Tasks

- Write small user guide
- Add support for building as a userscript
- Page shouldn't refresh if users selects new language that's the same as a previous one

## Bugs

Come on, I write my code without any bugs right away! ![Kappa](http://static-cdn.jtvnw.net/emoticons/v1/25/1.0)

# Version history

1.0.2 Fixed an issue when the extension stopped working on Channels page because Twitch had renamed the route, again.
1.0.1 Fixed an issue when the extension stopped working on game specific pages because Twitch had renamed the route.
1.0.0 First release, yay!
