// files are loaded from the /spec/support folder so paths are relative to that
var manifest = {
  support : [
    'javascripts/vendor/jquery.js',
    'javascripts/vendor/hogan.js',
    '../../javascripts/list-entry.js',
    '../../javascripts/word-counter.js',
    '../../javascripts/multi-selects.js'
  ],
  test : [
    '../unit/wordCountSpec.js',
    '../unit/listEntrySpec.js',
    '../unit/CheckboxFilterSpec.js'
  ]
};
