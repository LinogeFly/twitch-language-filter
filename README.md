# Twitch Language Filter

Chrome extension that adds language filter on twitch.tv for directory pages.

# TODO

## Tasks

- Move Language Bar from navigation to header.
- Implement Storage Service for persisting current language.
- Add Storage Service usage to Language Bar.
- Implement Interceptor for Twitch.api.get requests
  - It should have URL mappings
  - It should get current language from Storage Service

## Tests

- Storage Service
  - get/set functions should use cookies when localStorage is not supported
  - get function should return default value when not found

## Bugs

Come on, I write my code without bugs straight away! ![Kappa](http://static-cdn.jtvnw.net/emoticons/v1/25/1.0)