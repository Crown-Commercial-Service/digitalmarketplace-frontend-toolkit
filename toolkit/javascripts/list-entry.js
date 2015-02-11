(function () {

  'use strict';

  var root = this,
      $ = this.jQuery;

  var lists = [],
      listEntry,
      ListEntry;

  ListEntry = function (elm) {
    var $elm = $(elm),
        idPattern = this.getIdPattern($elm.find('input')[0]);

    if (!idPattern) { return false; }
    this.idPattern = idPattern;
    this.elementSelector = '.list-entry, .list-entry-remove, .list-entry-add';
    this.entries = [];
    this.$wrapper = $elm;
    this.minEntries = 2;
    this.listItemName = this.$wrapper.data('listItemName');

    this.getValues();
    this.maxEntries = this.entries.length;
    this.trimEntries();
    this.render();
    this.bindEvents();
  };
  ListEntry.prototype.entryTemplate = Hogan.compile(
    '<div class="list-entry">' +
      '<label for="{{{id}}}" class="text-box-number-label">' +
        '<span class="visuallyhidden">{{listItemName}} number </span>{{number}}.' +
      '</label>' +
      '<input type="text" name="{{{name}}}" id="{{{id}}}" class="text-box" value="{{value}}">' +
      '{{#button}}' +
        '<button type="button" class="button-secondary list-entry-remove">' +
          'Remove<span class="visuallyhidden"> {{listItemName}} number {{number}}</span>' +
        '</button>' +
      '{{/button}}' +
    '</div>'
  );
  ListEntry.prototype.addButtonTemplate = Hogan.compile(
    '<button type="button" class="button-secondary list-entry-add">Add another {{listItemName}} ({{entriesLeft}} remaining)</button>'
  );
  ListEntry.prototype.getIdPattern = function (input) {
    var pattern = input.id.match(/(p\d+q\d+val)\d+$/);

    if (pattern !== null) {
      return pattern[1];
    } else {
      return false;
    }
  };
  ListEntry.prototype.getValues = function () {
    this.entries = [];
    this.$wrapper.find('input').each(function (idx, elm) {
      var val = $(elm).val();

      this.entries.push(val);
    }.bind(this));
  };
  ListEntry.prototype.trimEntries = function () {
    var entryIdx = this.entries.length,
        newEntries = [];

    while (entryIdx--) {
      if (this.entries[entryIdx] !== '') {
        newEntries.push(this.entries[entryIdx]);
      } else {
        if (entryIdx < this.minEntries) {
          newEntries.push('');
        }
      }
    }
    this.entries = newEntries.reverse();
  };
  ListEntry.prototype.getId = function (num) {
    return this.idPattern + num;
  };
  ListEntry.prototype.bindEvents = function () {
    this.$wrapper.on('click', '.list-entry-remove', function (e) {
      this.removeEntry($(e.target));
    }.bind(this));
    this.$wrapper.on('click', '.list-entry-add', function (e) {
      this.addEntry();
    }.bind(this));
  };
  ListEntry.prototype.shiftFocus = function (opts) {
    var numberTargeted;

    if (opts.action === 'remove') {
      numberTargeted = (opts.entryNumberFocused > 1) ? opts.entryNumberFocused - 1 : 1;
    } else { // opts.action === 'add'
      numberTargeted = opts.entryNumberFocused + 1;
    }
    this.$wrapper.find('.list-entry').eq(numberTargeted - 1).find('input').focus();
  };
  ListEntry.prototype.removeEntryFromEntries = function (entryNumber) {
    var idx,
        len,
        newEntries = [];

    for (idx = 0, len = this.entries.length; idx < len; idx++) {
      if ((entryNumber - 1) !== idx) {
        newEntries.push(this.entries[idx]);
      }
    }
    this.entries = newEntries;
  };
  ListEntry.prototype.addEntry = function ($removeButton) {
    var currentLastEntryNumber = this.entries.length;

    this.getValues();
    this.entries.push('');
    this.render();
    this.shiftFocus({ 'action' : 'add', 'entryNumberFocused' : currentLastEntryNumber });
  };
  ListEntry.prototype.removeEntry = function ($removeButton) {
    var entryNumber = parseInt($removeButton.find('span').text().match(/\d+/)[0], 10);

    this.getValues();
    this.removeEntryFromEntries(entryNumber);
    this.render();
    this.shiftFocus({ 'action' : 'remove', 'entryNumberFocused' : entryNumber });
  };
  ListEntry.prototype.render = function () {
    this.$wrapper.find(this.elementSelector).remove();
    $.each(this.entries, function (idx, entry) {
      var entryNumber = idx + 1,
          dataObj = {
            'id' : this.getId(entryNumber),
            'number' : entryNumber,
            'name' : this.getId(entryNumber),
            'value' : entry,
            'listItemName' : this.listItemName
          };

      if (entryNumber > 1) {
        dataObj.button = true;
      }
      this.$wrapper.append(this.entryTemplate.render(dataObj));
    }.bind(this));
    if (this.entries.length < this.maxEntries) {
      this.$wrapper.append(this.addButtonTemplate.render({
        'listItemName' : this.listItemName,
        'entriesLeft' : (this.maxEntries - this.entries.length)
      }));
    }
  };

  listEntry = function () {
    $('.input-list').each(function () {
      lists.push(new ListEntry(this));
    });
  };

  this.GOVUK = this.GOVUK || {};
  this.GOVUK.GDM = this.GOVUK.GDM || {};
  this.GOVUK.GDM.listEntry = listEntry;
}).call(this);
