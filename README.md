# WorkFlowy Calendar Generator
This tool helps you generate a list for a given period of time.

## About the Node.js version
* This is built on [Node.js](https://nodejs.org/en/) with [Express](https://expressjs.com/) and [Handlebars](https://handlebarsjs.com/)

## How-to start the Node.js version
1. Open your terminal
1. `cd` into the `node` folder
1. (Run `npm install` before the first run, to install all dependencies)
1. Run `npm start` (or `npm run debug` if you want to use your Chrome browser's debugging on the Node instance)
1. Open [http://localhost:8080/](http://localhost:8080/) in your browser
1. Press `control + C` in your terminal to stop the server when you are done

## About the Python version
* I wrote the original calendar generator in Node.js but I am now in the process of rebuilding it in Python so it can run on a free server on PythonAnywhere.com
* It's a port from what I built in Node.js through [Flask](http://flask.pocoo.org/) and [Jinja](https://palletsprojects.com/p/jinja/)
* To set up a virtual environment with all dependencies in place, run `./setup.sh` from within the `python` folder. (Make it executable with `chmod +x setup.sh` if it isn't already.)
* Start it with `./start.sh` (or `./debug.sh` to debug)

## Troubleshooting
* If you're having trouble pasting in Firefox, try in Chrome
* If GitHub keeps nagging you on potential security vulnerabilities, run `npm run update:packages` to force update all node packages to their latest versions

