// index.js

// Load requirements
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const yearGenerator = require("./year-generator.js")
const defaults = require("./defaults.js")

const app = express();
const port = 3000;

// Serve static files from the assets folder
app.use(express.static('assets'))

// Add functionality to parse a POST request's body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({
  extended: true
}));

// Add equals and nequals helpers to Handlebars
Handlebars.registerHelper('equals', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('nequals', function (v1, v2, options) {
  if (v1 === v2) {
    return options.inverse(this);
  }
  return options.fn(this);
});

// Read the form's HTML from file and compile with Handlebars
const htmlFile = "./index.html";
console.log("workflowy-year-generator: Reading HTML from file (" + htmlFile + ")...");
let htmlSource = fs.readFileSync(htmlFile, "utf-8");
var htmlTemplate = Handlebars.compile(htmlSource);

app.get('/', function (req, res) {
  console.log("workflowy-year-generator: Serving HTML as response to GET request...");
  res.send(htmlTemplate(defaults["context"]));
});

function getNamesFromContext(context) {
  const weekdayPattern = /^day\-name\-(\d)$/;
  const monthPattern = /^month\-name\-(\d{1,2})$/;

  let dayNames = {};
  let monthNames = {};

  for (let v in context) {
    let dayNumberMatch = weekdayPattern.exec(v);
    let monthNumberMatch = monthPattern.exec(v);

    if (dayNumberMatch !== null) {
      // Note that moment.isoWeekday() returns 1 for Monday and 7 for Sunday
      dayNames[dayNumberMatch[1]] = context[v];
    } else if (monthNumberMatch !== null) {
      monthNames[monthNumberMatch[1]] = context[v];
    }
  }

  return {
    "day": dayNames,
    "month": monthNames
  }
}

app.post('/', function (req, res) {
  console.log("workflowy-year-generator: Handling POST request...");
  const context = req.body;
  const namesFromContext = getNamesFromContext(context);

  // Generate the year and serve it as response to the POST request
  generatedYear = yearGenerator.generateYear(
    context["year"],
    context["order"],
    namesFromContext["month"],
    namesFromContext["day"]
  )

  // TODO append generatedYear to htmlTemplate

  res.send(htmlTemplate(context));
});

app.listen(port, function () {
  console.log(`workflowy-year-generator: Listening on port ${port}...`);
});
