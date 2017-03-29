/* global describe it expect beforeEach afterEach jasmine */

var $ = window.jQuery

describe('show-hide-content', function () {
  'use strict'
  var GOVUK = window.GOVUK

  var expectControlIsChecked = function ($control, contentId) {
    expect($control.attr('aria-controls')).toBe(contentId)

    expect($control.is(':checked')).toBe(true)
    expect($control.attr('aria-expanded')).toBe('true')
  }

  var expectControlIsNotChecked = function ($control, contentId) {
    expect($control.attr('aria-controls')).toBe(contentId)

    expect($control.is(':checked')).toBe(false)
    expect($control.attr('aria-expanded')).toBe('false')
  }

  var expectContentToBeVisible = function ($content) {
    expect($content.attr('aria-hidden')).toBe('false')
    expect($content.hasClass('js-hidden')).toEqual(false)
  }

  var expectContentToBeHidden = function ($content) {
    expect($content.attr('aria-hidden')).toBe('true')
    expect($content.hasClass('js-hidden')).toEqual(true)
  }

  afterEach(function () {
    if (this.showHideContent) {
      this.showHideContent.destroy()
    }

    this.$content.remove()
  })

  describe('when the controls are inside a form', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(

        // Radio buttons (yes/no)
        '<form>' +
        '<label class="block-label" data-target="show-hide-radios">' +
        '<input type="radio" name="single" value="yes">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +
        '<div id="show-hide-radios" class="panel js-hidden" />' +
        '</form>' +

        // Checkboxes (multiple values)
        '<form>' +
        '<label class="block-label" data-target="show-hide-checkboxes">' +
        '<input type="checkbox" name="multiple[option1]">' +
        'Option 1' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option2]">' +
        'Option 2' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option3]">' +
        'Option 3' +
        '</label>' +
        '<div id="show-hide-checkboxes" class="panel js-hidden" />' +
        '</form>'
      )

      // Find radios/checkboxes
      var $radios = this.$content.find('input[type=radio]')
      var $checkboxes = this.$content.find('input[type=checkbox]')

      // Two radios
      this.$radio1 = $radios.eq(0)
      this.$radio2 = $radios.eq(1)

      // Three checkboxes
      this.$checkbox1 = $checkboxes.eq(0)
      this.$checkbox2 = $checkboxes.eq(1)
      this.$checkbox3 = $checkboxes.eq(2)

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.$radioShowHide = $('#show-hide-radios')
      this.$checkboxShowHide = $('#show-hide-checkboxes')

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()
    })

    describe('and when this.showHideContent = new GOVUK.ShowHideContent() is called', function () {
      it('should add the aria attributes to inputs with show/hide content', function () {
        expect(this.$radio1.attr('aria-expanded')).toBe('false')
        expect(this.$radio1.attr('aria-controls')).toBe('show-hide-radios')
      })

      it('should add the aria attributes to show/hide content', function () {
        expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
      })

      it('should hide the show/hide content visually', function () {
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
      })

      it('should do nothing if no radios are checked', function () {
        expect(this.$radio1.attr('aria-expanded')).toBe('false')
        expect(this.$radio2.attr('aria-expanded')).toBe(undefined)
      })

      it('should do nothing if no checkboxes are checked', function () {
        expect(this.$checkbox1.attr('aria-expanded')).toBe('false')
        expect(this.$checkbox2.attr('aria-expanded')).toBe(undefined)
        expect(this.$checkbox3.attr('aria-expanded')).toBe(undefined)
      })

      describe('with non-default markup', function () {
        beforeEach(function () {
          this.showHideContent.destroy()
        })

        it('should do nothing if a radio without show/hide content is checked', function () {
          this.$radio2.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$radio1.attr('aria-expanded')).toBe('false')
          expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
          expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
        })

        it('should do nothing if a checkbox without show/hide content is checked', function () {
          this.$checkbox2.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('false')
          expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('true')
          expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(true)
        })

        it('should do nothing if checkboxes without show/hide content is checked', function () {
          this.$checkbox2.prop('checked', true)
          this.$checkbox3.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('false')
          expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('true')
          expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(true)
        })

        it('should make the show/hide content visible if its radio is checked', function () {
          this.$radio1.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$radio1.attr('aria-expanded')).toBe('true')
          expect(this.$radioShowHide.attr('aria-hidden')).toBe('false')
          expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
        })

        it('should make the show/hide content visible if its checkbox is checked', function () {
          this.$checkbox1.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
          expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('false')
          expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
        })
      })

      describe('and a show/hide radio receives a click', function () {
        it('should make the show/hide content visible', function () {
          this.$radio1.click()
          expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
        })

        it('should add the aria attributes to show/hide content', function () {
          this.$radio1.click()
          expect(this.$radio1.attr('aria-expanded')).toBe('true')
          expect(this.$radioShowHide.attr('aria-hidden')).toBe('false')
          expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
        })
      })

      describe('and a show/hide checkbox receives a click', function () {
        it('should make the show/hide content visible', function () {
          this.$checkbox1.click()
          expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
        })

        it('should add the aria attributes to show/hide content', function () {
          this.$checkbox1.click()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
          expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('false')
          expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
        })
      })

      describe('and a show/hide radio receives a click, but another group radio is clicked afterwards', function () {
        it('should make the show/hide content hidden', function () {
          this.$radio1.click()
          this.$radio2.click()
          expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
        })

        it('should add the aria attributes to show/hide content', function () {
          this.$radio1.click()
          this.$radio2.click()
          expect(this.$radio1.attr('aria-expanded')).toBe('false')
          expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
        })
      })

      describe('and a show/hide checkbox receives a click, but another checkbox is clicked afterwards', function () {
        it('should keep the show/hide content visible', function () {
          this.$checkbox1.click()
          this.$checkbox2.click()
          expect(this.$checkboxShowHide.hasClass('js-hidden')).toEqual(false)
        })

        it('should keep the aria attributes to show/hide content', function () {
          this.$checkbox1.click()
          this.$checkbox2.click()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
          expect(this.$checkboxShowHide.attr('aria-hidden')).toBe('false')
        })
      })
    })

    describe('before this.showHideContent.destroy() is called', function () {
      it('document.body should have show/hide event handlers', function () {
        var events = $._data(document.body, 'events')
        expect(events && events.change).toContain(jasmine.objectContaining({
          namespace: 'ShowHideContent',
          selector: 'input[type="radio"][name="single"]'
        }))
        expect(events && events.change).toContain(jasmine.objectContaining({
          namespace: 'ShowHideContent',
          selector: '.block-label[data-target] input[type="checkbox"]'
        }))
      })
    })

    describe('and when this.showHideContent.destroy() is called', function () {
      beforeEach(function () {
        this.showHideContent.destroy()
      })

      it('should have no show/hide event handlers', function () {
        var events = $._data(document.body, 'events')
        expect(events && events.change).not.toContain(jasmine.objectContaining({
          namespace: 'ShowHideContent',
          selector: 'input[type="radio"][name="single"]'
        }))
        expect(events && events.change).not.toContain(jasmine.objectContaining({
          namespace: 'ShowHideContent',
          selector: '.block-label[data-target] input[type="checkbox"]'
        }))
      })
    })
  })

  describe('when the controls are inside a form and have multiple targets', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(

        // Radio buttons (yes/no)
        '<form>' +
        '<label class="block-label" data-target="show-hide-radios-1 show-hide-radios-2">' +
        '<input type="radio" name="single" value="yes">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +
        '<div id="show-hide-radios-1" class="panel js-hidden" />' +
        '<div id="show-hide-radios-2" class="panel js-hidden" />' +
        '</form>' +

        // Checkboxes (multiple values)
        '<form>' +
        '<label class="block-label" data-target="show-hide-checkboxes-1 show-hide-checkboxes-2">' +
        '<input type="checkbox" name="multiple[option1]">' +
        'Option 1' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option2]">' +
        'Option 2' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option3]">' +
        'Option 3' +
        '</label>' +
        '<div id="show-hide-checkboxes-1" class="panel js-hidden" />' +
        '<div id="show-hide-checkboxes-2" class="panel js-hidden" />' +
        '</form>'
      )

      // Find radios/checkboxes
      var $radios = this.$content.find('input[type=radio]')
      var $checkboxes = this.$content.find('input[type=checkbox]')

      // Two radios
      this.$radio1 = $radios.eq(0)
      this.$radio2 = $radios.eq(1)

      // Three checkboxes
      this.$checkbox1 = $checkboxes.eq(0)
      this.$checkbox2 = $checkboxes.eq(1)
      this.$checkbox3 = $checkboxes.eq(2)

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.radiosShowHide = [$('#show-hide-radios-1'), $('#show-hide-radios-2')]
      this.checkboxesShowHide = [$('#show-hide-checkboxes-1'), $('#show-hide-checkboxes-2')]

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()
    })

    describe('and when this.showHideContent = new GOVUK.ShowHideContent() is called', function () {
      it('should add the aria attributes to inputs with show/hide content', function () {
        expect(this.$radio1.attr('aria-expanded')).toBe('false')
        expect(this.$radio1.attr('aria-controls')).toBe('show-hide-radios-1 show-hide-radios-2')
      })

      it('should add the aria attributes to show/hide content', function () {
        this.radiosShowHide.forEach(function ($showHide) {
          expect($showHide.attr('aria-hidden')).toBe('true')
        })
      })

      it('should hide the show/hide content visually', function () {
        this.radiosShowHide.forEach(function ($showHide) {
          expect($showHide.hasClass('js-hidden')).toEqual(true)
        })
      })

      describe('with non-default markup', function () {
        beforeEach(function () {
          this.showHideContent.destroy()
        })

        it('should make the show/hide content visible if its radio is checked', function () {
          this.$radio1.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$radio1.attr('aria-expanded')).toBe('true')
          this.radiosShowHide.forEach(function ($showHide) {
            expect($showHide.attr('aria-hidden')).toBe('false')
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })

        it('should make the show/hide content visible if its checkbox is checked', function () {
          this.$checkbox1.prop('checked', true)

          // Defaults changed, initialise again
          this.showHideContent = new GOVUK.ShowHideContent().init()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
          this.checkboxesShowHide.forEach(function ($showHide) {
            expect($showHide.attr('aria-hidden')).toBe('false')
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })
      })

      describe('and a show/hide radio receives a click', function () {
        it('should make the show/hide content visible', function () {
          this.$radio1.click()
          this.radiosShowHide.forEach(function ($showHide) {
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })

        it('should add the aria attributes to show/hide content', function () {
          this.$radio1.click()
          expect(this.$radio1.attr('aria-expanded')).toBe('true')
          this.radiosShowHide.forEach(function ($showHide) {
            expect($showHide.attr('aria-hidden')).toBe('false')
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })
      })

      describe('and a show/hide checkbox receives a click', function () {
        it('should make the show/hide content visible', function () {
          this.$checkbox1.click()
          this.checkboxesShowHide.forEach(function ($showHide) {
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })

        it('should add the aria attributes to show/hide content', function () {
          this.$checkbox1.click()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
          this.checkboxesShowHide.forEach(function ($showHide) {
            expect($showHide.attr('aria-hidden')).toBe('false')
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })
      })

      describe('and a show/hide radio receives a click, but another group radio is clicked afterwards', function () {
        it('should make the show/hide content hidden', function () {
          this.$radio1.click()
          this.$radio2.click()
          this.radiosShowHide.forEach(function ($showHide) {
            expect($showHide.hasClass('js-hidden')).toEqual(true)
          })
        })

        it('should add the aria attributes to show/hide content', function () {
          this.$radio1.click()
          this.$radio2.click()
          expect(this.$radio1.attr('aria-expanded')).toBe('false')
          this.radiosShowHide.forEach(function ($showHide) {
            expect($showHide.attr('aria-hidden')).toBe('true')
          })
        })
      })

      describe('and a show/hide checkbox receives a click, but another checkbox is clicked afterwards', function () {
        it('should keep the show/hide content visible', function () {
          this.$checkbox1.click()
          this.$checkbox2.click()
          this.checkboxesShowHide.forEach(function ($showHide) {
            expect($showHide.hasClass('js-hidden')).toEqual(false)
          })
        })

        it('should keep the aria attributes to show/hide content', function () {
          this.$checkbox1.click()
          this.$checkbox2.click()
          expect(this.$checkbox1.attr('aria-expanded')).toBe('true')
          this.checkboxesShowHide.forEach(function ($showHide) {
            expect($showHide.attr('aria-hidden')).toBe('false')
          })
        })
      })
    })
  })

  describe('when the controls are inside a form and multiple controls point at a single target', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(

        // First group of radio buttons (yes/no)
        '<form>' +
        '<label class="block-label" data-target="show-hide-radios">' +
        '<input type="radio" name="single" value="yes">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +

        // Second group of radio buttons (yes/no)
        '<label class="block-label" data-target="show-hide-radios">' +
        '<input type="radio" name="also-single" value="also-yes">' +
        'Also yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="also-single" value="also-no">' +
        'Also no' +
        '</label>' +

        '<div id="show-hide-radios" class="panel js-hidden" />' +
        '</form>' +

        // Checkboxes (first two options both control the same content)
        '<form>' +
        '<label class="block-label" data-target="show-hide-checkboxes">' +
        '<input type="checkbox" name="multiple[option1]">' +
        'Option 1' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option2]">' +
        'Option 2' +
        '</label>' +
        '<label class="block-label" data-target="show-hide-checkboxes">' +
        '<input type="checkbox" name="multiple[option3]">' +
        'Option 3' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option4]">' +
        'Option 4' +
        '</label>' +
        '<div id="show-hide-checkboxes" class="panel js-hidden" />' +
        '</form>'
      )

      // Find radios/checkboxes
      var $radios = this.$content.find('input[type=radio]')
      var $checkboxes = this.$content.find('input[type=checkbox]')

      // Four radios
      this.$radio1 = $radios.eq(0)
      this.$radio2 = $radios.eq(1)

      this.$radio3 = $radios.eq(2)
      this.$radio4 = $radios.eq(3)

      // Four checkboxes
      this.$checkbox1 = $checkboxes.eq(0)
      this.$checkbox2 = $checkboxes.eq(1)
      this.$checkbox3 = $checkboxes.eq(2)
      this.$checkbox4 = $checkboxes.eq(3)

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.$radioShowHide = $('#show-hide-radios')
      this.$checkboxShowHide = $('#show-hide-checkboxes')

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()

      this.expectCorrectMarkupForControlsAndContent = function(checkedControls, uncheckedControls, $content) {

        checkedControls.forEach(function ($control) {
          expectControlIsChecked($control, $content.attr('id'))
        })

        uncheckedControls.forEach(function ($control) {
          expectControlIsNotChecked($control, $content.attr('id'))
        })

        if(checkedControls.length) {
          expectContentToBeVisible($content)
        } else {
          expectContentToBeHidden($content)
        }
      }
    })

    describe('and when this.showHideContent = new GOVUK.ShowHideContent() is called', function () {
      it('should add the aria attributes to inputs with show/hide content', function () {

        [this.$radio1, this.$radio3].forEach(function ($radio) {
            expect($radio.attr('aria-expanded')).toBe('false')
            expect($radio.attr('aria-controls')).toBe('show-hide-radios')
        })
      })

      it('should add the aria attributes to show/hide content', function () {
        expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
      })

      it('should hide the show/hide content visually', function () {
        expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
      })

      describe('and one radio from each group is clicked', function () {

        it('should make the show/hide content visible if the first radio is showing the content', function () {
          this.$radio1.click() // yes
          this.$radio4.click() // also-no

          this.expectCorrectMarkupForControlsAndContent(
            [this.$radio1],
            [this.$radio3],
            this.$radioShowHide
          )
        })

        it('should make the show/hide content visible if the third radio is showing the content', function () {
          this.$radio2.click() // no
          this.$radio3.click() // also-yes

          this.expectCorrectMarkupForControlsAndContent(
            [this.$radio3],
            [this.$radio1],
            this.$radioShowHide
          )
        })

        it('should make the show/hide content visible if the first and third radios are showing the content', function () {
          this.$radio1.click() // yes
          this.$radio3.click() // also-yes

          this.expectCorrectMarkupForControlsAndContent(
            [this.$radio1, this.$radio3],
            [],
            this.$radioShowHide
          )
        })

        it('should make the show/hide content hidden if neither the first or third radios are showing the content', function () {
          this.$radio2.click() // no
          this.$radio4.click() // also-no

          this.expectCorrectMarkupForControlsAndContent(
            [],
            [this.$radio1, this.$radio3],
            this.$radioShowHide
          )
        })
      })

      describe('and more than one checkbox is clicked is clicked', function () {

        it('should make the show/hide content visible if the first checkbox is selected', function () {
          this.$checkbox1.click()
          this.$checkbox2.click()

          this.expectCorrectMarkupForControlsAndContent(
            [this.$checkbox1],
            [this.$checkbox3],
            this.$checkboxShowHide
          )
        })

        it('should make the show/hide content visible if the third checkbox is selected', function () {
          this.$checkbox2.click()
          this.$checkbox3.click()

          this.expectCorrectMarkupForControlsAndContent(
            [this.$checkbox3],
            [this.$checkbox1],
            this.$checkboxShowHide
          )
        })

        it('should make the show/hide content visible if the first and third checkboxes are selected', function () {
          this.$checkbox1.click()
          this.$checkbox3.click()

          this.expectCorrectMarkupForControlsAndContent(
            [this.$checkbox1, this.$checkbox3],
            [],
            this.$checkboxShowHide
          )
        })

        it('should make the show/hide content hidden if neither the first or third radios are showing the content', function () {
          this.$checkbox2.click()
          this.$checkbox4.click()

          this.expectCorrectMarkupForControlsAndContent(
            [],
            [this.$checkbox1, this.$checkbox3],
            this.$checkboxShowHide
          )
        })
      })
    })
  })

  describe('when the controls are inside a form and multiple controls point at multiple targets', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(

        // First group of radio buttons (yes/no)
        '<form>' +
        '<label class="block-label" data-target="show-hide-radios-1 show-hide-radios-2">' +
        '<input type="radio" name="single" value="yes">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +

        // Second group of radio buttons (yes/no)
        '<label class="block-label" data-target="show-hide-radios-1 show-hide-radios-3">' +
        '<input type="radio" name="also-single" value="also-yes">' +
        'Also yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="also-single" value="also-no">' +
        'Also no' +
        '</label>' +

        '<div id="show-hide-radios-1" class="panel js-hidden" />' +
        '<div id="show-hide-radios-2" class="panel js-hidden" />' +
        '<div id="show-hide-radios-3" class="panel js-hidden" />' +
        '</form>' +

        // Checkboxes (first two options both control the same content)
        '<form>' +
        '<label class="block-label" data-target="show-hide-checkboxes-1 show-hide-checkboxes-2">' +
        '<input type="checkbox" name="multiple[option1]">' +
        'Option 1' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option2]">' +
        'Option 2' +
        '</label>' +
        '<label class="block-label" data-target="show-hide-checkboxes-1 show-hide-checkboxes-3">' +
        '<input type="checkbox" name="multiple[option3]">' +
        'Option 3' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="checkbox" name="multiple[option4]">' +
        'Option 4' +
        '</label>' +
        '<label class="block-label" data-target="show-hide-checkboxes-2 show-hide-checkboxes-3">' +
        '<input type="checkbox" name="multiple[option5]">' +
        'Option 5' +
        '</label>' +
        '<div id="show-hide-checkboxes-1" class="panel js-hidden" />' +
        '<div id="show-hide-checkboxes-2" class="panel js-hidden" />' +
        '<div id="show-hide-checkboxes-3" class="panel js-hidden" />' +
        '</form>'
      )

      // Find radios/checkboxes
      var $radios = this.$content.find('input[type=radio]')
      var $checkboxes = this.$content.find('input[type=checkbox]')

      // Four radios
      this.$radio1 = $radios.eq(0)
      this.$radio2 = $radios.eq(1)

      this.$radio3 = $radios.eq(2)
      this.$radio4 = $radios.eq(3)

      // Five checkboxes
      this.$checkbox1 = $checkboxes.eq(0)
      this.$checkbox2 = $checkboxes.eq(1)
      this.$checkbox3 = $checkboxes.eq(2)
      this.$checkbox4 = $checkboxes.eq(3)
      this.$checkbox5 = $checkboxes.eq(4)

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.$radioShowHide1 = $('#show-hide-radios-1')
      this.$radioShowHide2 = $('#show-hide-radios-2')
      this.$radioShowHide3 = $('#show-hide-radios-3')

      this.$checkboxShowHide1 = $('#show-hide-checkboxes-1')
      this.$checkboxShowHide2 = $('#show-hide-checkboxes-2')
      this.$checkboxShowHide3 = $('#show-hide-checkboxes-3')

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()
    })

    it('should show two targets if one controlling radio is clicked', function () {
      this.$radio1.click() // yes
      this.$radio4.click() // also no

      expectControlIsChecked(this.$radio1, 'show-hide-radios-1 show-hide-radios-2')
      expectControlIsNotChecked(this.$radio3, 'show-hide-radios-1 show-hide-radios-3')

      expectContentToBeVisible(this.$radioShowHide1)
      expectContentToBeVisible(this.$radioShowHide2)

      expectContentToBeHidden(this.$radioShowHide3)
    })

    it('should show three targets if both controlling radios are clicked', function () {
      this.$radio1.click() // yes
      this.$radio3.click() // also yes

      expectControlIsChecked(this.$radio1, 'show-hide-radios-1 show-hide-radios-2')
      expectControlIsChecked(this.$radio3, 'show-hide-radios-1 show-hide-radios-3')

      expectContentToBeVisible(this.$radioShowHide1)
      expectContentToBeVisible(this.$radioShowHide2)
      expectContentToBeVisible(this.$radioShowHide3)
    })

    it('should show two targets if one controlling checkbox is clicked', function () {
      this.$checkbox1.click()

      expectControlIsChecked(this.$checkbox1, 'show-hide-checkboxes-1 show-hide-checkboxes-2')
      expectControlIsNotChecked(this.$checkbox3, 'show-hide-checkboxes-1 show-hide-checkboxes-3')
      expectControlIsNotChecked(this.$checkbox5, 'show-hide-checkboxes-2 show-hide-checkboxes-3')

      expectContentToBeVisible(this.$checkboxShowHide1)
      expectContentToBeVisible(this.$checkboxShowHide2)

      expectContentToBeHidden(this.$checkboxShowHide3)
    })

    it('should show three targets if two controlling checkboxes are clicked', function () {
      this.$checkbox1.click()
      this.$checkbox3.click()

      expectControlIsChecked(this.$checkbox1, 'show-hide-checkboxes-1 show-hide-checkboxes-2')
      expectControlIsChecked(this.$checkbox3, 'show-hide-checkboxes-1 show-hide-checkboxes-3')
      expectControlIsNotChecked(this.$checkbox5, 'show-hide-checkboxes-2 show-hide-checkboxes-3')

      expectContentToBeVisible(this.$checkboxShowHide1)
      expectContentToBeVisible(this.$checkboxShowHide2)
      expectContentToBeVisible(this.$checkboxShowHide3)
    })

    it('should show three targets if three controlling checkboxes are clicked', function () {
      this.$checkbox1.click()
      this.$checkbox3.click()
      this.$checkbox5.click()

      expectControlIsChecked(this.$checkbox1, 'show-hide-checkboxes-1 show-hide-checkboxes-2')
      expectControlIsChecked(this.$checkbox3, 'show-hide-checkboxes-1 show-hide-checkboxes-3')
      expectControlIsChecked(this.$checkbox5, 'show-hide-checkboxes-2 show-hide-checkboxes-3')

      expectContentToBeVisible(this.$checkboxShowHide1)
      expectContentToBeVisible(this.$checkboxShowHide2)
      expectContentToBeVisible(this.$checkboxShowHide3)
    })

    it('should still show three targets if three checkboxes radio are clicked and then one is unclicked', function () {
      this.$checkbox1.click()
      this.$checkbox3.click()
      this.$checkbox5.click()
      this.$checkbox5.click() // un-click checkbox 5

      expectControlIsChecked(this.$checkbox1, 'show-hide-checkboxes-1 show-hide-checkboxes-2')
      expectControlIsChecked(this.$checkbox3, 'show-hide-checkboxes-1 show-hide-checkboxes-3')

      expect(this.$checkbox5.attr('aria-controls')).toBe('show-hide-checkboxes-2 show-hide-checkboxes-3')
      expect(this.$checkbox5.is(':checked')).toBe(false)
      // aria-expanded isn't reset because the inputs in question are still visible
      expect(this.$checkbox5.attr('aria-expanded')).toBe('true')

      // all of the content should still be visible
      expectContentToBeVisible(this.$checkboxShowHide1)
      expectContentToBeVisible(this.$checkboxShowHide2)
      expectContentToBeVisible(this.$checkboxShowHide3)
    })

  })

  describe('when the controls are outside of a form', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(
        // Radio buttons (yes/no)
        '<label class="block-label" data-target="show-hide-radios">' +
        '<input type="radio" name="single" value="yes">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +
        '<div id="show-hide-radios" class="panel js-hidden" />'
      )

      // Find radios/checkboxes
      var $radios = this.$content.find('input[type=radio]')

      // Two radios
      this.$radio1 = $radios.eq(0)
      this.$radio2 = $radios.eq(1)

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.$radioShowHide = $('#show-hide-radios')

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()
    })

    it('should make the show/hide content visible if its radio is checked', function () {
      this.$radio1.click()

      // Defaults changed, initialise again
      this.showHideContent = new GOVUK.ShowHideContent().init()
      expect(this.$radio1.attr('aria-expanded')).toBe('true')
      expect(this.$radioShowHide.attr('aria-hidden')).toBe('false')
      expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(false)
    })

    it('should do nothing if a radio without show/hide content is checked', function () {
      this.$radio2.click()

      // Defaults changed, initialise again
      this.showHideContent = new GOVUK.ShowHideContent().init()
      expect(this.$radio1.attr('aria-expanded')).toBe('false')
      expect(this.$radioShowHide.attr('aria-hidden')).toBe('true')
      expect(this.$radioShowHide.hasClass('js-hidden')).toEqual(true)
    })
  })

  describe('when the controls are outside of a form and have multiple targets', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(
        // Radio buttons (yes/no)
        '<label class="block-label" data-target="show-hide-radios-1 show-hide-radios-2">' +
        '<input type="radio" name="single" value="yes">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +
        '<div id="show-hide-radios-1" class="panel js-hidden" />' +
        '<div id="show-hide-radios-2" class="panel js-hidden" />'
      )

      // Find radios/checkboxes
      var $radios = this.$content.find('input[type=radio]')

      // Two radios
      this.$radio1 = $radios.eq(0)
      this.$radio2 = $radios.eq(1)

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.radiosShowHide = [$('#show-hide-radios-1'), $('#show-hide-radios-2')]

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()
    })

    it('should make the show/hide content visible if its radio is checked', function () {
      this.$radio1.click()

      // Defaults changed, initialise again
      this.showHideContent = new GOVUK.ShowHideContent().init()
      expect(this.$radio1.attr('aria-expanded')).toBe('true')
      this.radiosShowHide.forEach(function ($showHide) {
        expect($showHide.attr('aria-hidden')).toBe('false')
        expect($showHide.hasClass('js-hidden')).toEqual(false)
      })
    })

    it('should do nothing if a radio without show/hide content is checked', function () {
      this.$radio2.click()

      // Defaults changed, initialise again
      this.showHideContent = new GOVUK.ShowHideContent().init()
      expect(this.$radio1.attr('aria-expanded')).toBe('false')
      this.radiosShowHide.forEach(function ($showHide) {
        expect($showHide.attr('aria-hidden')).toBe('true')
        expect($showHide.hasClass('js-hidden')).toEqual(true)
      })
    })
  })

  describe('when the targets are controlling other targets', function () {
    beforeEach(function () {
      // Sample markup
      this.$content = $(
        // Radio buttons (yes/no)
        '<label class="block-label" data-target="show-hide-radios-1">' +
        '<input type="radio" name="single" value="yes" checked="checked">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="single" value="no">' +
        'No' +
        '</label>' +
        '<div id="show-hide-radios-1" class="panel">' +
        '<label class="block-label" data-target="show-hide-radios-2">' +
        '<input type="radio" name="double" value="yes" checked="checked">' +
        'Yes' +
        '</label>' +
        '<label class="block-label">' +
        '<input type="radio" name="double" value="no">' +
        'No' +
        '</label>' +
        '</div>' +
        '<div id="show-hide-radios-2" class="panel" />'
      )

      // Find radios/checkboxes
      this.radios = this.$content.find('input[type=radio]')

      // Add to page
      $(document.body).append(this.$content)

      // Show/Hide content
      this.radiosShowHide = [$('#show-hide-radios-1'), $('#show-hide-radios-2')]

      // Add show/hide content support
      this.showHideContent = new GOVUK.ShowHideContent()
      this.showHideContent.init()
    })

    it('should hide content controlled by the hidden inputs', function () {
      this.radiosShowHide.forEach(function ($showHide) {
        expect($showHide.attr('aria-hidden')).toBe('false')
        expect($showHide.hasClass('js-hidden')).toEqual(false)
      })

      this.radios.eq(1).click()

      this.radiosShowHide.forEach(function ($showHide) {
        expect($showHide.attr('aria-hidden')).toBe('true')
        expect($showHide.hasClass('js-hidden')).toEqual(true)
      })
    })

    it('should show content controlled by the revealed inputs', function () {
      this.radios.eq(1).click()

      this.radiosShowHide.forEach(function ($showHide) {
        expect($showHide.attr('aria-hidden')).toBe('true')
        expect($showHide.hasClass('js-hidden')).toEqual(true)
      })

      this.radios.eq(0).click()

      this.radiosShowHide.forEach(function ($showHide) {
        expect($showHide.attr('aria-hidden')).toBe('false')
        expect($showHide.hasClass('js-hidden')).toEqual(false)
      })
    })
  })
})
