;(function (root, GOVUK) {
    "use strict";
  
    GOVUK.GDM.analytics.events = {
      trackEvent: function (e) {
        var $target = $(e.target);
        var category = $target.attr('data-analytics-category');
        var action = $target.attr('data-analytics-action');
        var label = $target.attr('data-analytics-label');
        
        // if data-analytics-target-selector is set
        // then get the value of the target
        // selector needs to be a CSS selector
        // eg. ".className", "#id", "input[name=NameOfRadio]:checked"
        var selector = $target.attr('data-analytics-target-selector');

        if( selector )
        {
            label = $(selector).val();
        }

        // if no label is set then use the text of target
        // if no text available then use the href of target
        var href = $target.attr('href');
        var text = $target.text();
        if ( !label && text ) label = text;
        else if ( !label && !text && href ) label = href;
  
        GOVUK.GDM.analytics.events.sendEvent(category, action, label);
        
      },
      sendEvent: function (category, action, label) {
        GOVUK.analytics.trackEvent(category, action, {
          'label': label,
          'transport': 'beacon'
        });
      },
      'init': function () {
        $('body').on('click', '[data-analytics=trackEvent]', this.trackEvent);      
      }
    };
  })(window, window.GOVUK);
