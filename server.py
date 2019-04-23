from flask import Flask, request, jsonify
import random
import json

app = Flask(__name__)

@app.route('/getitem', methods=['GET'])
def getItem():
	itemName = ['Watergun Red', 'Watergun Green', 'Watergun Blue']
	itemPrice = [10, 11, 12, 0]
	itemNum = 3  # number of items
	return jsonify({'itemName': itemName, 'itemPrice': itemPrice, 'itemNum': itemNum})

@app.route('/create/order', methods=['POST'])
def create_order():
	if request.is_json:
		wxBuyerInput = request.get_json()
		num = random.randint(10000,99999)
		print(wxBuyerInput)
		studentName = wxBuyerInput['BuyerName']
		studentGrade = wxBuyerInput['BuyerGrade']
		studentClass = wxBuyerInput['BuyerClass']
		studentCost = wxBuyerInput['BuyerCost']
		reply = str(studentName + " from " + studentClass + "\n code: " + str(num))
		print (jsonify({'message':"succses"}))
		return jsonify({'message':"succses"})
		# return str(json.dumps({'statusCode': 200, 'data': {'foo': 'bar'}}))
	else:
		return str(json.dumps({'statusCode': 400, 'errMsg': 'expecting POST json'}))
