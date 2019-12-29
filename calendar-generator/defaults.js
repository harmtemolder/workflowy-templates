const moment = require('moment');

const defaultNames = require('./default-names.json');
const processContext = require('./process-context.js');

// Set default input values, if no context is available
const defaultContext = {
  period: 'full-year',
  year: moment().year().toString(),
  'from-date': `${moment().year().toString()}-01-01`,
  'from-date-string': 'January 1st',
  'to-date': `${moment().year().toString()}-12-31`,
  'to-date-string': 'December 31st',
  order: 'descending',
  'level-for-months': 'false',
  'level-for-weeks': 'true',
  'month-language': 'english',
  'month-case': 'upper',
  'month-number': 'prefix',
  'month-number-or-year': 'month',
  'month-separator': ' ',
  'week-format': 'date',
  'week-number': 'none',
  'week-number-label': '',
  'week-date': 'prefix',
  'week-date-separator': ' ',
  'week-date-abbreviated': 'true',
  'week-date-abbreviated-length': '3',
  'day-language': 'english',
  'day-case': 'upper',
  'day-number': 'prefix',
  'day-separator': ' ',
  'day-abbreviated': 'true',
  'day-abbreviated-length': '3',
};

// Convert default month names to selected case
const defaultMonthNames = defaultNames.months[defaultContext['month-language']];
Object.keys(defaultMonthNames).forEach(function convertMonthCase(key) {
  defaultMonthNames[key] = processContext.convertCase(defaultMonthNames[key], defaultContext['month-case']);
});

// Convert default day names to selected case
const defaultDayNames = defaultNames.days[defaultContext['day-language']];
Object.keys(defaultDayNames).forEach(function convertDayCase(key) {
  defaultDayNames[key] = processContext.convertCase(defaultDayNames[key], defaultContext['day-case']);
});

// Add default month and day names to context and export
Object.assign(defaultContext, defaultMonthNames, defaultDayNames);
module.exports.context = defaultContext;
