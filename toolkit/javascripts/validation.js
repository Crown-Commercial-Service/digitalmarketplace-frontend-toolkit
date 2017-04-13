// Adapted from GOV.UK elements, here:
// https://github.com/alphagov/govuk_elements/blob/612caeaf2b19013bdc5caad1ade26663c126aab7/public/javascripts/application.js#L138

(function () {

  'use strict';

  var root = this,
      $ = this.jQuery,
      sendFocusToMasthead = function() {
        if ($(".validation-masthead").length) {
          $(".validation-masthead").first().focus();
        }

      },
      sendFocusToError = function(event) {
        var href = $(this).attr("href");

        if(href.charAt(0) == "#"){
          event.preventDefault();
          $(href).find("input, textarea").first().focus();
        }

      };

  $(".validation-masthead").on("click", "a", sendFocusToError);

  this.GOVUK = this.GOVUK || {};
  this.GOVUK.GDM = this.GOVUK.GDM || {};

  GOVUK.GDM.validation = sendFocusToMasthead;

}).call(this);
