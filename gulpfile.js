var gulp = require('gulp');
var del = require('del');
var jasmine = require('gulp-jasmine-phantom');

// Paths
var environment;
var repoRoot = __dirname + '/';
var npmRoot = repoRoot + 'node_modules';
var govukToolkitRoot = npmRoot + '/govuk_frontend_toolkit';
var govukToolkitAppFolder = repoRoot + 'pages_builder/govuk_frontend_toolkit';
var govukElementsRoot = npmRoot + '/govuk-elements-sass';
var govukElementsRootFolder = repoRoot + 'pages_builder/govuk-elements-sass'

// Clean directories

gulp.task('clean', function () {
  return del([
    'pages/*',
    'pages_builder/govuk_frontend_toolkit',
    'pages_builder/govuk-elements-sass',
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

gulp.task(
  'copy:govuk-elements-sass',
  copyFactory(
    "GOV.UK Elements",
    govukElementsRoot,
    govukElementsRootFolder
  )
);

gulp.task('copy',
  gulp.parallel(
    'copy:govuk_frontend_toolkit', 'copy:govuk-elements-sass'
  )
);

// Test

gulp.task('test', function () {
  var manifest = require(repoRoot + 'spec/javascripts/manifest.js').manifest;

  manifest.support = manifest.support.map(function (val) {
    return val.replace(/^(\.\.\/)*/, function (match) {
      if (match === '../../../') {
        return '';
      }
      else {
        return 'spec/javascripts/support/'
      }
    });
  });
  manifest.test = manifest.test.map(function (val) {
    return val.replace(/^\.\.\//, 'spec/javascripts/');
  });

  return gulp.src(manifest.test)
    .pipe(jasmine({
      'jasmine': '3.1',
      'integration': true,
      'abortOnFail': true,
      'vendor': manifest.support
    }));
});
