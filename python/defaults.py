import datetime
import json


with open('default-names.json', 'r') as default_names_json:
    default_names = json.loads(default_names_json.read())

default_context = {
    'period': 'full year',
    'year': str(datetime.datetime.now().year),
    'from_date': '{}-01-01'.format(datetime.datetime.now().year),
    'from_date_string': 'January 1st',
    'to_date': '{}-12-31'.format(datetime.datetime.now().year),
    'to_date_string': 'December 31st',
    'order': 'descending',
    'level_for_months': 'false',
    'level_for_weeks': 'true',
    'month_language': 'english',
    'month_case': 'upper',
    'month_number': 'prefix',
    'month_number_or_year': 'month',
    'month_separator': ' ',
    'week_format': 'date',
    'week_number': 'prefix',
    'week_number_label': 'WEEK ',
    'week_date': 'prefix',
    'week_date_separator': ' ',
    'week_date_abbreviated': 'true',
    'week_date_abbreviated_length': '3',
    'day_language': 'english',
    'day_case': 'upper',
    'day_number': 'prefix',
    'day_separator': ' ',
    'day_abbreviated': 'true',
    'day_abbreviated_length': '3',
}

if __name__ == '__main__':
    print(json.dumps(default_context, indent=4))
