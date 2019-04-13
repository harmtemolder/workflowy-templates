const moment = require("moment");
const defaultNames = require("./default-names.json")

// Set default input values, if no context is available
let context = {
  "period": "full-year",
  "year": moment().year().toString(),
  "from-date": moment().year().toString() + "-01-01",
  "to-date": moment().year().toString() + "-12-31",
  "order": "descending",
  "month-case": "upper",
  "month-language": "english",
  "month-number": "true",
  "week-start": "monday",
  "day-language": "english",
  "day-case": "proper",
  "day-number": "true"
}

// Convert default month names to selected case
defaultMonthNames = defaultNames["months"][context["month-language"]];
Object.keys(defaultMonthNames).map(function (key, index) {
  switch (context["month-case"]) {
    case "upper":
      defaultMonthNames[key] = defaultMonthNames[key].toUpperCase();
      break;
    case "lower":
      defaultMonthNames[key] = defaultMonthNames[key].toLowerCase();
      break;
    case "proper":
      defaultMonthNames[key] = defaultMonthNames[key].charAt(0).toUpperCase() + defaultMonthNames[key].toLowerCase().slice(1);
  }
});

// Convert default day names to selected case
defaultDayNames = defaultNames["days"][context["day-language"]];
Object.keys(defaultDayNames).map(function (key, index) {
  switch (context["day-case"]) {
    case "upper":
      defaultDayNames[key] = defaultDayNames[key].toUpperCase();
      break;
    case "lower":
      defaultDayNames[key] = defaultDayNames[key].toLowerCase();
      break;
    case "proper":
      defaultDayNames[key] = defaultDayNames[key].charAt(0).toUpperCase() + defaultDayNames[key].toLowerCase().slice(1);
  }
});

// Add default month and day names to context and export
context = Object.assign(context, defaultMonthNames, defaultDayNames);
module.exports.context = context;
