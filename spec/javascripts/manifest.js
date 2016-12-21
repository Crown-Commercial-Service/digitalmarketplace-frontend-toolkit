// files are loaded from the /spec/javascripts/support folder so paths are relative to that
var manifest = {
  support : [
    'vendor/jquery.js',
    'vendor/hogan.js',
    '../../../node_modules/govuk_frontend_toolkit/javascripts/vendor/polyfills/bind.js',
    '../unit/ModuleLoaderSetup.js',
    '../../../toolkit/javascripts/list-entry.js',
    '../../../toolkit/javascripts/word-counter.js',
    '../../../toolkit/javascripts/module-loader.js'
  ],
  test : [
    '../unit/WordCountSpec.js',
    '../unit/ListEntrySpec.js',
    '../unit/ModuleLoaderSpec.js'
  ]
};

if (typeof exports !== 'undefined') {
  exports.manifest = manifest;
}
