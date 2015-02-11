// files are loaded from the /spec/support folder so paths are relative to that
var manifest = {
  support : [
    'javascripts/vendor/jquery.js',
    'javascripts/vendor/hogan.js',
    '../../toolkit/javascripts/list-entry.js',
    '../../toolkit/javascripts/word-counter.js'
  ],
  test : [
    '../unit/wordCountSpec.js',
    '../unit/listEntrySpec.js'
  ]
};
