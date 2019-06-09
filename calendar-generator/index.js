// index.js

// Load requirements
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const calendarGenerator = require("./calendar-generator.js")
const defaults = require("./defaults.js")
const processContext = require("./process-context.js")

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
console.log("workflowy-calendar-generator: Reading HTML from file (" + htmlFile + ")...");
let htmlSource = fs.readFileSync(htmlFile, "utf-8");
var htmlTemplate = Handlebars.compile(htmlSource);

app.get('/', function (req, res) {
  console.log("workflowy-calendar-generator: Serving HTML as response to GET request...");
  const context = processContext.process(defaults["context"]);
  res.send(htmlTemplate(context));
});

app.post('/', function (req, res) {
  console.log("workflowy-calendar-generator: Handling POST request...");
  let context = processContext.process(req.body);

  // Generate the HTML list for the selected period and add it to context
  context = calendarGenerator.generateYear(context);

  res.send(htmlTemplate(context));
});

app.listen(port, function () {
  console.log(`workflowy-calendar-generator: Listening on port ${port}...`);
});
