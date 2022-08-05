# Required Imports
import os
from flask import Flask
from users import usersAPI

# Initialize Flask App
app = Flask(__name__)

# Register Controllers
app.register_blueprint(usersAPI)

port = int(os.environ.get('PORT', 8080))

if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)
