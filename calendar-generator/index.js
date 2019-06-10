// index.js

// Load requirements
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const Handlebars = require("handlebars");
const path = require("path");
const sassMiddleware = require("node-sass-middleware");

// And local imports
const calendarGenerator = require(path.join(__dirname, "calendar-generator.js"));
const defaults = require(path.join(__dirname, "defaults.js"));
const processContext = require(path.join(__dirname, "process-context.js"));

const app = express();
const port = 8080;

// Parse SCSS from the assets folder
app.use(sassMiddleware({
  src: path.join(__dirname, "styles"),
  dest: path.join(__dirname, "public/styles"),
  debug: true,
  indentedSyntax: false, // true = .sass and false = .scss
  outputStyle: "compressed",
  sourceMap: true,
  prefix: "/styles"
}));

// Serve static files from the assets folder
app.use(express.static(path.join(__dirname, "public")))

// Add functionality to parse a POST request"s body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.urlencoded({
  extended: true
}));

// Add equals and nequals helpers to Handlebars
Handlebars.registerHelper("equals", function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("nequals", function (v1, v2, options) {
  if (v1 === v2) {
    return options.inverse(this);
  }
  return options.fn(this);
});

// Read the form"s HTML from file and compile with Handlebars
const htmlFile = path.join(__dirname, "index.html");
console.log("workflowy-calendar-generator: Reading HTML from file (" + htmlFile + ")...");
let htmlSource = fs.readFileSync(htmlFile, "utf-8");
var htmlTemplate = Handlebars.compile(htmlSource);

app.get("/", function (req, res) {
  console.log("workflowy-calendar-generator: Serving HTML as response to GET request...");
  const context = processContext.process(defaults["context"]);
  res.send(htmlTemplate(context));
});

app.post("/", function (req, res) {
  console.log("workflowy-calendar-generator: Handling POST request...");
  let context = processContext.process(req.body);

  // Generate the HTML list for the selected period and add it to context
  context = calendarGenerator.generateYear(context);

  res.send(htmlTemplate(context));
});

app.listen(port, function () {
  console.log(`workflowy-calendar-generator: Listening on port ${port}...`);
});