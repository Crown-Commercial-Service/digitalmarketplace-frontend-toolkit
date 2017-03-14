// files are loaded from the /spec/javascripts/support folder so paths are relative to that
var manifest = {
  support : [
    'vendor/jquery.js',
    'vendor/hogan.js',
    '../../../node_modules/govuk_frontend_toolkit/javascripts/vendor/polyfills/bind.js',
    '../../../toolkit/javascripts/list-entry.js',
    '../../../toolkit/javascripts/module-loader.js',
    '../../../toolkit/javascripts/option-select.js',
    '../../../toolkit/javascripts/show-hide-content.js',
    '../../../toolkit/javascripts/validation.js',
    '../../../toolkit/javascripts/word-counter.js'
  ],
  test : [
    '../unit/ListEntrySpec.js',
    '../unit/WordCountSpec.js',
    '../unit/show-hide-content.spec.js',
  ]
};

if (typeof exports !== 'undefined') {
  exports.manifest = manifest;
}
