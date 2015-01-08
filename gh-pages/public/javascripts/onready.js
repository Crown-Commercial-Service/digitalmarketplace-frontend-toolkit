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
})(window);
