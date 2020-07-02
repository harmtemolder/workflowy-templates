from calendar import monthrange
from datetime import datetime, timedelta
import json
import re

from pandas import date_range


def generate_date_list(from_date_string, to_date_string, ascending):
    """This function takes a from and to date and a boolean and returns a
    list of all dates between those dates, including the dates themselves,
    ordered ascendingly if the boolean is true and descendingly if it is not

    :param from_date_string: Start date, 'yyyy-mm-dd'
    :param to_date_string: End date, 'yyyy-mm-dd'
    :param ascending: Whether December should be on bottom
    :return: List of datetime objects for all dates between from_ and
    to_date_string, including both
    """

    from_date = datetime.strptime(from_date_string, '%Y-%m-%d')
    to_date = datetime.strptime(to_date_string, '%Y-%m-%d')
    date_list = date_range(
        start=from_date,
        end=to_date).tolist()

    if not ascending:
        date_list.reverse()

    return date_list


def get_week_string(date, week_date, week_date_separator, include_months,
                    week_month_names, week_date_abbreviated,
                    week_date_abbreviated_length):
    """This function takes a date and returns a string of two numbers (e.g.
    '01–07') where (1) the first is the date's week's Monday, or '01' if the
    Monday doesn't fall in the date's month and (2) the second is the date's
    week's Sunday, or the last day of the month if the Sunday doesn't fall in
    the date's month. The two numbers are separated by the given separator

    :param date:
    :param week_date:
    :param week_date_separator:
    :param include_months:
    :param week_month_names:
    :param week_date_abbreviated:
    :param week_date_abbreviated_length:
    :return:
    """

    # Get current date's week's Monday and Sunday
    monday = date - timedelta(date.isoweekday() - 1)
    sunday = monday + timedelta(6)

    # Get month names for all three dates
    monday_month = week_month_names[str(monday.month - 1)]
    date_month = week_month_names[str(date.month - 1)]
    sunday_month = week_month_names[str(sunday.month - 1)]

    if week_date_abbreviated:
        length = int(week_date_abbreviated_length)
        monday_month = monday_month[:length]
        date_month = date_month[:length]
        sunday_month = sunday_month[:length]

    first_day = monday.strftime('%d')
    last_day = sunday.strftime('%d')

    if monday.month == sunday.month:
        # both the week's Monday and Sunday fall in the same month so includeMonths doesn't matter

        if first_day == last_day:
            week_string = first_day
        else:
            week_string = '{}–{}'.format(first_day, last_day)

        if week_date == 'prefix':
            week_string = '{0}{1}{2}'.format(
                date_month, week_date_separator, week_string)
        elif week_date == 'suffix':
            week_string = '{2}{1}{0}'.format(
                date_month, week_date_separator, week_string)
    elif not include_months:
        # i.e. there is no level for months, so the week should contain days
        # from two months

        if week_date == 'prefix':
            week_string = '{0}{1}{2}–{3}{1}{4}'.format(
                monday_month, week_date_separator, first_day, sunday_month,
                last_day)
        elif week_date == 'suffix':
            week_string = '{2}{1}{0}–{4}{1}{3}'.format(
                monday_month, week_date_separator, first_day, sunday_month,
                last_day)
        else:
            week_string = '{}–{}'.format(first_day, last_day)
    else:
        if date.month != monday.month:
            # i.e. the week's Monday falls in the previous month and the week
            # should be divided over two months
            first_day = '01'
        else:
            # i.e. the week's Sunday falls in the next month and the week
            # should be divided over two months
            last_day = '{0:02d}'.format(monthrange(date.year, date.month)[1])

        week_string = '{}–{}'.format(first_day, last_day)

        if week_date == 'prefix':
            week_string = '{0}{1}{2}'.format(
                date_month, week_date_separator, week_string)
        elif week_date == 'suffix':
            week_string = '{2}{1}{0}'.format(
                date_month, week_date_separator, week_string)

    return week_string

