// year-generator.js

const Entities = require("html-entities").AllHtmlEntities;
const moment = require("moment");

const entities = new Entities();

function generateYear(year, order, monthNames, dayNames) {
  // This function takes a year (integer) and order (either "ascending" or
  // "descending") and returns an HTML list of the year, its months, weeks and
  // days

  function generateDateList(year, ascending) {
    // This function takes a year and a boolean and returns a list of all dates
    // in that year, ordered ascendingly if the boolean is true

    const firstDate = moment.utc(year + "-01-01");
    const lastDate = firstDate.clone().add(1, "year");

    let dateList = [];

    for (let d = firstDate; d < lastDate; d.add(1, "day")) {
      dateList.push(new Date(d));
    }

    if (!ascending) {
      dateList.reverse();
    }

    return dateList;
  }

  function getWeekString(date) {
    // This function takes a date and returns a string of two numbers (e.g.
    // "01-07") where (1) the first is the date's week's Monday, or "01" if the
    // Monday doesn't fall in the date's month and (2) the second is the date's
    // week's Sunday, or the last day of the month if the Sunday doesn't fall in
    // the date's month

    // Get current date's week's Monday and Sunday
    const monday = date.clone().startOf("isoWeek");
    const sunday = date.clone().endOf("isoWeek");

    let firstDay;
    let lastDay;

    if ((date.month() === monday.month()) && (date.month() === sunday.month())) {
      // both the week's Monday and Sunday fall in the current month
      firstDay = monday.format("DD");
      lastDay = sunday.format("DD");
    } else if (date.month() !== monday.month()) {
      // the week's Monday falls in the previous month
      firstDay = "01";
      lastDay = sunday.format("DD");
    } else {
      // the week's Sunday falls in the next month
      firstDay = monday.format("DD");
      lastDay = date.clone().endOf("month").format("DD");
    }

    debugger;

    if (firstDay === lastDay) {
      return firstDay;
    } else {
      return firstDay + "-" + lastDay;
    }
  }

  function dateListToNestedObject(dateList, monthNames, dayNames) {
    // This function takes a list of dates and converts that to a nested object
    // by year, month, week and day

    outputObject = {};

    for (let d = 0; d < dateList.length; d++) {
      date = moment(dateList[d]);

      // Add current date's year to the object, if not already there
      const dYear = date.year();
      if (!(dYear in outputObject)) {
        outputObject[dYear] = {};
      }

      // Add current date's month to the year, if not already there
      const dMonth = monthNames[date.month()];
      if (!(dMonth in outputObject[dYear])) {
        outputObject[dYear][dMonth] = {};
      }

      // Add current date's week string to the month, if not already there
      const dWeek = getWeekString(date);
      if (!(dWeek in outputObject[dYear][dMonth])) {
        outputObject[dYear][dMonth][dWeek] = {};
      }

      // Add current date's day to the month
      const dDay = dayNames[date.isoWeekday()];
      outputObject[dYear][dMonth][dWeek][dDay] = {};
    }

    return outputObject;
  }

  function objectToHtmlList(inputObject) {
    let outputHtml = "";

    Object.keys(inputObject).forEach(function (k) {
        if (typeof inputObject[k] == "object" && inputObject[k] !== null) {
          outputHtml += "<li>" + entities.encode(k) + "<ul>";
          outputHtml += objectToHtmlList(inputObject[k]);
          outputHtml += "</ul></li>";
        } else {
          outputHtml += "<li>" + k + " : " + inputObject[k] + "</li>";
        }
      });
    return outputHtml;
  }

  const horizontalLine = "<hr>\n"
  const dateList = generateDateList(year, (order === "ascending"));
  const nestedObject = dateListToNestedObject(dateList, monthNames, dayNames);
  const htmlList = objectToHtmlList(nestedObject);

  return horizontalLine + htmlList;
}

// Export the generateYear function above so that other modules can use them
module.exports.generateYear = generateYear;
