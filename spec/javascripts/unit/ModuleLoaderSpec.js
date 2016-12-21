describe("ModuleLoader", function () {
  describe("When module-loader.js is loaded", function () {
    // The following checks are set up ModuleLoaderSetup.js, before the moduleloader is first called
    // GOVUK.GDM.testFunctionModuleLoaded is set to false, turned to true when GOVUK.GDM.testFunctionModule is called
    // GOVUK.GDM.testObjectModuleLoaded is set to false, turned to true when GOVUK.GDM.testObjectModule is called

    it("Loads function modules", function () {
      expect(GOVUK.GDM.testFunctionModuleLoaded).toBe(true);
    });

    it("Loads object modules", function () {
      expect(GOVUK.GDM.testObjectModuleLoaded).toBe(true);
    });
  });

  describe("When loadModulesInNamespace is called after load", function () {
    it("loads modules not part of the namespace on load", function () {
      GOVUK.GDM.testFunctionModule2 = function () {};
      GOVUK.GDM.testObjectModule2 = {
        "init": function () {}
      };

      spyOn(GOVUK.GDM, "testFunctionModule2");
      spyOn(GOVUK.GDM.testObjectModule2, "init");

      GOVUK.GDM.moduleLoader.loadModulesInNamespace();

      expect(GOVUK.GDM.testFunctionModule2).toHaveBeenCalled();
      expect(GOVUK.GDM.testObjectModule2.init).toHaveBeenCalled();
    });
  });
});

