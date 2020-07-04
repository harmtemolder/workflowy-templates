"""

Some ideas if I make this into a node.js application:
- The option to reverse, or not
- The option to add defaults to year, month, week or day
- English, Dutch or custom month and weekday names
"""

from datetime import date, datetime, timedelta


def reverse_datespan(firstDate, lastDate, delta=timedelta(days=1)):
    """

    :param firstDate: the date on which the reverse_datespan ends
    :param lastDate: the date on which the reverse_datespan starts
    :param delta: the size of the steps between the dates
    :return: a generator with all dates between lastDate and firstDate,
             including both of those themselves
    """

    currentDate = lastDate
    while currentDate >= firstDate:
        yield currentDate
        currentDate -= delta


def get_monday(date):
    """

    :param date: a datetime.date
    :return: the date of the last monday before the date
    """

    return date - timedelta(days=date.weekday())


def get_sunday(monday):
    """

    :param monday: a datetime.date
    :return: the date of the sunday ending the week starting with monday
    """

    return monday + timedelta(days=6)


def get_last_day_of_month(date):
    """

    :param date:
    :return: the date of the last day of date's month
    """

    # get a date in next month
    next_month = date.replace(day=28) + timedelta(days=4)

    # subtract that date's day from it to get the last day of the
    # original date's month
    return next_month - timedelta(days=next_month.day)



def get_week_string(date, monday, sunday):
    """

    :param date:
    :param monday:
    :param sunday:
    :return: a string of two numbers (e.g. "01-07") where:
             - the first is the date's week's monday, or "01" if the
               monday doesn't fall in the date's month
             - the second is the date's week's sunday, or the last day
               of the month if the sunday doesn't fall in the date's
               month
    """

    if (date.month == monday.month) & (date.month == sunday.month):
        # both the week's monday and sunday fall in the current month
        first_day = monday.day
        last_day = sunday.day
    elif (date.month != monday.month):
        # the week's monday falls in the previous month
        first_day = 1
        last_day = sunday.day
    else:
        # the week's sunday falls in the next month
        first_day = monday.day
        last_day = get_last_day_of_month(date).day

    if first_day != last_day:
        return "{:02d}-{:02d}".format(first_day, last_day)
    else:
        return "{:02d}".format(first_day)


def generate_year_list(firstDate, lastDate):
    """

    :param firstDate:
    :param lastDate:
    :return:
    """

    year_list = {}

    for day in reverse_datespan(firstDate, lastDate):

        # if month doesn't exist in year_list, create it
        if months[day.month] not in year_list:
            year_list[months[day.month]] = {}

        # generate week_string and add it to the month, if it doesn't exist
        last_monday = get_monday(day)
        corresponding_sunday = get_sunday(last_monday)
        week_string = get_week_string(day, last_monday, corresponding_sunday)

        if week_string not in year_list[months[day.month]]:
            year_list[months[day.month]][week_string] = {}

        # add the day's weekday to the week
        year_list[months[day.month]][week_string][weekdays[day.weekday()]] = {}

    return year_list


year = 2019
months = {
    1: 'Januari',
    2: 'Februari',
    3: 'Maart',
    4: 'April',
    5: 'Mei',
    6: 'Juni',
    7: 'Juli',
    8: 'Augustus',
    9: 'September',
    10: 'Oktober',
    11: 'November',
    12: 'December'
}
weekdays = {
    0: 'Maandag',
    1: 'Dinsdag',
    2: 'Woensdag',
    3: 'Donderdag',
    4: 'Vrijdag',
    5: 'Zaterdag',
    6: 'Zondag'
}

year_list = generate_year_list(date(year, 1, 1), date(year, 12, 31))
print(year_list)
