if(typeof window.GOVUK === 'undefined'){ window.GOVUK = {}; }
if(typeof window.GOVUK.GDM === 'undefined'){ window.GOVUK.GDM = {}; }
if(typeof window.GOVUK.GDM.support === 'undefined'){ window.GOVUK.GDM.support = {}; }

window.GOVUK.GDM.support.history = function() {
  return window.history && window.history.pushState && window.history.replaceState;
};
