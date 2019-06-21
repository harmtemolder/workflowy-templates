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
  $('input[name^="level-for-"]').change(function updateOnLevelChange() {
    const changed = $(this).attr('name');
    let weeks = $('input[name="level-for-weeks"]').prop('checked');
    let months = $('input[name="level-for-months"]').prop('checked');

    if (!weeks && !months) {
      // Make sure at least one of the two levels is selected at all times
      if (changed === 'level-for-weeks') {
        $('input[name="level-for-months"]').prop('checked', true);
        months = true;
      } else {
        $('input[name="level-for-weeks"]').prop('checked', true);
        weeks = true;
      }
    }

    if (!weeks) {
      $('.checkbox:has(input[name="level-for-weeks"])').addClass('off');
    } else {
      $('.checkbox:has(input[name="level-for-weeks"])').removeClass('off');
    }

    if (!months) {
      $('.checkbox:has(input[name="level-for-months"])').addClass('off');
    } else {
      $('.checkbox:has(input[name="level-for-months"])').removeClass('off');
    }

    $('input[name=generate]').val('false');
    $(this).closest('form').submit();
  });

  // When the form is submitted, remove all "disabled" attributes to still get
  // all input fields' values in the context object
  $('form').submit(function enableFields() {
    $('*:disabled').removeAttr('disabled');
  });

  // When a selector link is clicked, select the text referenced in the link's
  // data-selector attribute using the selectText function
  $('.select-link').on('click', function clickToSelect(e) {
    const selector = $(this).data('selector');
    $(selector).selectText();

    // Add a hint how to copy the selected text, if it doesn't exist yet
    if ($('#copy-hint').length === 0) {
      const isMac = (navigator.platform.indexOf('Mac') > -1);
      $(this).after(`<span id='copy-hint'> (press ${isMac ? 'cmd ⌘' : 'Ctrl'} + C to copy)</span>`);
    }

    e.preventDefault();
  });
});
