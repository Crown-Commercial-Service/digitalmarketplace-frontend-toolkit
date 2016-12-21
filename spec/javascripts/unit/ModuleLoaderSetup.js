// Block used to set up checks for the tests run in ModuleLoaderSpec

// Intentionally global variable
GOVUK = {
  'GDM': {
    'testObjectModuleLoaded' : false,
    'testFunctionModuleLoaded' : false,
    'testFunctionModule': function () {
      this.testFunctionModuleLoaded = true;  
    },
    'testObjectModule': {
      'init': function () {
        GOVUK.GDM.testObjectModuleLoaded = true;  
      }
    }
  }
};
