const defaultNames = require("./default-names.json")

function convertCase(inputString, inputCase) {
  // This function takes the context object and converts the month and day names
  // to the requested case (see month-case and day-case), unless language is set
  // to custom
  switch (inputCase) {
    case "upper":
      outputString = inputString.toUpperCase();
      break;
    case "lower":
      outputString = inputString.toLowerCase();
      break;
    case "proper":
      outputString = inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
  }
  return outputString;
}

function processDayAndMonthNames(context) {
  // This function first overwrites all day-name-* and month-name-* variables in
  // the context with the defaults for the selected languages, in the requested
  // case. It then loops through all of them and adds them to a separate object
  // within context that's used by year-generator.js

  // Get the default day names for the selected language and write these to context
  if (context["day-language"] !== "custom") {
    let defaultDayNames = defaultNames["days"][context["day-language"]];
    Object.keys(defaultDayNames).map(function (key, index) {
      defaultDayNames[key] = convertCase(defaultDayNames[key], context["day-case"]);
    });
    context = Object.assign(context, defaultDayNames);
  }

  // Get the default month names as well
  if (context["month-language"] !== "custom") {
    let defaultMonthNames = defaultNames["months"][context["month-language"]];
    Object.keys(defaultMonthNames).map(function (key, index) {
      defaultMonthNames[key] = convertCase(defaultMonthNames[key], context["month-case"]);
    });
    context = Object.assign(context, defaultMonthNames);
  }

  const weekdayPattern = /^day\-name\-(\d)$/;
  const monthPattern = /^month\-name\-(\d{1,2})$/;

  let dayNames = {};
  let monthNames = {};

  // Loop through the context and get all month-name-* and day-name-* variables
  for (let varName in context) {
    let dayNumberMatch = weekdayPattern.exec(varName);
    let monthNumberMatch = monthPattern.exec(varName);

    if (dayNumberMatch !== null) {
      // If the selected variable is a day-name-* variable add it to dayNames
      dayNames[dayNumberMatch[1]] = context[varName];
    } else if (monthNumberMatch !== null) {
      // If the selected variable is a month-name-* variable add it to monthNames
      monthNames[monthNumberMatch[1]] = context[varName];
    }
  }

  return Object.assign(
    context, {
      "day-names": dayNames,
      "month-names": monthNames
    });
}

function setDates(context){
  // This function checks to see if period equals year and if so, sets the from-date
  // and to-date to January 1st and December 31st of the selected year respectively

  if (context["period"] === "full-year") {
    context["from-date"] = context["year"] + "-01-01";
    context["to-date"] = context["year"] + "-12-31";
  }

  return context;
}

function process(context) {
  // Set the to and from dates to the selected year, if period = year
  context = setDates(context);

  // And finally add (properly cased) day and month names as objects
  context = processDayAndMonthNames(context);

  return context;
}

module.exports.process = process;
module.exports.convertCase = convertCase;
