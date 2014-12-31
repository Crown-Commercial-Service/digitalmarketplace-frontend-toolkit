// files are loaded from the /scripts/test/support folder so paths are relative to that
var manifest = {
  support : [
    '../../javascripts/vendor/jquery.js',
    '../../javascripts/vendor/hogan.js',
    '../../javascripts/listEntry.js',
    '../../javascripts/wordCounter.js'
  ],
  test : [
    '../unit/WordCountSpec.js',
    '../unit/ListEntrySpec.js'
  ]
};
