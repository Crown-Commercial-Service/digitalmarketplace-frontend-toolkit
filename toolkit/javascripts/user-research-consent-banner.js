;(function (global) {
  "use strict";

  var UserResearchBanner = function( _userResearchBanner ) {
    this.$userResearchBanner = _userResearchBanner;
    this.$userResearchBannerCloseBtn = this.$userResearchBanner.find('.user-research-banner-close-btn');
    this.userResearchCookie = {
      name: 'seen_user_research_message',
      value: true
    };
    this.showBannerIfMessageNotSeen();
    this.initaliseListener();
  };
  
  UserResearchBanner.init = function () {
    
  };

  UserResearchBanner.prototype.initaliseListener = function () {
    var _this = this;
    this.$userResearchBannerCloseBtn.on('click', function () {
      _this.setCookie();
      _this.hideBanner();
    });
  };

  UserResearchBanner.prototype.showBannerIfMessageNotSeen = function () {
    if (!this.getCookie()) {
      this.showBanner();
    }
  };

  UserResearchBanner.prototype.showBanner = function () {
    this.$userResearchBanner.show();
  };

  UserResearchBanner.prototype.hideBanner = function () {
    this.$userResearchBanner.hide();
  };

  UserResearchBanner.prototype.getCookie = function () {
    return GOVUK.cookie(this.userResearchCookie.name);
  };

  UserResearchBanner.prototype.setCookie = function () {
    return GOVUK.setCookie(this.userResearchCookie.name, this.userResearchCookie.value);
  };

  $ = global.jQuery
  GOVUK = global.GOVUK || {}
  GOVUK.GDM = global.GOVUK.GDM || {};
  GOVUK.GDM.UserResearchBanner = UserResearchBanner;

  var _userResearchBanner = new GOVUK.GDM.UserResearchBanner($('.user-research-banner'));

})(window);
