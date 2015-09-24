(function(GOVUK, GDM) {

  "use strict";

  var module;

  if(typeof console === 'undefined') {
    console = {
      log: function () {},
      time: function () {},
      timeEnd: function () {}
    };
  }

  if (
    (GDM.debug = !window.location.href.match(/gov.uk/) && !window.jasmine)
  ) {
    console.log(
      "%cDebug mode %cON",
      "color:#550; background:yellow; font-size: 11pt",
      "color:yellow; background: #550;font-size:11pt"
    );
    console.time("Modules loaded");
  }

  // Initialise our modules
  for (module in GDM) {

    if (GDM.debug && module !== "debug") {
      console.log(
        "%cLoading module %c" + module,
        "color:#6a6; background:#dfd; font-size: 11pt",
        "color:#dfd; background:green; font-size: 11pt"
      );
    }

    if ("function" === typeof GDM[module].init) {
      // If a module has an init() method then we want that to be called here
      GDM[module].init();
    } else if ("function" === typeof GDM[module]) {
      // If a module doesn't have an interface then call it directly
      GDM[module]();
    }

  }

  GOVUK.GDM = GDM;

  if (GDM.debug) console.timeEnd("Modules loaded");

}).apply(this, [GOVUK||{}, GOVUK.GDM||{}]);
