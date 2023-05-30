# Required Imports
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup

# Initialize Flask App
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/parser/parseLink", methods=['POST'])
def parse():
    try:
        link = request.json['link']
        html = requests.get(link).text
        soup = BeautifulSoup(html, 'html.parser')

        tablesAndHeaders = soup.find_all(["h1", "h2", "h3", "table"])

        listOfTableTuples = []
        likelyTableName = ""
        for e in tablesAndHeaders:
            if (e.name == "table"):
                if(e.has_attr('class') and "wikitable" in e["class"]):
                    rows, numRows, numCols = pre_process_table(e)
                    cols = []

                    colNames = []
                    maxRow = 1
                    for j, cell in enumerate(rows[0].find_all(['td', 'th'])):
                        rep_row, rep_col = get_spans(cell)
                        if rep_row > maxRow:
                            maxRow = rep_row
                        for i in range(0, rep_col):
                            colNames.append(clean_string(cell.text))
                            potentialTemplate = {
                                u'templateName': clean_string(cell.text),
                                u'templateItems': []
                            }
                            cols.append(potentialTemplate)

                    stuffs = []
                    for r in range(maxRow, numRows):
                        row = []
                        column_span_starter = 0
                        for j, cell in enumerate(rows[r].find_all(['td', 'th'])):
                            rep_row, rep_col = get_spans(cell)
                            row.append(
                                {'rowSize': rep_row, 'colSize': rep_col, 'text': clean_string(
                                    cell.text), 'colSpanStarter': column_span_starter}
                            )
                            column_span_starter += rep_col
                        stuffs.append(row)

                    for c in range(numCols):
                        items = []
                        r = 0
                        while r < len(stuffs):
                            if (len(stuffs[r]) == 0):
                                r += 1
                                continue
                            i = stuffs[r]
                            popped = i.pop(0)
                            items.append(popped['text'])
                            r += popped['rowSize']
                        cols[c]['templateItems'] = items
                    tableTuple = {
                        u'tableName': likelyTableName,
                        u'potentialTemplates': cols
                    }
                    listOfTableTuples.append(tableTuple)
                else:
                    continue
            else:
                likelyTableName = clean_string(e.text)

        data = {
            u'tables': listOfTableTuples
        }
        return jsonify(data), 200
    except Exception as e:
        return f"An Error Occured:{e}"


def clean_string(s):
    stripped_string = s.strip()
    response = re.sub("[\(\[].*?[\)\]]", "", stripped_string)
    return response


def pre_process_table(table):
    """
    INPUT:
        1. table - a bs4 element that contains the desired table: ie <table> ... </table>
    OUTPUT:
        a tuple of:
            1. rows - a list of table rows ie: list of <tr>...</tr> elements
            2. num_rows - number of rows in the table
            3. num_cols - number of columns in the table
    Options:
        include_td_head_count - whether to use only th or th and td to count number of columns (default: False)
    """
    rows = [x for x in table.find_all('tr')]

    num_rows = len(rows)

    # get an initial column count. Most often, this will be accurate
    num_cols = max([len(x.find_all(['th', 'td'])) for x in rows])

    # sometimes, the tables also contain multi-colspan headers. This accounts for that:
    header_rows_set = [x.find_all(['th', 'td']) for x in rows if len(
        x.find_all(['th', 'td'])) > num_cols/2]

    num_cols_set = []

    for header_rows in header_rows_set:
        num_cols = 0
        for cell in header_rows:
            row_span, col_span = get_spans(cell)
            num_cols += len([cell.getText()]*col_span)

        num_cols_set.append(num_cols)

    num_cols = max(num_cols_set)

    return (rows, num_rows, num_cols)


def get_spans(cell):
    """
    INPUT:
        1. cell - a <td>...</td> or <th>...</th> element that contains a table cell entry
    OUTPUT:
        1. a tuple with the cell's row and col spans
    """
    if cell.has_attr('rowspan'):
        rep_row = int(cell.attrs['rowspan'])
    else:  # ~cell.has_attr('rowspan'):
        rep_row = 1
    if cell.has_attr('colspan'):
        rep_col = int(cell.attrs['colspan'])
    else:  # ~cell.has_attr('colspan'):
        rep_col = 1

    return (rep_row, rep_col)


@app.route('/')
def home():
    return 'Home Page Route'
