var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');

// Paths
var environment;
var repoRoot = __dirname + '/';

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
      'jasmine': '2.0',
      'integration': true,
      'abortOnFail': true,
      'vendor': manifest.support
    }));
});
