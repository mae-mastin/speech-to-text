from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
from generator import generate_score

# Creating the flask object
app = Flask(__name__)
CORS(app)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


# Adding a route for the home page
@app.route('/', methods=["GET", "POST"])
#@app.route('/index', methods=["GET", "POST"])
def index():
    if request.method == "POST":
        jsonData = request.get_json()
        with open("sample.json", "w") as outfile:
            outfile.write(jsonData)
        #return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        return 'OK'
    return render_template("record.html")

@app.route('/test/<string:final_transcript>', methods=['POST'])
def test(final_transcript):
    final_transcript = json.loads(final_transcript)
    return generate_score(final_transcript)

# When this Python script is called this command is called too, to actively
# host the routes on a local server, to change the port (like 5000 or 3000)
# run app.run(debug=True, port = 3000), app.run MUST be placed at the end of
# the script
app.run(debug=True, port=3000,threaded=True)