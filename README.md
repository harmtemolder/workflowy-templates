# WorkFlowy Calendar Generator
This tool helps you generate a list for a given period of time.

## How-to start the Node.js version
1. Open your terminal
1. `cd` into the `node` folder
1. (Run `npm install` before the first time, to install all dependencies)
1. Run `npm start` (or `npm run debug` if you want to use your Chrome browser's debugging on the Node instance)
1. Open [http://localhost:8080/](http://localhost:8080/) in your browser
1. `control + C` in your terminal to stop

## Troubleshooting
1. If you're having trouble pasting in Firefox, try in Chrome

## About the Python version
* I wrote the original calendar generator in Node.js but I am now in the process of rebuilding it in Python so it can run on a free server on PythonAnywhere.com.
* It's a port from what I built on [Handlebars.js](https://handlebarsjs.com/) through [pybars3](https://github.com/wbond/pybars3#readme)
* To set up a Conda environment with all dependencies in place, run this from within the `python` folder:
```shell
conda env create -f environment.yml
```
* Note to self: Run this to update the `environment.yml` file:
```shell
conda env export > environment.yml
```
