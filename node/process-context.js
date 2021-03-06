const moment = require('moment');

const defaultContext = require('./defaults.js');
const defaultNames = require('./default-names.json');

function fillGaps(context) {
  const filledContext = context;

  // Because checkboxes don't return anything if they're unchecked, re-add them
  filledContext['level-for-months'] = filledContext['level-for-months'] || 'false';
  filledContext['level-for-weeks'] = filledContext['level-for-weeks'] || 'false';
  filledContext['week-date-abbreviated'] = filledContext['week-date-abbreviated'] || 'false';
  filledContext['day-abbreviated'] = filledContext['day-abbreviated'] || 'false';

  // Then fill any gaps based on the defaults
  return Object.assign(defaultContext.context, filledContext);
}

function convertCase(inputString, inputCase) {
  // This function takes an inputString and converts its case to whatever is
  // requested in inputCase. Examples:
  // 'upper'  => UPPER
  // 'lower'  => lower
  // 'proper' => Proper
  // If inputCase isn't one of these, options, the inputString is returned

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

  const outputContext = context;

  // Get the default day names for the selected language and write these to context
  if (context['day-language'] !== 'custom') {
    const defaultDayNames = defaultNames.days[context['day-language']];
    Object.keys(defaultDayNames).forEach(function convertDayNameCase(key) {
      defaultDayNames[key] = convertCase(defaultDayNames[key], context['day-case']);
    });
    Object.assign(outputContext, defaultDayNames);
  }

  // Get the default month names as well
  if (outputContext['month-language'] !== 'custom') {
    const defaultMonthNames = defaultNames.months[outputContext['month-language']];
    Object.keys(defaultMonthNames).forEach(function convertMonthNameCase(key) {
      defaultMonthNames[key] = convertCase(defaultMonthNames[key], context['month-case']);
    });
    Object.assign(outputContext, defaultMonthNames);
  }

  const dayNames = {};
  const monthNames = {};

  // Loop through the context and get all month-name-* and day-name-* variables
  Object.keys(outputContext).forEach(function writeDayAndMonthNames(varName) {
    const dayNumberMatch = /^day-name-(\d)$/.exec(varName);
    const monthNumberMatch = /^month-name-(\d{1,2})$/.exec(varName);

    if (dayNumberMatch !== null) {
      // If the selected variable is a day-name-* variable add it to dayNames, abbreviated if requested
      if (outputContext['day-abbreviated'] === 'true') {
        dayNames[dayNumberMatch[1]] = outputContext[varName].substring(0, Number(outputContext['day-abbreviated-length']));
      } else {
        dayNames[dayNumberMatch[1]] = outputContext[varName];
      }
    } else if (monthNumberMatch !== null) {
      // If the selected variable is a month-name-* variable add it to monthNames
      monthNames[monthNumberMatch[1]] = outputContext[varName];
    }
  });

  return Object.assign(
    outputContext, {
      'day-names': dayNames,
      'month-names': monthNames,
    },
  );
}

function setDatesIfNeeded(context) {
  // This function checks to see if period equals year and if so, sets the from-date
  // and to-date to January 1st and December 31st of the selected year respectively. If
  // dates are selected instead of a full year, the context.year is updated to the year
  // of the context['to-date']

  if (context.period === 'full-year') {
    return Object.assign(
      context, {
        'from-date': `${context.year}-01-01`,
        'to-date': `${context.year}-12-31`,
      },
    );
  }

  return Object.assign(
    context, {
      year: moment.utc(context['to-date']).format('YYYY'),
    },
  );
}

function addDateStrings(context) {
  // This function takes the from-date and to-date from the context and adds strings
  // based on these dates
  return Object.assign(
    context, {
      'from-date-string': moment.utc(context['from-date']).format('MMMM Do'),
      'to-date-string': moment.utc(context['to-date']).format('MMMM Do'),
    },
  );
}

function process(context) {
  let outputContext = context;

  // Fill in gaps in the context (e.g. caused by hidden input fields) based on
  // the default context
  outputContext = fillGaps(outputContext);

  // Set the to and from dates to the selected year, if period = full-year
  outputContext = setDatesIfNeeded(outputContext);

  // Add strings for the start and end date to be used in the order dropdown
  outputContext = addDateStrings(outputContext);

  // And finally add (cased and abbreviated as requested) day and month names as objects
  outputContext = processDayAndMonthNames(outputContext);

  return outputContext;
}

module.exports.process = process;
module.exports.convertCase = convertCase;
