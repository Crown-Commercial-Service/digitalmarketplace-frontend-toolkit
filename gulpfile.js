var gulp = require('gulp');
var del = require('del');
var jasmine = require('gulp-jasmine-phantom');

// Paths
var environment;
var repoRoot = __dirname + '/';
var npmRoot = repoRoot + 'node_modules';
var govukToolkitRoot = npmRoot + '/govuk_frontend_toolkit';
var govukToolkitAppFolder = repoRoot + 'pages_builder/govuk_frontend_toolkit';

// Clean directories

gulp.task('clean', function () {
  return del([
    'pages/*',
    'pages_builder/govuk_frontend_toolkit',
  ]);
});

// Copy files

function copyFactory(resourceName, sourceFolder, targetFolder) {

  return function() {

    return gulp
      .src(sourceFolder + "/**/*", { base: sourceFolder })
      .pipe(gulp.dest(targetFolder))
      .on('end', function () {
        console.log('📂  Copied ' + resourceName);
      });
  };
}

gulp.task(
  'copy:govuk_frontend_toolkit',
  copyFactory(
    "GOV.UK frontend toolkit stuff",
    govukToolkitRoot,
    govukToolkitAppFolder
  )
);

gulp.task('copy',
  ['copy:govuk_frontend_toolkit']
);

// Test

gulp.task('test', function () {
  var manifest = require(repoRoot + 'spec/javascripts/manifest.js').manifest,
      fixPaths;

  fixPaths = function (val) {
    val = val.replace(/^(\.\.\/)*/, function (match) {
      var steps = match.split('/'),
          root = ['spec', 'javascripts', 'support'];

      // remove the end match which is always blank
      steps.pop();
      replacement = root.slice(0, root.length - steps.length);
      return (replacement.length) ?  replacement.join('/') + '/' : '';
    });
    return val;
  };

  manifest.support = manifest.support.map(fixPaths);
  manifest.test = manifest.test.map(fixPaths);

  return gulp.src(manifest.test)
    .pipe(jasmine({
      'jasmine': '2.0',
      'integration': true,
      'abortOnFail': true,
      'vendor': manifest.support
    }));
});
