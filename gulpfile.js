var gulp = require('gulp');
var jasmine = require('gulp-jasmine-phantom');

// Paths
var environment;
var repoRoot = __dirname + '/';

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
