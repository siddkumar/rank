from flask import Blueprint
from db import getDBClient

ranksAPI = Blueprint('ranks', __name__)
db = getDBClient('ranks')
