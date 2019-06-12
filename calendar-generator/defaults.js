const moment = require('moment');

const defaultNames = require('./default-names.json');
const processContext = require('./process-context.js');

// Set default input values, if no context is available
let context = {
  period: 'full-year',
  year: moment().year().toString(),
  'from-date': `${moment().year().toString()}-01-01`,
  'to-date': `${moment().year().toString()}-12-31`,
  order: 'descending',
  'month-case': 'upper',
  'month-language': 'english',
  'month-number': 'prefix',
  'week-start': 'monday',
  'day-language': 'english',
  'day-case': 'proper',
  'day-number': 'prefix',
};

// Convert default month names to selected case
const defaultMonthNames = defaultNames.months[context['month-language']];
Object.keys(defaultMonthNames).map(function (key) {
  defaultMonthNames[key] = processContext.convertCase(defaultMonthNames[key], context['month-case']);
});

// Convert default day names to selected case
const defaultDayNames = defaultNames.days[context['day-language']];
Object.keys(defaultDayNames).map(function (key) {
  defaultDayNames[key] = processContext.convertCase(defaultDayNames[key], context['day-case']);
});

// Add default month and day names to context and export
context = Object.assign(context, defaultMonthNames, defaultDayNames);
module.exports.context = context;
