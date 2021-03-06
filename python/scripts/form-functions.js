// form-functions.js

jQuery.fn.selectText = function selectText() {
  // This function selects an element's text using either createTextRange or
  // createRange, depending on browser support

  if (document.body.createTextRange) {
    const range = document.body.createTextRange();

    range.moveToElementText(this[0]);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(this[0]);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

$(document).ready(function documentReadyFunction() {
  // When one of the dropdowns changes, submit the form, but don't generate a full
  // list yet
  $('select').change(function submitOnChange() {
    $('input[name=generate]').val('false');
    $(this).closest('form').submit();
  });

  // When one of the "level-for" checkboxes changes update the form accordingly
  $('input[name^="level_for_"]').change(function updateOnLevelChange() {
    const changed = $(this).attr('name');
    let weeks = $('input[name="level_for_weeks"]').prop('checked');
    let months = $('input[name="level_for_months"]').prop('checked');

    if (!weeks && !months) {
      // Make sure at least one of the two levels is selected at all times
      if (changed === 'level_for_weeks') {
        $('input[name="level_for_months"]').prop('checked', true);
        months = true;
      } else {
        $('input[name="level_for_weeks"]').prop('checked', true);
        weeks = true;
      }
    }

    if (!weeks) {
      $('.checkbox:has(input[name="level_for_weeks"])').addClass('off');
    } else {
      $('.checkbox:has(input[name="level_for_weeks"])').removeClass('off');
    }

    if (!months) {
      $('.checkbox:has(input[name="level_for_months"])').addClass('off');
    } else {
      $('.checkbox:has(input[name="level_for_months"])').removeClass('off');
    }

    $('input[name=generate]').val('false');
    $(this).closest('form').submit();
  });

  // When one of the "_abbreviated" checkboxes changes update the form accordingly
  $('input[name$="_abbreviated"]').change(function updateOnAbbreviatedChange() {
    $('input[name=generate]').val('false');
    $(this).closest('form').submit();
  });

  // When the form is submitted, get some things sorted first
  $('#calendar_generator_form').submit(function onSubmitActions() {
    (function trackFormSubmitEvent() {
      if ($('input[name=generate]').val() === 'false') {
        pushDataLayerEvent(
          'gtm.trackEvent',
          'calendar generator form interactions',
          'submitted without generating a new list',
          false,
          false,
          {
            context: $('#calendar_generator_form').serialize(),
          },
        );
      } else {
        pushDataLayerEvent(
          'gtm.trackEvent',
          'calendar generator form interactions',
          'submitted with generating a new list',
          false,
          false,
          {
            context: $('#calendar_generator_form').serialize(),
          },
        );
      }
    }());

    // Remove all "disabled" attributes to still get all input fields' values in the context object
    $('*:disabled').removeAttr('disabled');
  });

  // When a selector link is clicked, select the text referenced in the link's
  // data-selector attribute using the selectText function
  $('.select_link').on('click', function clickToSelect(e) {
    e.preventDefault();

    const selector = $(this).data('selector');
    $(selector).selectText();

    // Add a hint how to copy the selected text, if it doesn't exist yet
    if ($('#copy_hint').length === 0) {
      const isMac = (navigator.platform.indexOf('Mac') > -1);
      $(this).after(`<span id='copy_hint'>&nbsp;(press ${isMac ? 'cmd ⌘' : 'Ctrl'} + C to copy)</span>`);
    }

    pushDataLayerEvent(
      'gtm.trackEvent',
      'calendar generator form interactions',
      'clicked select link',
      false,
      false,
      {
        context: $('#calendar_generator_form').serialize(),
      },
    );
  });

  // Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip();
});
