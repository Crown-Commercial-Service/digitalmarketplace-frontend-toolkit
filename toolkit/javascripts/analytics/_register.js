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
      // Add GOV.UK cross domain tracking - see https://github.com/alphagov/digitalmarketplace-frontend-toolkit/pull/480
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
