const defaultNames = require('./default-names.json');

function convertCase(inputString, inputCase) {
  // This function takes the context object and converts the month and day names
  // to the requested case (see month-case and day-case), unless language is set
  // to custom

  switch (inputCase) {
    case 'upper':
      return inputString.toUpperCase();
    case 'lower':
      return inputString.toLowerCase();
    case 'proper':
      return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
    default:
      return inputString;
  }
}

function processDayAndMonthNames(context) {
  // This function first overwrites all day-name-* and month-name-* variables in
  // the context with the defaults for the selected languages, in the requested
  // case. It then loops through all of them and adds them to a separate object
  // within context that's used by year-generator.js

  let outputContext = context;

  // Get the default day names for the selected language and write these to context
  if (context['day-language'] !== 'custom') {
    const defaultDayNames = defaultNames.days[context['day-language']];
    Object.keys(defaultDayNames).map(function (key) {
      defaultDayNames[key] = convertCase(defaultDayNames[key], context['day-case']);
    });
    outputContext = Object.assign(outputContext, defaultDayNames);
  }

  // Get the default month names as well
  if (outputContext['month-language'] !== 'custom') {
    const defaultMonthNames = defaultNames.months[outputContext['month-language']];
    Object.keys(defaultMonthNames).map(function (key) {
      defaultMonthNames[key] = convertCase(defaultMonthNames[key], context['month-case']);
    });
    outputContext = Object.assign(outputContext, defaultMonthNames);
  }

  const weekdayPattern = /^day-name-(\d)$/;
  const monthPattern = /^month-name-(\d{1,2})$/;

  const dayNames = {};
  const monthNames = {};

  // Loop through the context and get all month-name-* and day-name-* variables
  for (const varName in outputContext) {
    if (Object.prototype.hasOwnProperty.call(outputContext, varName)) {

      const dayNumberMatch = weekdayPattern.exec(varName);
      const monthNumberMatch = monthPattern.exec(varName);

      if (dayNumberMatch !== null) {
        // If the selected variable is a day-name-* variable add it to dayNames
        dayNames[dayNumberMatch[1]] = outputContext[varName];
      } else if (monthNumberMatch !== null) {
        // If the selected variable is a month-name-* variable add it to monthNames
        monthNames[monthNumberMatch[1]] = outputContext[varName];
      }
    }
  }

  return Object.assign(
    outputContext, {
      'day-names': dayNames,
      'month-names': monthNames,
    },
  );
}

function setDatesIfNeeded(context) {
  // This function checks to see if period equals year and if so, sets the from-date
  // and to-date to January 1st and December 31st of the selected year respectively

  if (context.period === 'full-year') {
    return Object.assign(
      context, {
        'from-date': `${context.year}-01-01`,
        'to-date': `${context.year}-12-31`,
      },
    );
  }

  return context;
}

function process(context) {
  // Set the to and from dates to the selected year, if period = year
  let outputContext = setDatesIfNeeded(context);

  // And finally add (properly cased) day and month names as objects
  outputContext = processDayAndMonthNames(outputContext);

  return outputContext;
}

module.exports.process = process;
module.exports.convertCase = convertCase;
