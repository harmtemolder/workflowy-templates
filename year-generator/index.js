// index.js

// Load requirements
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const yearGenerator = require("./year-generator.js")

const app = express();
const port = 3000;

// Add functionality to parse a POST request's body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Read the form's HTML from file
const inputHtmlFile = "./index.html";
console.log("workflowy-year-generator: Reading HTML from file (" + inputHtmlFile + ")...");
let inputSource = fs.readFileSync(inputHtmlFile, "utf-8");

app.get('/', function (req, res) {
  console.log("workflowy-year-generator: Serving HTML as response to GET request...");
  res.send(inputSource);
});

app.post('/', function (req, res) {
  console.log("workflowy-year-generator: Handling POST request...");
  var context = req.body;

  // Generate the year and serve it as response to the POST request
  generatedYear = yearGenerator.generateYear(context["year"], context["order"])

  console.log(generatedYear)

  res.send(generatedYear);
});

app.listen(port, function () {
  console.log(`workflowy-year-generator: Listening on port ${port}...`);
});
