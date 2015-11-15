# Digital Marketplace front-end toolkit

A toolkit for design patterns used across Digital Marketplace projects.

The patterns can be previewed at [alphagov.github.io/digitalmarketplace-frontend-toolkit/](http://alphagov.github.io/digitalmarketplace-frontend-toolkit/)

## Using the patterns in an app

Each pattern in `./toolkit/` provides:
- A Jinja template
- SASS
- Javascript (if needed)
- Images (if needed)

Dependency management and integrating these files into a build pipeline are the
concern of each project that uses them.

## Working on the patterns

The documentation is generated from the contents of this repository and
published as static HTML to Github Pages. Creating a new pattern means creating:
- a file of example data
- a template
- some SASS

### Example data

Usage examples for each pattern are defined in the `./pages_builder/pages`
folder. They are YAML files which show what parameters you can pass to a
template. The examples in the documentation are generated from these files.

### Templates

Templates are found in the `./toolkit/templates` folder. They are Jinja
templates with an `.html` extension. Their naming matches the naming of the
example markup files. They get rendered once for each of the provided examples,
using the provided examples' data.

### SASS

The SASS compilation takes files from `./toolkit/scss` and renders CSS files in
`./pages/public/stylesheets`.

The `./toolkit/scss`, `./pages_builder/govuk_frontend_toolkit/stylesheets` and
`./pages_builder/assets/scss` folders are included in the load path so you can
import any files from them.

## Building the documentation locally

### Requirements

- Python
- [PIP](https://pip.pypa.io/en/latest/)
- [virtualenv](https://virtualenv.pypa.io/en/latest/)

### Quick version

- Open two shells
- In the first shell run `make watch_pages`
- In the second shell run `make serve_pages`
- Visit http://localhost:8000
- Make any changes you need to then refresh the page to see them

### Long version

#### Set up a virtualenv

To set up an isolated environment for the project, run these commands:

``` shell
virtualenv ~/Envs/digitalmarketplace-frontend_toolkit
source ~/Envs/digitalmarketplace-frontend_toolkit/bin/activate
```

*Note*: you can set the virtualenv to any location on your system by swapping
out `~/Envs/digitalmarketplace-frontend_toolkit` to your choice of folder.

#### Install the dependencies

``` shell
pip install -r ./pages_builder/requirements.txt
```

#### Generate the pages

``` shell
python pages_builder/generate_pages.py
```

If the root directory of your web server does not correspond to `./pages` then
you need to set an optional environment variable before running the above,
eg:
``` shell
export ROOT_DIRECTORY='/digitalmarketplace-frontend-toolkit'
```

#### Watch for changes and generate the pages

``` shell
python pages_builder/watch_pages.py
```

This will watch for changes to any of the files used to generate the
documentation. If it notices any changes, it will regenerate the documentation.

#### Run the server

``` shell
cd pages
python -m SimpleHTTPServer
```
…then visit http://localhost:8000 to see the documentation

#### Overwrite the documentation on Github Pages with your local copy

_Only Jenkins or similar should be performing this step_

``` shell
sh pages_builder/push_to_github_pages.sh
```

### Running the tests

To run the JavaScript tests:

```
npm test
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
