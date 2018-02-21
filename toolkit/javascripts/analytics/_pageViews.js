(function (GOVUK) {
  GOVUK.GDM.analytics.pageViews = {
    'init': function () {
      this.setCustomDimensions();
      GOVUK.analytics.trackPageview();
    },

    'setCustomDimensions': function () {
      // Set custom dimension from meta tag
      $('meta[name="ga_customDimension"]').each(function(index, customDimension){
          var dimensionId = $(customDimension).attr('data-id');
          var dimensionValue = $(customDimension).attr('data-value');
          if ( dimensionId && dimensionValue ) {
            GOVUK.analytics.setDimension(dimensionId, dimensionValue);
          }
      });
    }
  };
})(window.GOVUK);
