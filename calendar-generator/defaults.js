const moment = require("moment");
const defaultNames = require("./default-names.json");
const convertCase = require("./process-context.js").convertCase;

// Set default input values, if no context is available
let context = {
  "period": "full-year",
  "year": moment().year().toString(),
  "from-date": moment().year().toString() + "-01-01",
  "to-date": moment().year().toString() + "-12-31",
  "order": "descending",
  "month-case": "upper",
  "month-language": "english",
  "month-number": "prefix",
  "week-start": "monday",
  "day-language": "english",
  "day-case": "proper",
  "day-number": "prefix"
}

// Convert default month names to selected case
defaultMonthNames = defaultNames["months"][context["month-language"]];
Object.keys(defaultMonthNames).map(function (key, index) {
  defaultMonthNames[key] = convertCase(defaultMonthNames[key], context["month-case"]);
});

// Convert default day names to selected case
defaultDayNames = defaultNames["days"][context["day-language"]];
Object.keys(defaultDayNames).map(function (key, index) {
  defaultDayNames[key] = convertCase(defaultDayNames[key], context["day-case"]);
});

// Add default month and day names to context and export
context = Object.assign(context, defaultMonthNames, defaultDayNames);
module.exports.context = context;
