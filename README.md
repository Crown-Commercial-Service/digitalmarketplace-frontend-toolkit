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

## Versioning

Releases of this project follow [semantic versioning](http://semver.org/), ie
> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> - MAJOR version when you make incompatible API changes,
> - MINOR version when you add functionality in a backwards-compatible manner, and
> - PATCH version when you make backwards-compatible bug fixes.

To make a new version:
- update `VERSION.txt` with the new version number
- commit this change; the first line of the commit message **must** be in the
  format `Bump version to X.X.X`
- create a pull request for the version bump

When the pull request is merged
[a Jenkins job](https://ci.beta.digitalmarketplace.service.gov.uk/view/Utils and toolkit/job/tag-toolkit/)
is run which tags the new version.

## Running Wraith to compare changes

The frontend toolkit uses [Wraith](http://bbc-news.github.io/wraith/) so that visual changes can be easily spotted.

This needs to be run from the top-level project directory and some dependencies need to be installed on the local machine first.
Also, the frontend toolkit needs to be serving pages (`make serve_pages`).

### Install Wraith and its dependencies

```
gem install wraith
# `-g` will install the package globally, if you prefer to do this
brew install (-g) phantomjs
brew install (-g) imagemagick
```

[Wraith's installation documentation can be found here](http://bbc-news.github.io/wraith/os-install.html).

### Usage

Take a baseline of the current version.
On master run:

```
wraith history wraith/config.yml
```

This will run Wraith against the pages that it knows about and generate screenshots in the `wraith/shots_history`
directory.  Configuration options are specified in the `wraith/config.yml` file.
[See here for a few example Wraith configurations](http://bbc-news.github.io/wraith/configs.html).


Once you have generated the 'history' screenshots, switch to your feature branch where you have made your changes.
On feature branch run:

```
wraith latest wraith/config.yml
```

Wraith will compare the latest screenshots to the historical ones and generate an HTML page for
easy diff comparison, the name of which will be in the command line output after it finishes running.

### Known issues

Occasionally, Wraith will hang on a specific page and then continue, other times it will hang indefinitely.
If you've been waiting over a minute for it to load a page, then kill the process and run it again.
It looks like [Wraith stalling out is an issue others have run into](https://github.com/BBC-News/wraith/issues/461),
although there's no suggested fix as of yet.
