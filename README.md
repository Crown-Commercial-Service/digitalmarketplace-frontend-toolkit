# Digital Marketplace frontend toolkit

A toolkit for design patterns used across Digital Marketplace projects.

Documentation of the patterns:
[alphagov.github.io/digitalmarketplace-frontend-toolkit/](http://alphagov.github.io/digitalmarketplace-frontend-toolkit/)

## Using the patterns in an app

Each pattern in `./toolkit/` provides:
- A Jinja template
- SASS
- Javascript (if needed)
- Images (if needed)

Dependency management and integrating these files into a build pipeline are the
concern of each project that uses them. This is already set up for all Digital
Marketplace frontend apps.

## Viewing the documentation locally

The documentation is generated from the contents of this repository.

### Setup

Install [Virtualenv](https://virtualenv.pypa.io/en/latest/)

```
sudo easy_install virtualenv
```

Create a virtual environment in the checked-out repository folder

```
cd digitalmarketplace-frontend-toolkit
virtualenv ./venv
```

### Activate the virtual environment

```
source ./venv/bin/activate
```

### Build

- In one shell run `make serve_pages`
- In another shell run `make watch_for_changes`
- Visit http://localhost:8000

## Working on the patterns

You can preview changes you make to the patterns by building the documentation
locally. There are 3 to 5 parts to a pattern:

### Example data

Usage examples for each pattern are defined in the `./pages_builder/pages`
folder. They are YAML files which show what parameters you can pass to a
template. The examples in the documentation are generated from these files.

#### Grids in example pages

Examples can use the grids (see [grids example](http://alphagov.github.io/digitalmarketplace-frontend-toolkit/grids.html)) by setting a `grid` property in this file.

If all the examples in your page sit in the same column, set the grid class you need with the page-level properties (ie on the [textbox example page](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/blob/master/pages_builder/pages/forms/textbox.yml#L3)).

If any of your examples need their own column, set the grid class you need with the example-level properties (ie on the [temporary message example page](https://github.com/alphagov/digitalmarketplace-frontend-toolkit/blob/master/pages_builder/pages/temporary-message.yml#L12)).

If you don't need a grid column, don't set any `grid` properties in your file.

### Template

Templates are found in the `./toolkit/templates` folder. They are Jinja
templates with an `.html` extension. Their name corresponds to the name of the
example. They get rendered once for each of the provided examples, using the
provided examples' data.

### SASS

Create your SASS file in `./toolkit/templates`. Import it into
`./pages_builder/assets/scss/index.scss`.

The `./toolkit/scss`, `./pages_builder/govuk_frontend_toolkit/stylesheets` and
`./pages_builder/assets/scss` folders are included in the load path so you can
import any files from them.

When writing SASS for this toolkit, [follow the styleguide](toolkit/scss/README.md).

### Javascript (if needed)

Javascript modules should be initialised by calling them from
`./pages_builder/assets/javascripts/onready.js`.

jQuery and Hogan are made available for you.

Javascript should be tested with Jasmine (requires [node](https://nodejs.org)
and [NPM](https://www.npmjs.com)).

To run the tests in `./spec`:
``` shell
npm install
npm test
```

### Images (if needed)

Images can be added to `./toolkit/images`

Use the `file-url` mixin to reference them in your stylesheet. It will resolve
paths, eg:
``` SCSS
background: file-url('your-image.png');
```

## Pushing your local documentation to Github Pages

**_Only Jenkins should be doing this_**

Set the root directory of the toolkit documentation relative to the root of the
web server, eg

``` shell
export ROOT_DIRECTORY='/digitalmarketplace-frontend-toolkit'
```

Then:
``` shell
sh pages_builder/push_to_github_pages.sh
```

## Development

A local checkout of the frontend-toolkit repo can be shared with locally-running services (i.e. frontend applications)
as follows, assuming you have a system-wide install of npm available:

- from this repo, run `npm link`
- from each app, run `npm link digitalmarketplace-frontend-toolkit`

Your frontend apps will then be using your local copy of the frontend-toolkit patterns rather than the version specified
in their `package.json` - for example, whenever you:

 - rebuild the app's `toolkit` directory by running `make frontend-build`; or
 - run `npm run frontend-build:watch` to automatically rebuild the frontend-toolkit content whenever a pattern file
   changes.


## Versioning

Releases of this project follow [semantic versioning](http://semver.org/), ie
> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> - MAJOR version when you make incompatible API changes,
> - MINOR version when you add functionality in a backwards-compatible manner, and
> - PATCH version when you make backwards-compatible bug fixes.

To make a new version:
- run `npm version` to update the version number;
- (note that npm has been configured **not** to create a new tag when you run this command - see `.npmrc`)
- if you are making a major change, also update the change log;
- commit `package.json` and `CHANGELOG.md` if appropriate - for a small PR, this could be in the same commit as other
  changes you are making; for a larger PR you might want a separate commit with a message that summarises the entire PR.

When the pull request is merged
[a Jenkins job](https://ci.marketplace.team/view/Utils%20and%20toolkit/job/tag-toolkit/)
will be run to tag the new version.
