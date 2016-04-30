# Twitch Language Filter

Chrome extension that adds language filter on twitch.tv for directory pages.

# TODO

## Tasks

- Move Language Bar from navigation to header.
- Implement Interceptor for Twitch.api.get requests

## Tests

- LanguageBar
  - It should refresh page after language is changed
  - It should save language code in storage after language is changed
  - It should load language code from storage when created

- Interceptor
  - It should overwrite "broadcaster_language" request option for allowed URLs only

## Bugs

Come on, I write my code without bugs straight away! ![Kappa](http://static-cdn.jtvnw.net/emoticons/v1/25/1.0)