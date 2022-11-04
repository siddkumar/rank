# Required Imports
import firebase_admin
import os
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore
from bs4 import BeautifulSoup
import json

# Initialize Flask App
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

if not os.path.isfile("./key.json"):
    print("could not find credentials file")

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://rank-db-a0fb9.firebaseio.com'
})
db = firestore.client()

rankdb = db.collection('ranks')
usersdb = db.collection('users')
templatesdb = db.collection('templates')


@app.route("/templates/createFromScratch", methods=['POST'])
def templatesCreate():
    try:
        name = request.json['name']
        items = request.json['items']
        email = request.json['email']

        userId = "og-user"

        if (email):
            usersMatchEmail = usersdb.where(u'emailAddress', u'==', email)
            user = usersMatchEmail.get()
            for u in user:
                userId = u.id

        # remove duplicates
        filtered = []
        [filtered.append(x) for x in items if x not in filtered]

        data = {
            u'createdBy': userId,
            u'items': filtered,
            u'name': name,
            u'origin': 'scratch',
            u'sourceUrl': ""
        }

        newTemplate = templatesdb.document()
        newTemplate.set(data)
        response = jsonify(
            {"success": True, "templateId": newTemplate.id}, 200)
        return response
    except Exception as e:
        return f"An Error Occured:{e}"


@app.route("/templates", methods=["GET"])
def templatesRead():
    try:
        templateId = request.args.get('id')
        email = request.args.get('email')
        if (templateId):
            template = templatesdb.document(templateId).get().to_dict()
            # remove duplicates
            items = template['items']
            filtered = []
            [filtered.append(x) for x in items if x not in filtered]
            data = {
                u'createdBy': 'og-user',
                u'items': filtered,
                u'name': template['name'],
                u'origin': template['origin'],
                u'sourceUrl': template['sourceUrl']
            }
            return jsonify(data), 200
        elif(email):
            usersMatchEmail = usersdb.where(u'emailAddress', u'==', email)
            user = usersMatchEmail.get()
            r = []
            for u in user:
                templates = templatesdb.where(u'createdBy', u'==', u.id).get()
                for temp in templates:
                    t = temp.to_dict()
                    data = {
                        u'name': t['name'],
                        u'id': temp.id
                    }
                    r.append(data)

            return json.dumps(r), 200
        else:
            # Get Featured Templates
            r = []
            templates = templatesdb.where(u'featured', u'==', True).get()
            for temp in templates:
                t = temp.to_dict()
                data = {
                    u'name': t['name'],
                    u'id': temp.id
                }
                r.append(data)
            return json.dumps(r), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route("/users/create", methods=['POST'])
def usersCreate():
    try:
        emailAddress = request.json['emailAddress']

        docs = usersdb.where(u'emailAddress', u'==', emailAddress).stream()
        for doc in docs:
            return f"An Error Occured: User with that email already exists"

        data = {
            u'emailAddress': emailAddress,
        }

        newUser = usersdb.document()
        newUser.set(data)
        response = jsonify(
            {"success": True, "userId": newUser.id}, 200)
        return response
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route("/ranks", methods=['GET'])
def ranksRead():
    try:
        emailAddress = request.args.get('email')
        id = request.args.get('id')

        if(id):
            rank = rankdb.document(id).get().to_dict()
            data = {
                u'ranking': rank['ranking'],
                u'name': rank['name']
            }
            return jsonify(data), 200
        elif(emailAddress):
            usersMatchEmail = usersdb.where(
                u'emailAddress', u'==', emailAddress)
            user = usersMatchEmail.get()
            response = []
            for u in user:
                ranks = rankdb.where(u'rankedBy', u'==', u.id).get()
                for rank in ranks:
                    r = rank.to_dict()
                    data = {
                        u'name': r['name'],
                        u'id': rank.id,
                        u'templateId': r['templateId']
                    }
                    response.append(data)
            return json.dumps(response), 200
        else:
            return f"bad params"

    except Exception as e:
        print("an error occurred")
        return f"An Error Occured: " + str(e)


@app.route("/ranks/create", methods=['POST'])
def ranksCreate():
    try:
        emailAddress = request.json['emailAddress']
        templateId = request.json['templateId']
        ranking = request.json['ranking']

        usersMatchEmail = usersdb.where(u'emailAddress', u'==', emailAddress)

        user = usersMatchEmail.get()

        for u in user:
            template = templatesdb.document(templateId).get()

            data = {
                u'rankedBy': u.id,
                u'templateId': template.id,
                u'ranking': ranking,
                u'name': template.to_dict()['name']
            }

            newRanking = rankdb.document()
            newRanking.set(data)

            response = jsonify({"success": True, "rankId": newRanking.id}, 200)
            return response
    except Exception as e:
        return f"An Error Occured"


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
