from defaults import default_names


def convert_case(string, case):
    """Converts case of string to UPPER, lower or Proper
    :param string: String to convert
    :param case: Case to use. One of 'upper', 'lower' or 'proper'
    :return: String in requested case
    """
    if case == 'upper':
        return string.upper()
    elif case == 'lower':
        return string.lower()
    elif case == 'proper':
        return string.title()
    else:
        raise ValueError(
            '"{}" is not valid input. Use one of "upper", "lower" or '
            '"proper"'.format(case))


def add_month_names(context):
    """Adds month names in the requested language and case to the given
    `context` dict

    :param context: Dict with context information
    :return: The `context` dict with added month names in requested case
    """

    language = context['month_language']
    if language in default_names['months']:
        month_names = default_names['months'][language]
        month_names = {
            key: convert_case(
                value,
                context['month_case']
            ) for key, value in month_names.items()}
        context.update(month_names)

    return context


def add_day_names(context):
    """Adds day names in the requested language and case to the given
    `context` dict

    :param context: Dict with context information
    :return: The `context` dict with added day names in requested case
    """

    language = context['day_language']
    if language in default_names['days']:
        day_names = default_names['days'][language]
        day_names = {
            key: convert_case(
                value,
                context['day_case']
            ) for key, value in day_names.items()}
        context.update(day_names)

    return context


def fill_gaps(context):
    """Because checkboxes don't return anything if they're unchecked, re-add them

    :param context: Dict with context information
    :return: The `context` dict with added items for disabled checkboxes
    """

    if 'level_for_months' not in context:
        context['level_for_months'] = 'false'
    if 'level_for_weeks' not in context:
        context['level_for_weeks'] = 'false'
    if 'week_date_abbreviated' not in context:
        context['week_date_abbreviated'] = 'false'
    if 'day_abbreviated' not in context:
        context['day_abbreviated'] = 'false'

    return context
