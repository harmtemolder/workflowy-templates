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
    `context` dict—both as separate items and as a dict

    :param context: Dict with context information
    :return: The `context` dict with added month names in requested case
    """

    language = context['month_language']
    if language in default_names['months']:  # i.e. not custom
        default_month_names = default_names['months'][language]

        # Add items per month in the proper case to the context
        default_month_names = {
            key: convert_case(value, context['month_case'])
            for (key, value) in default_month_names.items()
        }
        context.update(default_month_names)

    # Convert month name items to a dict, even when they are custom
    month_names_dict = {
        key.split('_')[-1]: value
        for (key, value) in context.items()
        if key.startswith('month_name_')
    }
    context['month_names'] = month_names_dict

    return context


def add_day_names(context):
    """Adds day names in the requested language and case to the given
    `context` dict—both as separate items and as a dict

    :param context: Dict with context information
    :return: The `context` dict with added day names in requested case
    """

    language = context['day_language']
    if language in default_names['days']:  # i.e. not custom
        default_day_names = default_names['days'][language]
        
        # Add items per day in the proper case to the context
        default_day_names = {
            key: convert_case(value, context['day_case'])
            for (key, value) in default_day_names.items()
        }
        context.update(default_day_names)

    # Convert day name items to a dict, even when they are custom
    if context['day_abbreviated'] == 'true':
        day_abbreviated_length = int(context['day_abbreviated_length'])
        day_names_dict = {
            key.split('_')[-1]: value[:day_abbreviated_length]
            for (key, value) in context.items()
            if key.startswith('day_name_')
        }
    else:
        day_names_dict = {
            key.split('_')[-1]: value
            for (key, value) in context.items()
            if key.startswith('day_name_')
        }
    context['day_names'] = day_names_dict

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
