// files are loaded from the /spec/javascripts/support folder so paths are relative to that
var manifest = {
  support : [
    'vendor/jquery.js',
    'vendor/hogan.js',
    '../../../node_modules/govuk_frontend_toolkit/javascripts/vendor/polyfills/bind.js',
    '../../../toolkit/javascripts/*.js',
  ],
  test : [
    '../unit/*.js',
  ]
};

if (typeof exports !== 'undefined') {
  exports.manifest = manifest;
}
