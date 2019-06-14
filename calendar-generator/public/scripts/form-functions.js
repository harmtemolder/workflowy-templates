// form-functions.js

jQuery.fn.selectText = function () {
  // This function selects an element's text using either createTextRange or
  // createRange, depending on browser support

  if (document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(this[0]);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(this[0]);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

$(document).ready(function () {
  // When an input field has changed, submit the form
//   $("input, select").change(function () {
//     $(this).closest("form").submit();
//   });

  // When the form is submitted, remove all "disabled" attributes to still get
  // all input fields' values in the context
  $("form").submit(function () {
    $("*:disabled").removeAttr("disabled");
  });

  // When a selector link is clicked, select the text referenced in the link's
  // data-selector attribute using the selectText function
  $('.select-link').on('click', function (e) {
    var selector = $(this).data('selector');
    $(selector).selectText();

    // Add a hint how to copy the selected text, if it doesn't exist yet
    if ($("#copy-hint").length === 0) {
      var isMac = (navigator.platform.indexOf("Mac") !== -1);
      $(this).after("<span id='copy-hint'> (press " + (isMac ? "cmd ⌘" : "Ctrl") + " + C to copy)</span>");
    }

    e.preventDefault();
  });
});
