(function(root, namespace) {

  "use strict";

  var ModuleLoader = function (namespace) {
    if (typeof namespace.debug !== 'undefined') {
      namespace.debug = !window.location.href.match(/gov.uk/) && !window.jasmine;
    }
    this.namespace = namespace;
    this.cache = [];
    this.console.init();
  };

  // Wrapper for calls to global console method
  ModuleLoader.prototype.console = {
    init: function () {

      // Older browers don't have window.console to stub it if so
      if(typeof root.console === 'undefined') {
        root.console = {
          log: function () {},
          time: function () {},
          timeEnd: function () {}
        };
      }

      if (namespace.debug) {
        root.console.log(
          "%cDebug mode %cON",
          "color:#550; background:yellow; font-size: 11pt",
          "color:yellow; background: #550;font-size:11pt"
        );
        root.console.time("Modules loaded");
      }

    },
    log: function (module) {

      if (namespace.debug && module !== "debug") {
        root.console.log(
          "%cLoading module %c" + module,
          "color:#6a6; background:#dfd; font-size: 11pt",
          "color:#dfd; background:green; font-size: 11pt"
        );
      }

    }
  };

  // Load the a module, if it fits our criteria
  ModuleLoader.prototype.loadModule = function (module) {

    if ("function" === typeof this.namespace[module].init) {
      // If a module has an init() method then we want that to be called here
      this.namespace[module].init();
    } else if ("function" === typeof this.namespace[module]) {
      // If a module doesn't have an interface then call it directly
      this.namespace[module]();
    }

  };

  // Check if a module has loaded already
  ModuleLoader.prototype.moduleIsLoaded = function (module) {

    return $.inArray(module, this.cache) > -1;

  };

  ModuleLoader.prototype.loadModulesInNamespace = function () {

    var module;

    // Initialise all modules in namespace
    for (module in this.namespace) {

      // Load any modules not already loaded
      if (!this.moduleIsLoaded(module)) {
        this.console.log(module);
        this.loadModule(module)
        this.cache.push(module);
      }

    }
    if (namespace.debug) console.timeEnd("Modules loaded");

  };

  // Store an instance of ModuleLoader on GDM
  namespace.moduleLoader = new ModuleLoader(namespace);

  // Load all modules already added to GOVUK.GDM
  namespace.moduleLoader.loadModulesInNamespace();

}).apply(this, [window, GOVUK.GDM]);