def generate_day(date, day_names, day_number, day_separator, day_abbreviated,
                 day_abbreviated_length):
    """Return a formatted HTML list item for the requested day in the
    requested format

    :param date:
    :param day_names:
    :param day_number:
    :param day_separator:
    :param day_abbreviated:
    :param day_abbreviated_length:
    :return:
    """
    day = day_names[str(date.isoweekday())]

    # TODO I already did this, right?
    # if day_abbreviated:
    #     day = day[:int(day_abbreviated_length)]

    if day_number == 'prefix':
        day = '{0}{1}{2}'.format(date.day, day_separator, day)
    elif day_number == 'suffix':
        day = '{2}{1}{0}'.format(date.day, day_separator, day)

    return '<li>{}</li>'.format(day)


def generate_week(date, week_format, week_number, week_number_label,
                  week_date, week_date_separator, week_date_abbreviated,
                  week_date_abbreviated_length, include_months,
                  week_month_names):
    """Return a formatted list item for the requested week in the requested
    format

    :param date:
    :param week_format:
    :param week_number:
    :param week_number_label:
    :param week_date:
    :param week_date_separator:
    :param week_date_abbreviated:
    :param week_date_abbreviated_length:
    :param include_months:
    :param week_month_names:
    :return:
    """

    if week_format == 'number':
        week = str(date.isoweek)

        if week_number == 'prefix':
            week = '{0}{1}'.format(week_number_label, week)
        elif week_number == 'suffix':
            week = '{1}{0}'.format(week_number_label, week)

    else:
        week = get_week_string(date, week_date, week_date_separator, include_months,
                    week_month_names, week_date_abbreviated,
                    week_date_abbreviated_length)

    return '<li>{}<ul>'.format(week)


def generate_month(date, month_names, month_number, month_number_or_year,
                   month_separator):
    """Return a formatted list item for the requested month in the requested
    format

    :param date:
    :param month_names:
    :param month_number:
    :param month_number_or_year:
    :param month_separator:
    :return:
    """

    month = month_names[str(date.month - 1)]

    if month_number_or_year == 'month':
        string_to_add = date.strftime('%m')
    else:
        string_to_add = date.strftime('%Y')

    if month_number == 'prefix':
        month = '{0}{1}{2}'.format(string_to_add, month_separator, month)
    elif month_number == 'suffix':
        month = '{2}{1}{0}'.format(string_to_add, month_separator, month)

    return '<li>{}<ul>'.format(month)


def generate_year(date):
    """Return a formatted list item for the requested year in the requested
    format

    :param date:
    :return:
    """
    return '<li>{}<ul>'.format(date.year)

def close_list(num_levels):
    """Return closing HTML tags for the open list items and lists

    :param num_levels:
    :return:
    """
    return '</li></ul>'  * num_levels


