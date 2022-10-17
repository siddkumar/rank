# Required Imports
from flask import Flask, jsonify
from flask_cors import CORS
from users import usersAPI
from parser import parserAPI
from ranks import ranksAPI
from templates import templatesAPI

# Initialize Flask App
app = Flask(__name__)
cors = CORS(app)

# Register Controllers
app.register_blueprint(usersAPI)
app.register_blueprint(templatesAPI)
app.register_blueprint(ranksAPI)
app.register_blueprint(parserAPI)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    print(path)
    return jsonify("You visited: " + path)
