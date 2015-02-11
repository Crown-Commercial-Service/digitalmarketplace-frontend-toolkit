(function () {

  'use strict';

  var root = this,
      $ = this.jQuery,
      wordCounter;

  var counterClass = 'word-count-counter',
      attach = function() {
        var $textarea = $('textarea[data-max-length-in-words]');

        if (!$textarea.length) { return; }
        $textarea
          .after(
            '<p class="' + counterClass + '" ' +
              'role="status" aria-live="polite" aria-relevant="text" ' +
              'id="word-count-' + $textarea.prop('name') + '"' +
            '/>'
          )
          .attr('aria-controls', 'word-count-' + $textarea.prop('name'))
          .on('change keyup paste', showCount)
          .each(showCount);
      },
      showCount = function() {
        var $textarea = $(this),
            contents = $textarea.val(),
            numberOfWords = countWords(contents),
            maxNumberOfWords = $textarea.data('max-length-in-words'),
            remainingNumberOfWords = maxNumberOfWords - numberOfWords,
            message = getMessageText(remainingNumberOfWords);

        $textarea
          .next('.' + counterClass)
          .html(message);
      },
      countWords = function(text) {
        var tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars

        return tokens.length;
      },
      getMessageText = function(count) {
        var displayedCount = Math.abs(count); // Don't show negative numbers

        if (count < -1) {
          return displayedCount + ' words too many';
        }

        if (count === -1) {
          return  '1 word too many';
        }

        if (count === 1) {
          return '1 word remaining';
        }

        if (count === 0 || count > 1) {
          return displayedCount + ' words remaining';
        }
      };

  wordCounter = function () {
    attach();
  };

  this.GOVUK = this.GOVUK || {};
  this.GOVUK.GDM = this.GOVUK.GDM || {};
  GOVUK.GDM.wordCounter = wordCounter;
}).call(this);
