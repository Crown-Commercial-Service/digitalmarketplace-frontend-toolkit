;(function (global) {
  'use strict'

  var $ = global.jQuery
  var GOVUK = global.GOVUK || {}

  function ShowHideContent () {
    var self = this

    // Radio and Checkbox selectors
    var selectors = {
      namespace: 'ShowHideContent',
      radio: '[data-target] > input[type="radio"]',
      checkbox: '[data-target] > input[type="checkbox"]'
    }

    // Escape name attribute for use in DOM selector
    function escapeElementName (str) {
      var result = str.replace('[', '\\[').replace(']', '\\]')
      return result
    }

    // Adds ARIA attributes to control + associated content
    function initToggledContent () {
      var $control = $(this)
      var $content = getToggledContent($control)
      var contentIds = ''

      // Set aria-controls and defaults
      if ($content.length) {
        $content.each(function () {
          $(this).attr('aria-hidden', 'true')
          contentIds += ' ' + $(this).attr('id')
        })

        $control.attr('aria-controls', $.trim(contentIds))
        $control.attr('aria-expanded', 'false')
      }
    }

    // Return toggled content for control
    function getToggledContent ($control) {
      var targetIds = $control.attr('aria-controls')

      // ARIA attributes aren't set before init
      if (!targetIds) {
        targetIds = $control.closest('[data-target]').data('target')
      }

      // turn a space-separated list of ids into a comma-separated css id selector
      // ie, 'id-1 id-2 id-3' becomes '#id-1, #id-2, #id-3'
      if (targetIds) {
        targetIds = targetIds.split(' ')
        targetIds = $.map(targetIds, function (targetId) {
          return '#' + targetId
        });
        targetIds = targetIds.join(', ')
      }

      // Find show/hide content by id
      return $(targetIds)
    }

    // Show toggled content for control
    function showToggledContent ($control, $content) {
      $content = $content || getToggledContent($control)

      if (!$content.length) {
        return
      }

      // Show content
      $content.each(function () {
        var $contentElement = $(this)

        // always remove the class
        $contentElement.removeClass('js-hidden')
        $contentElement.attr('aria-hidden', 'false')

        // If the controlling input, update aria-expanded
        if ($control.attr('aria-controls')) {
          $control.attr('aria-expanded', 'true')
        }

        // Trigger show toggled content on revealed inputs
        $contentElement.find('input:checked').each(function () {
          showToggledContent($(this))
        })
      })
    }

    function isAnotherControlStillShowingThisContent(id, $control) {
        return $('[data-target~="' + id + '"] input:checked').not($control).length > 0
    }

    // Hide toggled content for control
    function hideToggledContent ($control, $content) {
      $content = $content || getToggledContent($control)

      if (!$content.length) {
        return
      }

      // Hide content
      $content.each(function () {
        var $contentElement = $(this)

        if (
            !$contentElement.hasClass('js-hidden')
            && !isAnotherControlStillShowingThisContent($contentElement.attr('id'), $control)
          )
        {
          $contentElement.addClass('js-hidden')
          $contentElement.attr('aria-hidden', 'true')

          // If the controlling input, update aria-expanded
          // Caveat: only update this if at least one controlled is hidden
          if ($control.attr('aria-controls')) {
            $control.attr('aria-expanded', 'false')
          }

          // Trigger hide toggled content on hidden inputs
          $contentElement.find('input').each(function () {
            hideToggledContent($(this))
          })
        }
      })
    }

    // Handle radio show/hide
    function handleRadioContent ($control, $content) {
      // All radios in this group which control content
      var selector = selectors.radio + '[name=' + escapeElementName($control.attr('name')) + '][aria-controls]'
      var $form = $control.closest('form')
      var $radios = $form.length ? $form.find(selector) : $(selector)

      // Hide content for radios in group
      $radios.each(function () {
        hideToggledContent($(this))
      })

      // Select content for this control
      if ($control.is('[aria-controls]')) {
        showToggledContent($control, $content)
      }
    }

    // Handle checkbox show/hide
    function handleCheckboxContent ($control, $content) {
      // Show checkbox content
      if ($control.is(':checked')) {
        showToggledContent($control, $content)
      } else { // Hide checkbox content
        hideToggledContent($control, $content)
      }
    }

    // Set up event handlers etc
    function init ($container, elementSelector, eventSelectors, handler) {
      $container = $container || $(document.body)

      // Handle control clicks
      function deferred () {
        var $control = $(this)
        handler($control, getToggledContent($control))
      }

      // Prepare ARIA attributes
      var $controls = $(elementSelector)
      $controls.each(initToggledContent)

      // Handle events
      $.each(eventSelectors, function (idx, eventSelector) {
        $container.on('change.' + selectors.namespace, eventSelector, deferred)
      })

      // Any already :checked on init?
      if ($controls.is(':checked')) {
        $controls.filter(':checked').each(deferred)
      }
    }

    // Get event selectors for all radio groups
    function getEventSelectorsForRadioGroups () {
      var radioGroups = []

      // Build an array of radio group selectors
      return $(selectors.radio).map(function () {
        var groupName = $(this).attr('name')

        if ($.inArray(groupName, radioGroups) === -1) {
          radioGroups.push(groupName)
          return 'input[type="radio"][name="' + $(this).attr('name') + '"]'
        }
        return null
      })
    }

    // Set up radio show/hide content for container
    self.showHideRadioToggledContent = function ($container) {
      init($container, selectors.radio, getEventSelectorsForRadioGroups(), handleRadioContent)
    }

    // Set up checkbox show/hide content for container
    self.showHideCheckboxToggledContent = function ($container) {
      init($container, selectors.checkbox, [selectors.checkbox], handleCheckboxContent)
    }

    // Remove event handlers
    self.destroy = function ($container) {
      $container = $container || $(document.body)
      $container.off('.' + selectors.namespace)
    }
  }

  ShowHideContent.prototype.init = function ($container) {
    this.showHideRadioToggledContent($container)
    this.showHideCheckboxToggledContent($container)
  }

  GOVUK.ShowHideContent = ShowHideContent
  global.GOVUK = GOVUK
})(window);