def date_list_to_html(date_list, include_months, month_names, month_number,
                      month_number_or_year, month_separator, include_weeks,
                      week_format, week_number, week_number_label, week_date,
                      week_date_separator, week_date_abbreviated,
                      week_date_abbreviated_length, day_names, day_number,
                      day_separator, day_abbreviated, day_abbreviated_length):
    """Combines all other functions to generate an HTML list for the given
    date list

    :param date_list:
    :param include_months:
    :param month_names:
    :param month_number:
    :param month_number_or_year:
    :param month_separator:
    :param include_weeks:
    :param week_format:
    :param week_number:
    :param week_number_label:
    :param week_date:
    :param week_date_separator:
    :param week_date_abbreviated:
    :param week_date_abbreviated_length:
    :param day_names:
    :param day_number:
    :param day_separator:
    :param day_abbreviated:
    :param day_abbreviated_length:
    :return:
    """

    output_html = ''
    previous_date = None

    for date in date_list:
        # Start with the lowest level of the nest, the day
        day_html = generate_day(
            date, day_names, day_number, day_separator, day_abbreviated,
            day_abbreviated_length)

        # Set up the very first date with all requested levels
        if previous_date is None or (previous_date.year != date.year):
            # Add opening of week
            if include_weeks:
                # Note that this re-uses `month_names`, which is also used in
                # the `generate_month` function
                day_html = generate_week(
                    date, week_format, week_number, week_number_label,
                    week_date, week_date_separator, week_date_abbreviated,
                    week_date_abbreviated_length, include_months,
                    month_names) + day_html

            # Add opening of month
            if include_months:
                day_html = generate_month(
                    date, month_names, month_number, month_number_or_year,
                    month_separator) + day_html

            # Add opening of year
            day_html = generate_year(date) + day_html

            if previous_date is not None:
                # Close previous year, month and week, whichever applies
                if include_months and include_weeks:
                    day_html = close_list(3) + day_html
                else:
                    # Since either include_months or include_weeks should be
                    # true, there will be a minimum of two open lists to close
                    day_html = close_list(2) + day_html
        elif include_months and (previous_date.month != date.month):
            # TODO What if includeMonths === false and weekNumber === false?
            if include_weeks:
                # Add opening of new week
                day_html = generate_week(date, week_format, week_number,
                    week_number_label, week_date, week_date_separator,
                    week_date_abbreviated, week_date_abbreviated_length,
                    include_months, month_names) + day_html

                # Add opening of new month
                day_html = generate_month(date, month_names, month_number,
                                          month_number_or_year,
                                          month_separator) + day_html

                # Add closing of previous month and week
                day_html = close_list(2) + day_html
            else:
                # Add opening of new month
                day_html = generate_month(date, month_names, month_number,
                                          month_number_or_year,
                                          month_separator) + day_html

                # Add closing of previous month
                day_html = close_list(1) + day_html
        elif (include_weeks and
              (previous_date.isoweekday() + date.isoweekday() == 8)):
            # Add opening of new week
            day_html = generate_week(date, week_format, week_number,
                                     week_number_label, week_date,
                                     week_date_separator, week_date_abbreviated,
                                     week_date_abbreviated_length,
                                     include_months, month_names) + day_html

            # Add closing of previous week
            day_html = close_list(1) + day_html

        output_html += day_html
        previous_date = date

    # Close the last week, month and year, whichever applies
    if include_months and include_weeks:
        output_html += close_list(3)
    else:
        # Since either includeMonths or includeWeeks should be true, there will
        # be a minimum of two open lists to close
        output_html += close_list(2)

    return output_html

def generate_html_list(context):
    """This function takes a start and end date (both 'yyyy_mm_dd'), order (either
    'ascending' or 'descending') and whether to include months and weeks in the
    nesting. All this input should be part of `context`. It returns an HTML list
    of the year(s), its months (if requested), weeks (if requested) and days.
    All formatted according to what's requested in the context

    :param context: Dict with context information
    :return: An HTML list as string
    """

    date_list = generate_date_list(
        context['from_date'],
        context['to_date'],
        (context['order'] == 'ascending'))

    html_list = date_list_to_html(
        date_list,
        include_months=(context['level_for_months'] == 'true'),
        month_names=context['month_names'],
        month_number=context['month_number'],
        month_number_or_year=context['month_number_or_year'],
        month_separator=context['month_separator'],
        include_weeks=(context['level_for_weeks'] == 'true'),
        week_format=context['week_format'],
        week_number=context['week_number'],
        week_number_label=context['week_number_label'],
        week_date=context['week_date'],
        week_date_separator=context['week_date_separator'],
        week_date_abbreviated=(context['week_date_abbreviated'] == 'true'),
        week_date_abbreviated_length=context['week_date_abbreviated_length'],
        day_names=context['day_names'],
        day_number=context['day_number'],
        day_separator=context['day_separator'],
        day_abbreviated=(context['day_abbreviated'] == 'true'),
        day_abbreviated_length=context['day_abbreviated_length'],
    )

    return ('<li>____________________</li>'
            '<li><a href="#" class="select_link" data-selector="#output">Select output</a></li>'
            '<li>____________________</li>'
            '<span id="output">{}</span>'.format(html_list))


def camel_case_to_underscore(string, print_result=False):
    """Convert a camel case string to underscores

    :param string: The string to convert
    :param print: Whether to print or return the converted string
    :return: If `print` == False, returns the converted string
    """
    string = re.sub(r'(?<!^)(?=[A_Z])', '_', string).lower()
    if print_result:
        print(string)
    else:
        return string


if __name__ == '__main__':
    with open('dummy-context.json', 'r') as dummy_context:
        context = json.loads(dummy_context.read())

    html_list = generate_html_list(context)
    print(html_list)
