import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firestore DB


def getDBClient(dbName):
    cred = credentials.Certificate("./key.json")
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://rank-db-a0fb9.firebaseio.com'
    })
    db = firestore.client()

    if (dbName):
        return db.collection('users')
    else:
        return db
