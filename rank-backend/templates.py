from flask import Blueprint, request, jsonify
from db import getDBClient
import json

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
            u'origin': 'scratch',
            u'sourceUrl': ""
        }

        newTemplate = db.document()
        newTemplate.set(data)
        response = jsonify(
            {"success": True, "templateId": newTemplate.id}, 200)
        return response
    except Exception as e:
        return f"An Error Occured:{e}"


@templatesAPI.route("/templates", methods=["GET"])
def read():
    try:
        templateId = request.args.get('id')
        if (templateId):
            template = db.document(templateId).get().to_dict()
            data = {
                u'createdBy': 'og-user',
                u'items': template['items'],
                u'name': template['name'],
                u'origin': template['origin'],
                u'sourceUrl': template['sourceUrl']
            }
            return jsonify(data), 200
        else:
            allTemplates = db.stream()
            r = []
            for template in allTemplates:
                t = template.to_dict()
                data = {
                    u'createdBy': 'og-user',
                    u'items': t['items'],
                    u'name': t['name'],
                    u'origin': t['origin'],
                    u'sourceUrl': t['sourceUrl'],
                    u'id': template.id
                }
                r.append(data)
            return json.dumps(r), 200
    except Exception as e:
        return f"An Error Occured: {e}"
