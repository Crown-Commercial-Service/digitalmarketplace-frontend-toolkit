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

## Styleguide

### Naming

The naming of classes and ids normally follows one of these patterns:

### Thing

For example `.question`.

### Thing + type

| Thing   | Type |
|---------|------|
| .button | save |

For example `.button-save`.

#### Usage

All types should be built using @extend to extend a base abstract block (which does not appear in the final CSS).

For example:

```
%banner {
  background: $highlight-colour;
  @include core-24;
  padding: 20px 20px 25px 20px;
}

.banner-default {
  @extend %banner;
}
```

### Thing + what marks it out as a variation

| Thing         | Type          |
|---------------|---------------|
| .page-heading | no-breadcrumb |

For example `.page-heading-no-breadcrumb`.

#### Usage

Variations should use @extend to extend the base class (which will appear as a class in the final CSS).

```
.text-box
%text-box {
  @include core-19;
  @include box-sizing(border-box);
  display: block;
  height: 50px;
  margin: 0 0 15px 0;
  padding: 5px;
  border: 1px solid $border-colour;

  @include media(desktop){
    width: 66%;
  }
}

.text-box-medium {
  @extend textbox; 
  height: 6.25em;
}
```

### Parent + thing

| Thing     | Type    |
|-----------|---------|
| .question | heading |

For example `.question-heading`.
