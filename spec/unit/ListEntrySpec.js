describe("ListEntryField", function () {
  var entryFieldTemplate = Hogan.compile(
        '<div class="list-entry">' +
          '<label for="{{{id}}}" class="text-box-number-label">' +
            '<span class="hidden">Item number </span>{{number}}.' +
          '</label>' +
          '<input type="text" name="{{{name}}}" id="{{{id}}}" class="text-box" value="">' +
        '</div>'
      ),
      wrapperHTML = (
          '<fieldset class="question" id="features">' +
            '<legend class="question-heading question-heading-with-hint ">Service features</legend>' +
            '<p class="question-hint">Include the technical features of your product, eg graphical workflow, remote access. (Maximum 10 words per feature. Maximum 10 features.)</p>' +
            '<div class="input-list" data-list-item-name="feature" id="list-entry-features">' +
            '</div>' +
          '</fieldset>'
      ),
      $wrapper,
      mock4Entries;

  mock4Entries = function ($wrapper) {
    $wrapper.find('.list-entry input').eq(0).val('Hosting');
    $wrapper.find('.list-entry input').eq(1).val('Domain provision');
    $wrapper.find('.list-entry input').eq(2).val('CMS');
    $wrapper.find('.list-entry input').eq(3).val('Databases');
  };

  beforeEach(function () {
    var idx;
    $wrapper = $(wrapperHTML);

    for (idx in [1,2,3,4,5,6,7,8,9,10]) {
      $wrapper.find(".input-list").append(entryFieldTemplate.render({
        'name': 'features',
        'id': 'features-' + idx,
        'number': idx
      }));
    }
    $(document.body).append($wrapper);
  });

  afterEach(function () {
    $wrapper.remove();
  });

  describe("When called", function () {
    it("Should remove all the fields except the first 2 if no values are present on page load", function () {
      expect($wrapper.find('.list-entry').length).toEqual(10);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(2);
    });

    it("Should remove all the fields except those first 2, and leave the first field as is if it has a value on page load", function () {
      $wrapper.find('.list-entry input').eq(0).val('Hosting');
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(2);
      expect($wrapper.find('.list-entry').eq(0).find('input').val()).toEqual('Hosting');
      expect($wrapper.find('.list-entry').eq(1).find('input').val()).toEqual('');
    });

    it("Should remove all the fields except those first 2, and leave the second field as is if it has a value on page load", function () {
      $wrapper.find('.list-entry input').eq(1).val('Domain provision');
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(2);
      expect($wrapper.find('.list-entry').eq(0).find('input').val()).toEqual('');
      expect($wrapper.find('.list-entry').eq(1).find('input').val()).toEqual('Domain provision');
    });

    it("Should remove all the fields except those with values if we have 4 values on page load", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').eq(0).find('input').val()).toEqual('Hosting');
      expect($wrapper.find('.list-entry').eq(1).find('input').val()).toEqual('Domain provision');
      expect($wrapper.find('.list-entry').eq(2).find('input').val()).toEqual('CMS');
      expect($wrapper.find('.list-entry').eq(3).find('input').val()).toEqual('Databases');
    });

    it("Should retain all field values from the loaded page", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').eq(0).find('input').val()).toEqual('Hosting');
      expect($wrapper.find('.list-entry').eq(1).find('input').val()).toEqual('Domain provision');
      expect($wrapper.find('.list-entry').eq(2).find('input').val()).toEqual('CMS');
      expect($wrapper.find('.list-entry').eq(3).find('input').val()).toEqual('Databases');
    });

    it("Should add 'remove' buttons to all fields except the first", function () {
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').eq(0).find('button.list-entry-remove').length).toEqual(0);
      expect($wrapper.find('.list-entry').eq(1).find('button.list-entry-remove').length).toEqual(1);
    });

    it("Should add an 'add feature' button to the bottom of the list", function () {
      GOVUK.GDM.listEntry();
      expect($wrapper.find('button.list-entry-add').length).toEqual(1);
    });
  });

  describe("When the 'remove' button is clicked", function () {
    it("Should remove the associated field", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(4);
      $wrapper.find('.list-entry').eq(3).find('button.list-entry-remove').trigger('click');
      expect($wrapper.find('.list-entry').length).toEqual(3);
    });

    it("Should leave the list with the right numbers", function () {
      var getNumberFromEntry = function ($entry) {
        return parseInt($entry.find('label')[0].lastChild.nodeValue, 10);
      };

      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      $wrapper.find('.list-entry').eq(3).find('button.list-entry-remove').trigger('click');
      expect(getNumberFromEntry($wrapper.find('.list-entry').eq(0))).toEqual(1);
      expect(getNumberFromEntry($wrapper.find('.list-entry').eq(1))).toEqual(2);
      expect(getNumberFromEntry($wrapper.find('.list-entry').eq(2))).toEqual(3);
    });

    it("Should leave the list with the right values if you remove the last one", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      $wrapper.find('.list-entry').eq(3).find('button.list-entry-remove').trigger('click');
      expect($wrapper.find('.list-entry').eq(0).find('input').val()).toEqual('Hosting');
      expect($wrapper.find('.list-entry').eq(1).find('input').val()).toEqual('Domain provision');
      expect($wrapper.find('.list-entry').eq(2).find('input').val()).toEqual('CMS');
    });

    it("Should leave the list with the right values if you remove the second one", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      $wrapper.find('.list-entry').eq(1).find('button.list-entry-remove').trigger('click');
      expect($wrapper.find('.list-entry').eq(0).find('input').val()).toEqual('Hosting');
      expect($wrapper.find('.list-entry').eq(1).find('input').val()).toEqual('CMS');
      expect($wrapper.find('.list-entry').eq(2).find('input').val()).toEqual('Databases');
    });

    it("Should add the 'add' button if the added question is the 10th field", function () {
      $wrapper.find('.list-entry input').eq(0).val('Hosting');
      $wrapper.find('.list-entry input').eq(1).val('Domain provision');
      $wrapper.find('.list-entry input').eq(2).val('CMS');
      $wrapper.find('.list-entry input').eq(3).val('Databases');
      $wrapper.find('.list-entry input').eq(4).val('Storage');
      $wrapper.find('.list-entry input').eq(5).val('Solid-state storage');
      $wrapper.find('.list-entry input').eq(6).val('Real-time logging');
      $wrapper.find('.list-entry input').eq(7).val('Social');
      $wrapper.find('.list-entry input').eq(8).val('Email notifications');
      $wrapper.find('.list-entry input').eq(9).val('CDN');
      GOVUK.GDM.listEntry();
      $wrapper.find('.list-entry').eq(9).find('button.list-entry-remove').trigger('click');
      expect($wrapper.find('button.list-entry-add').length).toEqual(1);
    });
  });

  describe("When the 'add feature' button is clicked", function () {
    it("Should add a new field", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(4);
      $wrapper.find('button.list-entry-add').trigger('click');
      expect($wrapper.find('.list-entry').length).toEqual(5);
    });

    it("Should update the number of fields users are allowed to enter if one is removed", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(4);
      $wrapper.find('button.list-entry-add').trigger('click');
      expect($wrapper.find('button.list-entry-add').text()).toEqual('Add another feature (5 remaining)');
    });

    it("Should update the number of fields users are allowed to enter if one is added", function () {
      mock4Entries($wrapper);
      GOVUK.GDM.listEntry();
      expect($wrapper.find('.list-entry').length).toEqual(4);
      $wrapper.find('.list-entry').eq(3).find('button.list-entry-remove').trigger('click');
      expect($wrapper.find('button.list-entry-add').text()).toEqual('Add another feature (7 remaining)');
    });

    it("Should remove the 'add' button if the added question is the 10th field", function () {
      $wrapper.find('.list-entry input').eq(0).val('Hosting');
      $wrapper.find('.list-entry input').eq(1).val('Domain provision');
      $wrapper.find('.list-entry input').eq(2).val('CMS');
      $wrapper.find('.list-entry input').eq(3).val('Databases');
      $wrapper.find('.list-entry input').eq(4).val('Storage');
      $wrapper.find('.list-entry input').eq(5).val('Solid-state storage');
      $wrapper.find('.list-entry input').eq(6).val('Real-time logging');
      $wrapper.find('.list-entry input').eq(7).val('Social');
      $wrapper.find('.list-entry input').eq(8).val('Email notifications');
      GOVUK.GDM.listEntry();
      $wrapper.find('button.list-entry-add').trigger('click');
      expect($wrapper.find('button.list-entry-add').length).toEqual(0);
    });
  });
});
