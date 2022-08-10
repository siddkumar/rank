# Required Imports
import os
from flask import Flask
from flask_cors import CORS
from users import usersAPI
from templates import templatesAPI

# Initialize Flask App
app = Flask(__name__)
cors = CORS(app)

# Register Controllers
app.register_blueprint(usersAPI)
app.register_blueprint(templatesAPI)

port = int(os.environ.get('PORT', 8080))

if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
