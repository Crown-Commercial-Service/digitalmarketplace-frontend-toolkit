(function (GOVUK) {
  "use strict";

  var sendVirtualPageView = function() {
    var $element = $(this);
    var url = $element.data('url');
    if (GOVUK.analytics  && url){
      var urlList = url.split("?")
      urlList[0] = urlList[0] + "/vpv"
      url = urlList.join("?")
      GOVUK.analytics.trackPageview(url);
    }
  };

  GOVUK.GDM.analytics.virtualPageViews = function() {
    $('[data-analytics=trackPageView]').each(sendVirtualPageView);
  };

})(window.GOVUK);
