import firebase_admin
import os
from firebase_admin import credentials, firestore

# Initialize Firestore DB

if not os.path.isfile("./key.json"):
    f = open("./key.json", "w")
    f.write(os.environ['FIREBASE_KEY'])
    f.close()

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://rank-db-a0fb9.firebaseio.com'
})
db = firestore.client()


def getDBClient(dbName):
    if (dbName):
        return db.collection(dbName)
    else:
        return db
