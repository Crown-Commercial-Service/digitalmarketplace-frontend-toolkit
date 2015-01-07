# SCSS

Digitial Marketplace uses the
[SCSS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#syntax) of Sass.

## Support for older versions of Internet Explorer

Support for older versions of Internet Explorer is made possible by the use of the mixins in
[_conditionals.scss](../govuk_frontend_toolkit/stylesheets/_conditionals.scss).

```
@include ie(6) {
  /* Block of IE6-specific SCSS */
}
```

### Required set up

This works by using the [sass-ie](http://jakearchibald.github.io/sass-ie/) method which generates a
separate stylesheet for each version you need to target.

An example of this can be seen with the
[forms/summary.html](http://alphagov.github.io/digitalmarketplace-frontend-toolkit/forms/summary.html)
page. Looking at the [gh-pages/data/forms/summary.yml](../gh-pages/data/forms/summary.yml) file you
can see the `forms/index.css` stylesheet has variants for IE6, 7 & 8. The conditional comments they are
wrapped in ensure each browser only gets its variant. They also ensure none of those are requested
by all others browsers.

Looking at the SCSS file for the IE6 variant you can see it just includes `forms/index.scss` while
setting a few variables the mixins from `_conditionals.scss` use to determine whether or not to
insert their given block.

```
$is-ie: true;
$ie-version: 6;
$mobile-ie6: false;

@import "index.scss";
```
