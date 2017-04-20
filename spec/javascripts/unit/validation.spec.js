/* global describe it expect beforeEach afterEach jasmine */

var $ = window.jQuery

describe('validation', function () {
  'use strict'
//  var GOVUK = window.GOVUK
  beforeEach(function () {

    // Sample markup
    this.$content = $(
        '<div class="validation-masthead" role="group" aria-labelledby="validation-masthead-heading">' +
        '<h1 class="validation-masthead-heading" id="validation-masthead-heading">' +
        'A supplier account already exists with that DUNS number' +
        '</h1>' +
        '<p class="validation-masthead-description">' +
        '<ul><li><a href="" class="validation-masthead-link">Email address</a></li></ul>' +
        '</p>' +
        '</div>' +
        '<form id="contact_email">' +
        '<input id="input-contact_email" />' +
        '</form>'
      )

    // Add to page
    $(document.body).append(this.$content)
    GOVUK.GDM.validationLinks()

    this.body = document.activeElement;
    this.$link = $(".validation-masthead a");
  })

  afterEach(function () {
    this.$content.remove();
  });

  it('focuses on element when clicking on anchor link', function () {
    var $target = $('#contact_email input');
    this.$link.attr('href', '#contact_email');
    this.$link.click();
    expect(document.activeElement).not.toBe(this.body);
    expect(document.activeElement).toBe($target[0]);
  })

  it('does not change focus when clicking on non-anchor link', function () {
    this.$link.attr('href', 'mailto:fakeemail@email.com');
    this.$link.click();
    expect(document.activeElement).toBe(this.body);
  })
})

