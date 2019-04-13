// form-functions.js

$(document).ready(function () {
  // When an input field has changed, submit the form
  $("input, select").change(function () {
    $(this).closest("form").submit();
  });

  // When the form is submitted, remove all "disabled" attributes to still get
  // all input fields' values in the context
  $("form").submit(function () {
    $("*:disabled").removeAttr("disabled");
  });
});
