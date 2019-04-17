from flask import Flask, request,jsonify
import random
app = Flask(__name__)

@app.route('/test', methods=['GET'])
def test():
	return str(random.randint(10000,99999))

@app.route('/input', methods=['POST'])
def input():
	if request.is_json:
		getInput = request.get_json()
		print getInput
		print "hi"
		return "hello"
		# return str(getInput['hi'])