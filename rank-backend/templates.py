from flask import Blueprint, request, jsonify
from db import getDBClient

templatesAPI = Blueprint('templates', __name__)
db = getDBClient('templates')


@templatesAPI.route("/templates/createFromScratch", methods=['POST'])
def create():
    """
    """
    try:
        name = request.json['name']
        items = request.json['items']
        userId = request.json['userId']

        data = {
            u'createdBy': 'users/' + userId,
            u'items': items,
            u'name': name,
            u'orign': 'scratch',
            u'sourceUrl': ""
        }

        newTemplate = db.document()
        newTemplate.set(data)
        response = jsonify(
            {"success": True, "templateId": newTemplate.id}, 200)
        return response

    except Exception as e:
        return f"An Error Occured:{e}"
