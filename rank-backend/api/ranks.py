import json
from flask import Blueprint, request, jsonify
from db import getDBClient

ranksAPI = Blueprint('ranks', __name__)
db = getDBClient('ranks')


@ranksAPI.route("/ranks", methods=['GET'])
def read():
    try:
        emailAddress = request.args.get('email')
        id = request.args.get('id')

        if(id):
            rank = db.document(id).get().to_dict()
            data = {
                u'ranking': rank['ranking'],
                u'name': rank['name']
            }
            return jsonify(data), 200
        elif(emailAddress):
            users = getDBClient('users')
            usersMatchEmail = users.where(u'emailAddress', u'==', emailAddress)
            user = usersMatchEmail.get()
            response = []
            for u in user:
                ranks = db.where(u'rankedBy', u'==', u.id).get()
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


@ranksAPI.route("/ranks/create", methods=['POST'])
def create():
    try:
        emailAddress = request.json['emailAddress']
        templateId = request.json['templateId']
        ranking = request.json['ranking']

        users = getDBClient('users')
        usersMatchEmail = users.where(u'emailAddress', u'==', emailAddress)

        user = usersMatchEmail.get()

        for u in user:
            templates = getDBClient('templates')
            template = templates.document(templateId).get()

            data = {
                u'rankedBy': u.id,
                u'templateId': template.id,
                u'ranking': ranking,
                u'name': template.to_dict()['name']
            }

            newRanking = db.document()
            newRanking.set(data)

            response = jsonify({"success": True, "rankId": newRanking.id}, 200)
            return response
    except Exception as e:
        return f"An Error Occured"
