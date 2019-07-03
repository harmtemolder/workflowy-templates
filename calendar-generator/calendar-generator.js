// calendar-generator.js
/* eslint no-param-reassign: "off" */

const moment = require('moment');

function generateCalendar(context) {
  // This function takes a start and end date (both "YYYY-MM-DD"), order (either
  // "ascending" or "descending") and whether to include months and weeks in the
  // nesting. All this input should be part of context. It returns an HTML list
  // of the year(s), its months (if requested), weeks (if requested) and days.
  // All formatted according to what's requested in the context

  function generateDateList(fromDateString, toDateString, ascending) {
    // This function takes a from and to date and a boolean and returns a list
    // of all dates between those dates, including the dates themselves, ordered
    // ascendingly if the boolean is true and descendingly if it is not

    const fromDate = moment.utc(fromDateString);
    const toDate = moment.utc(toDateString).add(1, 'day');

    const dateList = [];

    for (let d = fromDate; d < toDate; d.add(1, 'day')) {
      dateList.push(new Date(d));
    }

    if (!ascending) {
      dateList.reverse();
    }

    return dateList;
  }

  function getWeekString(date, weekDate, weekDateSeparator, includeMonths, weekMonthNames, weekDateAbbreviated,
    weekDateAbbreviatedLength) {
    // This function takes a date and returns a string of two numbers (e.g.
    // '01-07') where (1) the first is the date's week's Monday, or '01' if the
    // Monday doesn't fall in the date's month and (2) the second is the date's
    // week's Sunday, or the last day of the month if the Sunday doesn't fall in
    // the date's month. The two numers are separated by the given separator

    // Get current date's week's Monday and Sunday
    const monday = date.clone().startOf('isoWeek');
    const sunday = date.clone().endOf('isoWeek');

    let mondayMonth = weekMonthNames[monday.month()];
    let dateMonth = weekMonthNames[date.month()];
    let sundayMonth = weekMonthNames[sunday.month()];

    if (weekDateAbbreviated) {
      const length = Number(weekDateAbbreviatedLength);

      mondayMonth = mondayMonth.substring(0, length);
      dateMonth = dateMonth.substring(0, length);
      sundayMonth = sundayMonth.substring(0, length);
    }

    let firstDay = monday.format('DD');
    let lastDay = sunday.format('DD');
    let weekString;

    if (monday.month() === sunday.month()) {
      // both the week's Monday and Sunday fall in the same month so includeMonths doesn't matter

      if (firstDay === lastDay) {
        weekString = firstDay;
      } else {
        weekString = `${firstDay}-${lastDay}`;
      }

      if (weekDate === 'prefix') {
        weekString = `${dateMonth}${weekDateSeparator}${weekString}`;
      } else if (weekDate === 'suffix') {
        weekString = `${weekString}${weekDateSeparator}${dateMonth}`;
      }
    } else if (!includeMonths) {
      // i.e. if the week should contain days from two months

      if (weekDate === 'prefix') {
        weekString = mondayMonth;
        weekString += weekDateSeparator;
        weekString += firstDay;
        weekString += '-';
        weekString += sundayMonth;
        weekString += weekDateSeparator;
        weekString += lastDay;
      } else if (weekDate === 'suffix') {
        weekString = firstDay;
        weekString += weekDateSeparator;
        weekString += mondayMonth;
        weekString += '-';
        weekString += lastDay;
        weekString += weekDateSeparator;
        weekString += sundayMonth;
      } else {
        weekString = `${firstDay}-${lastDay}`;
      }
    } else {
      if (date.month() !== monday.month()) {
        // i.e. the week's Monday falls in the previous month and the week should be divided over two months
        firstDay = '01';
      } else {
        // i.e. the week's Sunday falls in the next month and the week should be divided over two months
        lastDay = date.clone().endOf('month').format('DD');
      }

      weekString = `${firstDay}-${lastDay}`;

      if (weekDate === 'prefix') {
        weekString = `${dateMonth}${weekDateSeparator}${weekString}`;
      } else if (weekDate === 'suffix') {
        weekString = `${weekString}${weekDateSeparator}${dateMonth}`;
      }
    }

    return weekString;
  }

  function generateDay(date, dayNames, dayNumber, daySeparator, dayAbbreviated, dayAbbreviatedLength) {
    const dayPrefix = (dayNumber === 'prefix' ? `${date.format('DD')}${daySeparator}` : '');
    let day = dayNames[date.isoWeekday()];
    const daySuffix = (dayNumber === 'suffix' ? `${daySeparator}${date.format('DD')}` : '');

    if (dayAbbreviated) {
      day = day.substring(0, Number(dayAbbreviatedLength));
    }

    return `<li>${dayPrefix}${day}${daySuffix}</li>`;
  }

  function generateWeek(date, weekFormat, weekNumber, weekNumberLabel, weekDate, weekDateSeparator, weekDateAbbreviated,
    weekDateAbbreviatedLength, includeMonths, weekMonthNames) {
    let weekPrefix;
    let week;
    let weekSuffix;

    if (weekFormat === 'number') {
      weekPrefix = (weekNumber === 'prefix' ? weekNumberLabel : '');
      weekSuffix = (weekNumber === 'suffix' ? weekNumberLabel : '');
      week = `${weekPrefix}${date.isoWeek()}${weekSuffix}`;
    } else {
      week = getWeekString(date, weekDate, weekDateSeparator, includeMonths,
        weekMonthNames, weekDateAbbreviated, weekDateAbbreviatedLength);
    }

    return `<li>${week}<ul>`;
  }

  function generateMonth(date, monthNames, monthNumber, monthNumberOrYear, monthSeparator) {
    const month = monthNames[date.month()];
    const stringToAdd = (monthNumberOrYear === 'month' ? date.format('MM') : date.format('YYYY'));
    const monthPrefix = (monthNumber === 'prefix' ? `${stringToAdd}${monthSeparator}` : '');
    const monthSuffix = (monthNumber === 'suffix' ? `${monthSeparator}${stringToAdd}` : '');

    return `<li>${monthPrefix}${month}${monthSuffix}<ul>`;
  }

  function generateYear(date) {
    return `<li>${date.year()}<ul>`;
  }

  function closeList(numLevels) {
    return '</li></ul>'.repeat(numLevels);
  }

  function dateListToHtml(dateList, includeMonths, monthNames, monthNumber, monthNumberOrYear, monthSeparator, includeWeeks,
    weekFormat, weekNumber, weekNumberLabel, weekDate, weekDateSeparator, weekDateAbbreviated, weekDateAbbreviatedLength,
    dayNames, dayNumber, daySeparator, dayAbbreviated, dayAbbreviatedLength) {
    let outputHtml = '';
    let previousDate;

    for (let d = 0; d < dateList.length; d++) {
      const date = moment(dateList[d]);

      // Start with the lowest level of the nest, the day
      let dayHtml = generateDay(date, dayNames, dayNumber, daySeparator, dayAbbreviated, dayAbbreviatedLength);

      // Set up the very first date with all requested levels
      if (previousDate == null || (previousDate.year() !== date.year())) {
        // Add opening of week
        if (includeWeeks) {
          // Note that this re-uses the monthNames which is also used in the generateMonth function
          dayHtml = `${generateWeek(date, weekFormat, weekNumber, weekNumberLabel, weekDate, weekDateSeparator,
            weekDateAbbreviated, weekDateAbbreviatedLength, includeMonths, monthNames)}${dayHtml}`;
        }

        // Add opening of month
        if (includeMonths) {
          dayHtml = `${generateMonth(date, monthNames, monthNumber, monthNumberOrYear, monthSeparator)}${dayHtml}`;
        }

        // Add opening of year
        dayHtml = `${generateYear(date)}${dayHtml}`;

        if (previousDate != null) {
          // Close previous year, month and week, whichever applies
          if (includeMonths && includeWeeks) {
            dayHtml = `${closeList(3)}${dayHtml}`;
          } else {
            // Since either includeMonths or includeWeeks should be true, there will
            // be a minimum of two open lists to close
            dayHtml = `${closeList(2)}${dayHtml}`;
          }
        }
      } else if (includeMonths && (previousDate.month() !== date.month())) {
        // TODO What if includeMonths === false and weekNumber === false?
        if (includeWeeks) {
          // Add opening of new week
          dayHtml = `${generateWeek(date, weekFormat, weekNumber, weekNumberLabel, weekDate, weekDateSeparator,
            weekDateAbbreviated, weekDateAbbreviatedLength, includeMonths, monthNames)}${dayHtml}`;

          // Add opening of new month
          dayHtml = `${generateMonth(date, monthNames, monthNumber, monthNumberOrYear, monthSeparator)}${dayHtml}`;

          // Add closing of previous month and week
          dayHtml = `${closeList(2)}${dayHtml}`;
        } else {
          // Add opening of new month
          dayHtml = `${generateMonth(date, monthNames, monthNumber, monthNumberOrYear, monthSeparator)}${dayHtml}`;

          // Add closing of previous month
          dayHtml = `${closeList(1)}${dayHtml}`;
        }
      } else if (includeWeeks && ((previousDate.isoWeekday() + date.isoWeekday()) === 8)) {
        // Add opening of new week
        dayHtml = `${generateWeek(date, weekFormat, weekNumber, weekNumberLabel, weekDate, weekDateSeparator,
          weekDateAbbreviated, weekDateAbbreviatedLength, includeMonths, monthNames)}${dayHtml}`;

        // Add closing of previous week
        dayHtml = `${closeList(1)}${dayHtml}`;
      }

      outputHtml += dayHtml;
      previousDate = date;
    }

    // Close the last week, month and year, whichever applies
    if (includeMonths && includeWeeks) {
      outputHtml += closeList(3);
    } else {
      // Since either includeMonths or includeWeeks should be true, there will
      // be a minimum of two open lists to close
      outputHtml += closeList(2);
    }

    return outputHtml;
  }

  const dateList = generateDateList(
    context['from-date'],
    context['to-date'],
    (context.order === 'ascending'),
  );

  const htmlList = dateListToHtml(
    dateList,
    context['level-for-months'] === 'true', // includeMonths
    context['month-names'], // monthNames
    context['month-number'], // monthNumber
    context['month-number-or-year'], // monthNumberOrYear
    context['month-separator'], // monthSeparator
    context['level-for-weeks'] === 'true', // includeWeeks
    context['week-format'], // weekFormat
    context['week-number'], // weekNumber
    context['week-number-label'], // weekNumberLabel
    context['week-date'], // weekDate
    context['week-date-separator'], // weekDateSeparator
    context['week-date-abbreviated'] === 'true', // weekDateAbbreviated
    context['week-date-abbreviated-length'], // weekDateAbbreviatedLength
    context['day-names'], // dayNames
    context['day-number'], // dayNumber
    context['day-separator'], // daySeparator
    context['day-abbreviated'] === 'true', // dayAbbreviated
    context['day-abbreviated-length'], // dayAbbreviatedLength
  );

  // Add the resulting HTML list to context to be used within the HTML template
  return Object.assign(context, {
    'html-list': `<li>--------------------</li>
    <li><a href="#" class="select-link" data-selector="#output">Select output</a></li>
    <li>--------------------</li>
    <span id="output">${htmlList}</span>`,
  });
}

// Export the generateCalendar function above so that other modules can use it
module.exports.generateCalendar = generateCalendar;
