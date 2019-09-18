(function (root) {
  "use strict";

  root.GOVUK.GDM = root.GOVUK.GDM || {};
  root.GOVUK.GDM.analytics = {
    'register': function () {
      var cookieDomain = (root.document.domain === 'www.digitalmarketplace.service.gov.uk') ? '.digitalmarketplace.service.gov.uk' : root.document.domain;
      var universalId = 'UA-49258698-1';

      GOVUK.Analytics.load();
      GOVUK.analytics = new GOVUK.Analytics({
        universalId: universalId,
        cookieDomain: cookieDomain
      });
      /* Add GOV.UK cross domain tracking
       Calls the equivalent commands in node_modules/govuk_frontend_toolkit/javascripts/govuk/analytics/google-analytics-universal-tracker.js (need to check if this format is OK):
         ga('create', 'UA-145652997-1', 'auto', {'name': govuk_shared})

         ga('require', 'linker')
         ga(name + '.require', 'linker')

         ga('linker:autoLink', ['www.gov.uk'])
         ga(name + '.linker:autoLink', ['www.gov.uk'])

         ga(name + '.set', 'anonymizeIp', true)
         ga(name + '.send', 'pageview')
      */
      GOVUK.analytics.addLinkedTrackerDomain('UA-145652997-1', 'govuk_shared', ['www.gov.uk'])
    },

    // wrapper around access to window.location
    'location': {
      'hostname': function () {
        return root.location.hostname;
      },
      'href': function () {
        return root.location.href;
      },
      'pathname': function () {
        return root.location.pathname;
      },
      'protocol': function () {
        return root.location.protocol;
      },
      'search': function () {
        return root.location.search;
      }
    }
  };
})(window);
