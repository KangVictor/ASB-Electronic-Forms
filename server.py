from flask import Flask, request, jsonify
import random
import json

app = Flask(__name__)

@app.route('/create/order', methods=['POST'])
def create_order():
	if request.is_json:
		wxBuyerInput = request.get_json()
		num = random.randint(10000,99999)
		studentName = wxBuyerInput['studentName']
		studentClass = wxBuyerInput['studentClass']
		reply = studentName + " from " + studentClass + "\n code: " + str(num)
		return str(json.dumps({'statusCode': 200, 'data': {'foo': 'bar'}}))
	return str(json.dumps({'statusCode': 400, 'errMsg': 'expecting POST json'}))
