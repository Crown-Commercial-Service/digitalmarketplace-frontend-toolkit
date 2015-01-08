(function (root) {
  var GOVUK = root.GOVUK || {};
  GOVUK.GDM = GOVUK.GDM || {};

  if (GOVUK.GDM.wordCounter) {
    GOVUK.GDM.wordCounter();
  }

  if (GOVUK.GDM.listEntry) {
    GOVUK.GDM.listEntry();
  }

  if (GOVUK.SelectionButtons) {
    var selectionButtons = new GOVUK.SelectionButtons('label.selection-button', {
      'focusedClass' : 'selection-button-focused',
      'selectedClass' : 'selection-button-selected'
    });
  }

  if (GOVUK.CheckboxFilter) {
    var filters = $('.js-openable-filter').map(function(){
      return new GOVUK.CheckboxFilter({el:$(this)});
    });

    if (filters.length > 0 && $('.js-openable-filter').not('.closed').length == 0) {
      filters[0].open();
    }
  }
})(window);
