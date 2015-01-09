# SCSS

Digital Marketplace uses the
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
separate stylesheet for each version of Internet Explorer that you need to target.

An example of this can be seen on the
[forms/summary.html](http://alphagov.github.io/digitalmarketplace-frontend-toolkit/forms/summary.html)
page. In [gh-pages/data/forms/summary.yml](../gh-pages/data/forms/summary.yml) you
can see that `forms/index.css` has variants for IE6, 7 and 8. The links to the
stylesheets are wrapped in conditional comments to ensure that:
- each version of Internet Explorer only gets its variant
- other browsers don't request the Internet-Explorer-specific stylesheets

The SCSS file for IE6 just includes `forms/index.scss` while setting a
few variables. The mixins from `_conditionals.scss` use these variables
to determine whether or not to insert the block of browser-specific CSS.

```
$is-ie: true;
$ie-version: 6;
$mobile-ie6: false;

@import "index.scss";
```
