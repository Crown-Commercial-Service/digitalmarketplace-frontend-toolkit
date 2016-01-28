# Digital marketplace front-end toolkit changelog

Records breaking changes from major version bumps

## 15.0.0

PR: [#213](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/213)

### What changed

- new notification banner format
  [#211](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/211)
(breaking change)
- changes to temporary messages example page
  [#212](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/212)
- separation of temporary message style into
  placeholder [in
- ability to add pattern-level grids [in
  #212](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/212)

#### Breaking changes

The base temporary message styles were split out into a placeholder block to allow use across multiple patterns (by [extending](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/blob/master/toolkit/scss/_notification-banners.scss#L69) it):

https://github.com/alphagov/digitalmarketplace-frontend-toolkit/blob/master/toolkit/scss/shared_placeholders/_temporary-messages.scss

This means the existing temporary message pattern will break unless the new placeholder block is included in the main stylesheet of apps that use it.
