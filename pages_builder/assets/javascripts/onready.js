(function (root) {
  var GOVUK = root.GOVUK || {};
  GOVUK.GDM = GOVUK.GDM || {};

  $('.code').removeClass("open").find('.code-label').click(function() {
      $(this).parent().toggleClass('open');
  });

  if (GOVUK.GDM.wordCounter) {
    GOVUK.GDM.wordCounter();
  }

  if (GOVUK.GDM.listEntry) {
    GOVUK.GDM.listEntry();
  }

  if (GOVUK.SelectionButtons) {
    var selectionButtons = new GOVUK.SelectionButtons('.selection-button input');
  }

  if (GOVUK.CheckboxFilter) {
    var filters = $('.js-openable-filter').map(function(){
      return new GOVUK.CheckboxFilter({el:$(this)});
    });

    if (filters.length > 0 && $('.js-openable-filter').not('.closed').length == 0) {
      filters[0].open();
    }
  }

  if (GOVUK.GDM.validation) {
    GOVUK.GDM.validation();
  }


  if (GOVUK.ShowHideContent) {
    var showHideContent = new GOVUK.ShowHideContent();
    showHideContent.init();
  }

})(window);
