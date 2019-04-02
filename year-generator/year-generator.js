// year-generator.js

const moment = require("moment");

function generateYear(year, order){
  // This function takes a year (integer) and order ("ascending" or
  // "descending") and returns an HTML list of the year, its months, weeks and
  // days

  function generateDateList(year, ascending){
    // This function takes a year and a boolean and returns a list of all dates
    // in that year, ordered ascendingly if the boolean is true

    var firstDate = moment.utc(year + "-1-1");
    var lastDate = firstDate.clone().add(1, 'year');

    var dateList = [];

    for (let d = firstDate; d < lastDate; d.add(1, 'day')) {
      dateList.push(new Date(d));
    }

    if (!ascending) {
      dateList.reverse();
    }

    return dateList;
  }

  const htmlStart = "<html><head></head><body>";
  const htmlEnd = "</body></html>";

  const dateList = generateDateList(year, (order === "ascending"));

  console.log(dateList);

  return htmlStart + "<p>You asked for " + year + ", ordered " + order + "ly.</p>" + htmlEnd;
}

// Export the generateYear function above so that other modules can use them
module.exports.generateYear = generateYear;
