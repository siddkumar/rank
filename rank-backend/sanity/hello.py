import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://rank-db-a0fb9.firebaseio.com'
})

db = firestore.client()

for k in db.collection("users").get():
    print(k.id, k.to_dict())