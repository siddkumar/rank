from flask import Blueprint, request, jsonify
from db import getDBClient

usersAPI = Blueprint('users', __name__)
db = getDBClient('users')


@usersAPI.route("/users/list", methods=['GET'])
def read():
    try:
        # Check if ID was passed to URL query
        userId = request.args.get('id')
        if userId:
            user = db.document(userId).get()
            return jsonify(user.to_dict()), 200
        else:
            allUsers = [u.to_dict() for u in db.stream()]
            return jsonify(allUsers), 200
    except Exception as e:
        return f"An Error Occured: {e}"
