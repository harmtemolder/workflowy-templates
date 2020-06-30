def generate_html_list(context):
    """Take a `context` and use it to generate an HTML list containing a
    calendar formatted as requested

    :param context: Dict with context information
    :return: An HTML list as string
    """

    return ('<li>--------------------</li>'
            '<li><a href="#" class="select_link" data-selector="#output">Select output</a></li>'
            '<li>--------------------</li>'
            '<span id="output">...</span>')
