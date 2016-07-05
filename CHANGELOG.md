# Digital marketplace front-end toolkit changelog

Records breaking changes from major version bumps

## 17.0.0

PR: [#270](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/270)

### What changed

- Added the option for first field of summary tables to be two-thirds width.

#### Breaking changes

Changed `.summary-item-field-first-wider` style to `.summary-item-field-first-half` for summary tables.

Any fontend apps that explicitly call `.summary-item-field-first-wider` will need to change to use 
`.summary-item-field-first-half` instead.

## 16.0.0

PR: [#268](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/268)

### What changed

- Removed `extra` key from instruction list; using `top` and `bottom` keys instead [in
  #268](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/268)

#### Breaking changes

In order to have more flexibility when building our instruction list items, we removed the `extra` key in favour of `top` and `bottom` keys.

Adding a `top` will create an unstyled paragraph as the first thing in an instruction list section.  Adding a `bottom` will create a paragraph with `top-margin` of `10px` as the almost last thing in an instruction list section (if you include an `important` key, that one will be the final thing in a section).


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
