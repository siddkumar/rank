from flask import Blueprint
from db import getDBClient

templates = Blueprint('ranks', __name__)
db = getDBClient('ranks')
