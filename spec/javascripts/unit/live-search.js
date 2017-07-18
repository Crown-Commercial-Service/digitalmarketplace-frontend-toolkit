describe("live-search", function(){
  var $form, $results, _supportHistory, liveSearch;

  var dummyPage = "<div id=\"js-dm-live-search-wrapper\">   <div class=\"grid-row\">      <section class=\"column-one-third search-page-filters\" aria-label=\"Search filters\">         <form action=\"/somewhere\" method=\"get\" id=\"js-dm-live-search-form\">            <div class=\"govuk-option-select filter-field-text js-collapsible\">               <div class=\"container-head\">                  <label class=\"option-select-label\" for=\"keywords\">                  Keywords                  </label>               </div>               <div class=\"container-search\">                  <input type=\"search\" name=\"q\" id=\"keywords\" value=\"\" maxlength=\"200\">                  <input class=\"submit\" type=\"submit\" value=\"Search\">               </div>            </div>            <div id=\"js-dm-live-search-categories\" class=\"js-dm-live-search-fade\" style=\"opacity: 1;\">            </div>            <div class=\"govuk-option-select js-collapsible\">               <button class=\"js-container-head\" type=\"button\" aria-expanded=\"false\" aria-controls=\"\">                  <div class=\"option-select-label\">Option 1</div>                  <div class=\"js-selected-counter\"></div>               </button>               <div class=\"options-container\" id=\"\">                  <div class=\"js-auto-height-inner\">                     <label for=\"option1_1\">                     <input name=\"option1_1\" value=\"1_1\" id=\"option1_1\" type=\"checkbox\" aria-controls=\"\">                     Option 1_1                     </label>                     <label for=\"option1_2\">                     <input name=\"option1_2\" value=\"1_2\" id=\"option1_2\" type=\"checkbox\" aria-controls=\"\">                     Option 1_2                     </label>                     <label for=\"option1_3\">                     <input name=\"option1_3\" value=\"1_3\" id=\"option1_3\" type=\"checkbox\" aria-controls=\"\">                     Option 1_3                     </label>                     <label for=\"option1_4\">                     <input name=\"option1_4\" value=\"1_4\" id=\"option1_4\" type=\"checkbox\" aria-controls=\"\">                     Option 1_4                     </label>                  </div>               </div>            </div>            <div class=\"govuk-option-select js-collapsible\">               <button class=\"js-container-head\" type=\"button\" aria-expanded=\"false\" aria-controls=\"\">                  <div class=\"option-select-label\">Option 2</div>                  <div class=\"js-selected-counter\"></div>               </button>               <div class=\"options-container\" id=\"\">                  <div class=\"js-auto-height-inner\">                     <label for=\"option2_1\">                     <input name=\"option2_1\" value=\"2_1\" id=\"option2_1\" type=\"checkbox\" aria-controls=\"\">                     Option 2_1                     </label>                     <label for=\"option2_2\">                     <input name=\"option2_2\" value=\"2_2\" id=\"option2_2\" type=\"checkbox\" aria-controls=\"\">                     Option 2_2                     </label>                     <label for=\"option2_3\">                     <input name=\"option2_3\" value=\"2_3\" id=\"option2_3\" type=\"checkbox\" aria-controls=\"\">                     Option 2_3                     </label>                  </div>               </div>            </div>            <button class=\"button-save js-hidden js-dm-live-search\" type=\"submit\">Filter</button>         </form>      </section>      <section class=\"column-two-thirds\" aria-label=\"Search results\">         <div id=\"js-dm-live-search-info\">            <p class=\"search-summary\">               <span class=\"search-summary-count\">0</span> results found in <em>All categories</em>            </p>         </div>         <div id=\"js-dm-live-search-results\" class=\"js-dm-live-search-fade\" style=\"opacity: 1;\">            <nav role=\"navigation\">               <ul class=\"previous-next-navigation\">               </ul>            </nav>         </div>      </section>   </div></div>";

  var dummyResponse = {
    "categories": {
      "selector": "#js-dm-live-search-categories",
      "html": "<div id=\"js-dm-live-search-categories\" class=\"js-dm-live-search-fade\" style=\"opacity: 1;\">    <div class=\"lot-filters\">        <h2>Choose a category</h2>        <ul>            <li aria-current=\"page\">            <strong>All categories</strong>            <ul class=\"lot-filters--last-list\">                <li>Cloud hosting (0)</li>                <li><a href=\"/somewhere?q=cat&amp;lot=cloud-software\">Cloud software (1)</a></li>                <li>Cloud support (0)</li>            </ul>            </li>        </ul>    </div></div>"
    },
    "results": {
      "selector": "#js-dm-live-search-results",
      "html": "<div id=\"js-dm-live-search-results\" class=\"js-dm-live-search-fade\" style=\"opacity: 1;\">  <div class=\"search-result\">      <h2 class=\"search-result-title\">        <a href=\"/somewhere/123456789\">A aervice</a>      </h2>      <p class=\"search-result-supplier\">        A service supplier      </p>      <p class=\"search-result-excerpt\">        A service excerpt.      </p>      <ul aria-label=\"tags\" class=\"search-result-metadata\">        <li class=\"search-result-metadata-item\">            A service lot        </li>        <li class=\"search-result-metadata-item\">            A service framework        </li>      </ul>  </div>  <nav role=\"navigation\">      <ul class=\"previous-next-navigation\">      </ul>  </nav></div>"
    },
    "summary": {
      "selector": "#js-dm-live-search-info",
      "html": "<div id=\"js-dm-live-search-info\">  <p class=\"search-summary\">      <span class=\"search-summary-count\">1</span> result contaning <em>cat</em> found in <em>All categories</em>  </p></div>"
    }
  };
  var dummyResponseString = JSON.stringify(dummyResponse);

  beforeEach(function () {
    $wrapper = $(dummyPage);
    $form = $wrapper.find('form');

    $categories = $wrapper.find('#js-dm-live-search-categories');
    $results = $wrapper.find('#js-dm-live-search-results');
    $summary = $wrapper.find('#js-dm-live-search-info');

    _supportHistory = GOVUK.GDM.support.history;
    GOVUK.GDM.support.history = function(){ return true; };
    GOVUK.analytics = { trackPageview: function (){ } };

    liveSearch = new GOVUK.GDM.LiveSearch($wrapper);

    jasmine.Ajax.install();
  });

  afterEach(function(){
    $form.remove();
    $results.remove();
    $summary.remove();

    GOVUK.GDM.support.history = _supportHistory;

    jasmine.Ajax.uninstall();
  });

  it("should save initial state", function(){
    expect(liveSearch.state).toEqual([{name: 'q', value: ''}]);
  });

  it("should detect a new state", function(){
    expect(liveSearch.isNewState()).toBe(false);
    $form.find('#option1_1').prop('checked', true);
    expect(liveSearch.isNewState()).toBe(true);
  });

  it("should update state to current state", function(){
    expect(liveSearch.state).toEqual([{name: 'q', value: ''}]);
    $form.find('#option1_1').prop('checked', true);
    liveSearch.saveState();
    expect(liveSearch.state).toEqual([{name: 'q', value: ''}, {name: 'option1_1', value: '1_1'}]);
  });

  it("should update state to passed in state", function(){
    expect(liveSearch.state).toEqual([{name: 'q', value: ''}]);
    $form.find('#option1_1').prop('checked', true);
    liveSearch.saveState({ my: "new", state: "object"});
    expect(liveSearch.state).toEqual({ my: "new", state: "object"});
  });

  it("should not request new results if they are in the cache", function(){
    liveSearch.resultsCache["more=results"] = "exists";
    liveSearch.state = { more: "results" };
    spyOn(liveSearch, 'displayFilterResults');
    spyOn(jQuery, 'ajax');

    liveSearch.updateResults();
    expect(liveSearch.displayFilterResults).toHaveBeenCalled();
    expect(jQuery.ajax).not.toHaveBeenCalled();
  });

  it("should return a promise-like object if results are in the cache", function(){
    liveSearch.resultsCache["more=results"] = "exists";
    liveSearch.state = { more: "results" };
    spyOn(liveSearch, 'displayFilterResults');

    var promise = liveSearch.updateResults();

    expect(typeof promise.done).toBe('function');
    expect(liveSearch.displayFilterResults).toHaveBeenCalled();
  });

  it("should return a promise-like object if results aren't in the cache", function(){
    liveSearch.state = { not: "cached" };
    spyOn(liveSearch, 'displayFilterResults');

    var promise = liveSearch.updateResults();

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "application/json",
      "responseText": dummyResponseString
    });

    expect(typeof promise.done).toBe('function');
    expect(liveSearch.displayFilterResults).toHaveBeenCalled();
  });

  it("should cache results against the form state that submitted the request, not the form state when the response is received", function(){
    spyOn(liveSearch, 'displayFilterResults');

    liveSearch.state = { q: 'old-state' };
    var promise = liveSearch.updateResults();
    liveSearch.state = { q: 'new-state' };

    jasmine.Ajax.requests.mostRecent().respondWith({
      "status": 200,
      "contentType": "application/json",
      "responseText": dummyResponseString
    });

    expect(JSON.stringify(liveSearch.cache('q=old-state'))).toBe(dummyResponseString);
    expect(liveSearch.cache('q=new-state')).toBe(undefined);
  });

  it("should show error indicator when error loading new results", function(){
    liveSearch.state = { not: "cached" };
    spyOn(liveSearch, 'displayFilterResults');
    spyOn(liveSearch, 'showErrorIndicator');
    var ajaxCallback = jasmine.createSpyObj('ajax', ['done', 'error']);
    ajaxCallback.done.and.returnValue(ajaxCallback);
    spyOn(jQuery, 'ajax').and.returnValue(ajaxCallback);

    liveSearch.updateResults();
    ajaxCallback.error.calls.mostRecent().args[0]()
    expect(liveSearch.showErrorIndicator).toHaveBeenCalled();
  });

  it("should return cache items for current state", function(){
    liveSearch.state = { not: "cached" };
    expect(liveSearch.cache('some-slug')).toBe(undefined);
    liveSearch.cache('some-slug', 'something in the cache');
    expect(liveSearch.cache('some-slug')).toBe('something in the cache');
  });

  describe("should not display out of date results", function(){

    it('should not update the results if the state associated with these results is not the current state of the page', function(){
      liveSearch.state = 'cma-cases.json?keywords=123'
      spyOn(liveSearch, 'replaceBlock');
      liveSearch.displayFilterResults(dummyResponse, 'made up state');
      expect(liveSearch.replaceBlock).not.toHaveBeenCalled();
    });

    it('should update the results if the state of these results matches the state of the page', function(){
      liveSearch.state = {search: 'state'};
      spyOn(liveSearch, 'replaceBlock');
      liveSearch.displayFilterResults(dummyResponse, $.param(liveSearch.state));
      expect(liveSearch.replaceBlock).toHaveBeenCalled();
    });
  });

  it("should un-hide the filter results button if GOVUK.GDM.support.history returns false", function(){
    expect($form.find('button.button-save.js-dm-live-search')).toHaveClass('js-hidden');
    GOVUK.GDM.support.history = function(){ return false; };
    liveSearch = new GOVUK.GDM.LiveSearch($wrapper);
    expect($form.find('button.button-save.js-dm-live-search')).not.toHaveClass('js-hidden');
  });

  describe('with relevant DOM nodes set', function(){
    beforeEach(function(){
      liveSearch.$form = $form;
      liveSearch.state = { q: '' };
    });

    it("should update save state and update results when checkbox is changed", function(){
      var promise = jasmine.createSpyObj('promise', ['done']);
      spyOn(liveSearch, 'updateResults').and.returnValue(promise);

      $form.find('#option1_1').prop('checked', true);

      liveSearch.formChange();

      expect(liveSearch.state).toEqual([{name: 'q', value: ''}, {name: 'option1_1', value: '1_1'}]);
      expect(liveSearch.updateResults).toHaveBeenCalled();
      promise.done.calls.mostRecent().args[0]();
    });

    it("should trigger analytics trackpage when checkbox is changed", function(){
      var promise = jasmine.createSpyObj('promise', ['done']);
      spyOn(liveSearch, 'updateResults').and.returnValue(promise);
      spyOn(GOVUK.analytics, 'trackPageview');
      liveSearch.state = [];

      liveSearch.formChange();
      promise.done.calls.mostRecent().args[0]();

      expect(GOVUK.analytics.trackPageview).toHaveBeenCalled();
      var trackArgs = GOVUK.analytics.trackPageview.calls.first().args[0];
      expect(trackArgs.split('?')[1], 'q=');
    });

    it("should do nothing if state hasn't changed when a checkbox is changed", function(){
      spyOn(liveSearch, 'updateResults')

      expect(liveSearch.state).toEqual({q: ''});

      liveSearch.formChange();

      expect(liveSearch.state).toEqual({q: ''});
      expect(liveSearch.updateResults).not.toHaveBeenCalled();
    });
  });

  describe("popState", function(){
    var dummyHistoryState;

    beforeEach(function(){
      dummyHistoryState = { originalEvent: { state: true } };
    });

    it("should call restoreBooleans, restoreSearchInputs, saveState and updateResults if there is an event in the history", function(){
      spyOn(liveSearch, 'restoreBooleans');
      spyOn(liveSearch, 'restoreSearchInputs');
      spyOn(liveSearch, 'saveState');
      spyOn(liveSearch, 'updateResults');

      liveSearch.popState(dummyHistoryState);

      expect(liveSearch.restoreBooleans).toHaveBeenCalled();
      expect(liveSearch.restoreSearchInputs).toHaveBeenCalled();
      expect(liveSearch.saveState).toHaveBeenCalled();
      expect(liveSearch.updateResults).toHaveBeenCalled();
    });
  });

  describe("restoreBooleans", function(){
    beforeEach(function(){
      liveSearch.state = [{name:"list_1[]", value:"checkbox_1"}, {name:"list_1[]", value:"checkbox_2"}, {name:'list_2[]', value:"radio_1"}]
      liveSearch.$form = $('<form action="/g-cloud/search" id="js-dm-live-search-form"><input id="check_1" type="checkbox" name="list_1[]" value="checkbox_1"><input type="checkbox" id="check_2"  name="list_1[]" value="checkbox_2"><input type="radio" id="radio_1"  name="list_2[]" value="radio_1"><input type="radio" id="radio_2"  name="list_2[]" value="radio_2"><input type="submit"/></form>');
    });

    it("should check a checkbox if in the state it is checked in the history", function(){
      expect(liveSearch.$form.find('input[type=checkbox]:checked').length).toBe(0)
      liveSearch.restoreBooleans();
      expect(liveSearch.$form.find('input[type=checkbox]:checked').length).toBe(2)
    });

    it("should not check all the checkboxes if only one is checked", function(){
      liveSearch.state = [{name:"list_1[]", value:"checkbox_2"}]
      expect(liveSearch.$form.find('input[type=checkbox]:checked').length).toBe(0)
      liveSearch.restoreBooleans();
      expect(liveSearch.$form.find('input[type=checkbox]:checked')[0].id).toBe('check_2');
      expect(liveSearch.$form.find('input[type=checkbox]:checked').length).toBe(1)
    });

    it("should pick a radiobox if in the state it is picked in the history", function(){
      expect(liveSearch.$form.find('input[type=radio]:checked').length).toBe(0)
      liveSearch.restoreBooleans();
      expect(liveSearch.$form.find('input[type=radio]:checked').length).toBe(1)
    });
  });

  describe("restoreSearch", function(){
    beforeEach(function(){
       liveSearch.state = [{name:"text_1", value:"Monday"}]
       liveSearch.$form = $('<form action="/g-cloud/search"><input id="text_1" type="search" name="text_1"><input id="text_2" type="search" name="text_2"></form>');
     });

     it("should put the right text back in the right box", function(){
       expect(liveSearch.$form.find('#text_1').val()).toBe('');
       expect(liveSearch.$form.find('#text_2').val()).toBe('');
       liveSearch.restoreSearchInputs();
       expect(liveSearch.$form.find('#text_1').val()).toBe('Monday');
       expect(liveSearch.$form.find('#text_2').val()).toBe('');
     })
  });
});
