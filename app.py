from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
from generator import get_image
from PIL import Image
import io
import base64

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
        print('new_image')
        # # print(jsonData)
        get_image(jsonData)

    im = Image.open('static/image.jpg')
    data = io.BytesIO()
    im.save(data, 'JPEG')
    encoded_img_data = base64.b64encode(data.getvalue())
    #with open("sample.json", "w") as outfile:
        #   outfile.write(jsonData)

       # return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    return render_template("record.html", img_data=encoded_img_data.decode('utf-8'))


# When this Python script is called this command is called too, to actively
# host the routes on a local server, to change the port (like 5000 or 3000)
# run app.run(debug=True, port = 3000), app.run MUST be placed at the end of
# the script
if __name__ == '__main__':
    app.run()