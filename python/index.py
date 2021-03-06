import json
import sys

from flask import Flask, redirect, render_template, request, url_for
from flask_assets import Environment, Bundle

from defaults import default_context
from generate import generate_html_list
from process import fill_gaps, add_month_names, add_day_names

# Register Flask app and stylesheets
app = Flask(__name__)
assets = Environment(app)
assets.url = app.static_url_path;
assets.directory = app.static_folder;
assets.append_path('styles')
assets.append_path('scripts')

scss = Bundle(
    'styles.scss',
    filters='pyscss',
    output='styles.css')
assets.register('styles_scss', scss)

js = Bundle(
    'form-functions.js',
    'ga-functions.js',
    'modal-functions.js',
    filters='jsmin',
    output='scripts.js')
assets.register('scripts_js', js)

@app.route('/')
def go_to_calendar_generator():
    return redirect(url_for('calendar_generator'), code=301)

@app.route('/calendar-generator/', methods=['POST', 'GET'])
def calendar_generator():
    # Take defaults as starting point
    context = default_context

    if request.method == 'POST':
        # Read the POST request's payload
        request_form = request.form.to_dict()

        # Re-add items for disabled checkboxes
        request_form = fill_gaps(request_form)


        # Overwrite defaults with payload
        context.update(request_form)

        # Add day and month names
        context = add_day_names(context)
        context = add_month_names(context)

        # If `generate` has been clicked, generate an `html_list`
        if request_form['generate'] == 'true':
            context['html_list'] = generate_html_list(context)
        elif 'html_list' in context:
            del context['html_list']

    # Add month and day names, if one of the default languages is selected
    context = add_month_names(context)
    context = add_day_names(context)

    if app.debug:
        print(json.dumps(context, indent=4), file=sys.stderr)

    return render_template('index.html.jinja', context=context)
