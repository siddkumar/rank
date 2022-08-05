from flask import Blueprint
from db import getDBClient

templates = Blueprint('templates', __name__)
db = getDBClient('templates')
