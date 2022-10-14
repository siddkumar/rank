from flask import Blueprint, request, jsonify
from db import getDBClient

ranksAPI = Blueprint('ranks', __name__)
db = getDBClient('ranks')


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
                u'ranking': ranking
            }

            newRanking = db.document()
            newRanking.set(data)

            response = jsonify({"success": True, "rankId": newRanking.id}, 200)
            return response
    except Exception as e:
        return f"An Error Occured"
