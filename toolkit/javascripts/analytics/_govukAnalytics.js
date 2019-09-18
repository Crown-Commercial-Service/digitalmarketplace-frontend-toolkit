;(function (global) {
  'use strict'

  var GOVUK = global.GOVUK || {}

  // For usage and initialisation see:
  // https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md#create-an-analytics-tracker

  var Analytics = function (config) {
    this.pii = new GOVUK.pii()
    this.trackers = []
    if (typeof config.universalId !== 'undefined') {
      var universalId = config.universalId
      delete config.universalId
      this.trackers.push(new GOVUK.GoogleAnalyticsUniversalTracker(universalId, config))
    }
  }

  var PIISafe = function (value) {
    this.value = value
  }
  Analytics.PIISafe = PIISafe

  Analytics.prototype.sendToTrackers = function (method, args) {
    for (var i = 0, l = this.trackers.length; i < l; i++) {
      var tracker = this.trackers[i]
      var fn = tracker[method]

      if (typeof fn === 'function') {
        fn.apply(tracker, args)
      }
    }
  }

  Analytics.load = function () {
    GOVUK.GoogleAnalyticsUniversalTracker.load()
  }

  Analytics.prototype.trackPageview = function (path, title, options) {
    this.sendToTrackers('trackPageview', this.pii.stripPII(arguments))
  }

  /*
    https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    options.label – Useful for categorizing events (eg nav buttons)
    options.value – Values must be non-negative. Useful to pass counts
    options.nonInteraction – Prevent event from impacting bounce rate
  */
  Analytics.prototype.trackEvent = function (category, action, options) {
    this.sendToTrackers('trackEvent', this.pii.stripPII(arguments))
  }

  Analytics.prototype.trackShare = function (network) {
    this.sendToTrackers('trackSocial', this.pii.stripPII([network, 'share', global.location.pathname]))
  }

  /*
    The custom dimension index must be configured within the
    Universal Analytics profile
   */
  Analytics.prototype.setDimension = function (index, value) {
    this.sendToTrackers('setDimension', this.pii.stripPII(arguments))
  }

  /*
   Add a beacon to track a page in another GA account on another domain.
   */
  Analytics.prototype.addLinkedTrackerDomain = function (trackerId, name, domains) {
    this.sendToTrackers('addLinkedTrackerDomain', arguments)
  }

  GOVUK.Analytics = Analytics

  global.GOVUK = GOVUK
})(window);
