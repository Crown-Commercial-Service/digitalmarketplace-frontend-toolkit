// a globally-kept ajax request semaphore allows code (notably test code) to know that an XMLHTTPRequest
// is still in flight.

;(function() {
  "use strict";

  this.GOVUK = this.GOVUK || {};
  GOVUK = this.GOVUK;
  GOVUK.xhr_semaphore = GOVUK.xhr_semaphore || 0;

  $(document).ajaxSend(function() {
    GOVUK.xhr_semaphore += 1;
  });

  $(document).ajaxComplete(function() {
    GOVUK.xhr_semaphore -= 1;
  });
}).call(this);
