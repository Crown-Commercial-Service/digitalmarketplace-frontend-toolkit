//= include _pii.js
//= include _googleAnalyticsUniversalTracker.js
//= include _govukAnalytics.js
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
