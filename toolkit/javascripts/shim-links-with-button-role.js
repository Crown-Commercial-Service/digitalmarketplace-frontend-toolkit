/*
* Javascript shim for accessibility incase we use `role="button"` in our front end code. See GOV.UK front end toolkit
* for further documentation
*
* Usage: Import this file into your application.js after the import for
* govuk_frontend_toolkit/javascripts/govuk/_shim-links-with-button-role.js.
*/
;(function(GOVUK, GDM) {

  GDM.shimLinksWithButtonRole = function() {

    if (!GOVUK.shimLinksWithButtonRole) return;

    GOVUK.shimLinksWithButtonRole.init();

  };

  GOVUK.GDM = GDM;

}).apply(this, [GOVUK||{}, GOVUK.GDM||{}])