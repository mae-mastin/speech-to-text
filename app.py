from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

# Creating the flask object
app = Flask(__name__)
CORS(app)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


# Adding a route for the home page
@app.route('/')
def index():
    return render_template("record.html")


# When this Python script is called this command is called too, to actively
# host the routes on a local server, to change the port (like 5000 or 3000)
# run app.run(debug=True, port = 3000), app.run MUST be placed at the end of
# the script
app.run(debug=True, port=3000,threaded=True)