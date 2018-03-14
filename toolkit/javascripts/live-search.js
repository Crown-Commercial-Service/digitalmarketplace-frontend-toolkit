/*
Key components:
 - Div wrapping all content that might change, and the form to be monitored.
   - Required id: js-dm-live-search-wrapper
 - The form to be monitored for changes
   - Required id: js-dm-live-search-form
 - The form's submission button
   - Required css selector: `button.button-save.js-dm-live-search`
 - An arbitrary number of elements which should get updated.
   - Requires a unique selector (recommend an id with prefix `js-dm-live-search-`)
   - Required class: js-dm-live-search-fade (to hook into fade in/out functionality that telegraphs new content)

This module enables updating arbitrary elements on the page after changes to checkboxes/radios/search inputs within the
form on the page. The entire form, including elements which are going to change, must be wrapped within a div with the
id `js-dm-live-search-wrapper`. The form inside must have the id `js-dm-live-search-form`. Arbitrary elements within the
wrapper should be tagged with ids in a similar vein, e.g. with the prefix `js-dm-live-search-*`. Any elements whose
content will change should have the class `js-dm-live-search-fade` to capture the fade in/out used to telegraph new
content. The form's submit button (`button.button-save.js-dm-live-search`) should have the `js-hidden` class by default;
this will be removed if the browser's Javascript does not support accessing history.

When the form detects a change, it will post to the form's associated endpoint after injecting a `live-results=true`
query parameter. The view must intercept this and return a JSON blob with the below structure:

endpoint response (application/json):
  {
    "example-1": {
      "selector": "#example1-selector",
      "html": "<HTML>"
    }
    "example-2": {
      "selector": "#example2-selector",
      "html": "<HTML>"
    }
  }

*/

(function ($) {
  "use strict";

  var LiveSearch = function($wrapper){
    // Attach filter-on-click functionality if this page has a live-search form.
    this.$wrapper = $wrapper;
    this.$form = this.$wrapper.find('#js-dm-live-search-form');
    this.$options = this.$form.find('.govuk-option-select').find("input[type='checkbox']");

    this.state = false;
    this.previousState = false;
    this.resultsCache = {};

    if(GOVUK.GDM.support.history()) {
      this.saveState();
      this.$form.on('change', 'input[type=checkbox], input[type=search], input[type=radio]', this.formChange.bind(this));

      this.$form.find('input[type=submit]').click(
        function(e){
          this.formChange();
          e.preventDefault();
        }.bind(this)
      );
      this.$form.find('input[type=search]').keypress(
        function(e){
          if(e.keyCode == 13) {
            // 13 is the return key
            this.formChange();
            e.preventDefault();
          }
        }.bind(this)
      );
    } else {
      this.$form.find('button.button-save.js-dm-live-search').removeClass('js-hidden');
    }
  }

  LiveSearch.init = function() {}

  LiveSearch.prototype.saveState = function saveState(state){
    if(typeof state === 'undefined'){
      state = this.$form.serializeArray();
    }
    this.previousState = this.state;
    this.state = state;
  };

  LiveSearch.prototype.popState = function popState(event){
    if(event.originalEvent.state){
      this.saveState(event.originalEvent.state);
      this.updateResults();
      this.restoreBooleans();
      this.restoreSearchInputs();
    }
  };

  LiveSearch.prototype.formChange = function formChange(e){
    var pageUpdated;
    if(this.isNewState()){
      this.saveState();
      pageUpdated = this.updateResults();
      pageUpdated.done(
        function(){
          var newPath = window.location.pathname + "?" + $.param(this.state);
          history.pushState(this.state, '', newPath);
          if (GOVUK.analytics && GOVUK.analytics.trackPageview) {
            GOVUK.analytics.trackPageview(newPath);
          }
        }.bind(this)
      );
    }
  };

  LiveSearch.prototype.cache = function cache(slug, data) {
    if(typeof data === 'undefined'){
      return this.resultsCache[slug];
    } else {
      this.resultsCache[slug] = data;
    }
  };

  LiveSearch.prototype.isNewState = function isNewState(){
    return $.param(this.state) !== this.$form.serialize();
  };

  LiveSearch.prototype.updateResults = function updateResults(){
    this.showLoadingIndicators();

    var liveSearch = this;
    var searchState = $.param(this.state);
    var liveState = this.$form.serializeArray();
    var cachedResultData = this.cache(searchState);

    liveState.push({'name': 'live-results', 'value': true})

    if(typeof(cachedResultData) === 'undefined') {
      return $.ajax({
        url: this.$form.attr('action'),
        data: $.param(liveState),
        searchState: searchState

      }).done(function(response){
        liveSearch.cache(this.searchState, response);
        liveSearch.displayFilterResults(response, this.searchState);

      }).error(function(response){
        liveSearch.showErrorIndicator();

      })
    } else {
      this.displayFilterResults(cachedResultData, searchState);
      var out = new $.Deferred();
      return out.resolve();
    }
  };

  LiveSearch.prototype.showLoadingIndicators = function showLoadingIndicators() {
    $('div[class=js-dm-live-search-fade]').css('opacity', '0.25')
    $('#js-dm-live-search-info').text('Loading...');
  }

  LiveSearch.prototype.showErrorIndicator = function showErrorIndicator() {
    $('#js-dm-live-search-info').text('Error. Please try modifying your search and trying again.');
  }

  LiveSearch.prototype.displayFilterResults = function displayFilterResults(response, state) {
    if(state == $.param(this.state)) {
      for (var blockToReplace in response) {
        this.replaceBlock(response[blockToReplace]['selector'], response[blockToReplace]['html']);
      }

      $('div[class=js-dm-live-search-fade]').css('opacity', '1')
    }
  }

  LiveSearch.prototype.replaceBlock = function replaceBlock(selector, html) {
    $(selector)[0].outerHTML = html;
  }

  LiveSearch.prototype.restoreBooleans = function restoreBooleans(){
    var that = this;
    this.$form.find('input[type=checkbox], input[type=radio]').each(function(i, el){
      var $el = $(el);
      $el.prop('checked', that.isBooleanSelected($el.attr('name'), $el.attr('value')));
    });
  };

  LiveSearch.prototype.isBooleanSelected = function isBooleanSelected(name, value){
    var i, _i;
    for(i=0,_i=this.state.length; i<_i; i++){
      if(this.state[i].name === name && this.state[i].value === value){
        return true;
      }
    }
    return false;
  };

  LiveSearch.prototype.restoreSearchInputs = function restoreSearchInputs(){
    var that = this;
    this.$form.find('input[type=search]').each(function(i, el){
      var $el = $(el);
      $el.val(that.getTextInputValue($el.attr('name')));
    });
  };

  LiveSearch.prototype.getTextInputValue = function getTextInputValue(name){
    var i, _i;
    for(i=0,_i=this.state.length; i<_i; i++){
      if(this.state[i].name === name){
        return this.state[i].value
      }
    }
    return '';
  };

  GOVUK = GOVUK || {};
  GOVUK.GDM = GOVUK.GDM || {};
  GOVUK.GDM.LiveSearch = LiveSearch;

  // Instantiate an option select for each one found on the page
  var form = new GOVUK.GDM.LiveSearch($('#js-dm-live-search-wrapper'));
})(jQuery);
