(function(GOVUK, GDM) {

  "use strict";

  var ModuleLoader = function () {
    if (typeof GDM.debug !== 'undefined') {
      GDM.debug = !window.location.href.match(/gov.uk/) && !window.jasmine;
    }
    this.cache = [];
    this.console.init();
  };

  // Wrapper for calls to global console method
  ModuleLoader.prototype.console = {
    init: function () {

      // Older browers don't have window.console to stub it if so
      if(typeof console === 'undefined') {
        console = {
          log: function () {},
          time: function () {},
          timeEnd: function () {}
        };
      }

      if (GDM.debug) {
        console.log(
          "%cDebug mode %cON",
          "color:#550; background:yellow; font-size: 11pt",
          "color:yellow; background: #550;font-size:11pt"
        );
        console.time("Modules loaded");
      }

    },
    log: function (module) {

      if (GDM.debug && module !== "debug") {
        console.log(
          "%cLoading module %c" + module,
          "color:#6a6; background:#dfd; font-size: 11pt",
          "color:#dfd; background:green; font-size: 11pt"
        );
      }

    }
  };

  // Load the a module from the namespace, if it fits our criteria
  ModuleLoader.prototype.loadModule = function (module, namespace) {

    if ("function" === typeof namespace[module].init) {
      // If a module has an init() method then we want that to be called here
      namespace[module].init();
    } else if ("function" === typeof namespace[module]) {
      // If a module doesn't have an interface then call it directly
      namespace[module]();
    }

  };

  // Check if a module has loaded already
  ModuleLoader.prototype.moduleIsLoaded = function (module, namespace) {

    var namespaceCached = (typeof this.cache[namespace] !== 'undefined'),
        moduleLoaded = $.inArray(module, this.cache[namespace]) > -1;

    return namespaceCached && moduleLoaded;

  };

  // cache the module against its namespace
  ModuleLoader.prototype.addToCache = function (module, namespace) {

    if (typeof this.cache[namespace] === 'undefined') {
      this.cache[namespace] = [];
    }
    this.cache[namespace].push(module);

  };
  ModuleLoader.prototype.loadModulesFromNamespace = function (namespace) {

    var module;

    // Initialise all modules in namespace
    for (module in namespace) {

      // Load any modules not already loaded
      if (!this.moduleIsLoaded(module, namespace)) {
        this.console.log(module);
        this.loadModule(module)
        this.addToCache(module, namespace);
      }

    }
    if (GDM.debug) console.timeEnd("Modules loaded");

  };

  GOVUK.GDM = GDM;

  // Store an instance of ModuleLoader on GDM
  GOVUK.GDM.moduleLoader = new ModuleLoader();

  // Load all modules already added to GOVUK.GDM
  GOVUK.GDM.moduleLoader.loadModulesFromNamespace(GDM);

}).apply(this, [GOVUK||{}, GOVUK.GDM||{}]);
