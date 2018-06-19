//= include ../../../../govuk_frontend_toolkit/javascripts/govuk/analytics/google-analytics-universal-tracker.js
//= include ../../../../govuk_frontend_toolkit/javascripts/govuk/analytics/analytics.js

; // JavaScript in the govuk_frontend_toolkit doesn't have trailing semicolons

// DM Frontend Toolkit analytics
//= include _register.js
//= include _events.js
//= include _pageViews.js
//= include _virtualPageViews.js
//= include _trackExternalLinks.js

(function(root) {
  "use strict";
  root.GOVUK.GDM.analytics.init = function () {
    this.register();
    this.pageViews.init();
    this.events.init();
    this.virtualPageViews();
    this.trackExternalLinks.init();
  };
})(window);
