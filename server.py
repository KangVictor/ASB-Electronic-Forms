from flask import Flask, request,jsonify
import random
app = Flask(__name__)

@app.route('/input', methods=['POST'])
def input():
	if request.is_json:
		getInput = request.get_json()
		num = random.randint(10000,99999)
		return str("Your name is " + getInput['name'] + "\n code: " + str(num))