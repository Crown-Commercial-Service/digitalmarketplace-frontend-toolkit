/* 
  ClearFilters

    Requirements
      ID: #dm-clear-all-filters 
      class: .dm-filters
*/

(function() {
  "use strict";

  var ClearFilters = function( clearFilterLink ) {
    this.$clearFilterLink = clearFilterLink;
    this.initaliseListener();
  };

  ClearFilters.init = function() {};

  ClearFilters.prototype.initaliseListener = function() {
    
    var _this = this;

    this.$clearFilterLink.on('click', function(event) {
        event.preventDefault();
        _this.clearFilters();
        $(this).blur();
    });
    
  };

  ClearFilters.prototype.clearFilters = function() {
    $('.dm-filters input[type=checkbox]:checked')
      .prop('checked', false)
      .trigger('change');
  };

  GOVUK = GOVUK || {};
  GOVUK.GDM = GOVUK.GDM || {};
  GOVUK.GDM.ClearFilters = ClearFilters;

  var clearFilters = new GOVUK.GDM.ClearFilters( $('#dm-clear-all-filters') );
  
})();
