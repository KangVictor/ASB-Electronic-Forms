from flask import Flask, request,jsonify
import random
app = Flask(__name__)

@app.route('/create/order', methods=['POST'])
def create_order():
	if request.is_json:
		wxBuyerInput = request.get_json()
		num = random.randint(10000,99999)
		BuyerName = wxBuyerInput['BuyerName']
		BuyerClass = wxBuyerInput['BuyerClass']
		return str(BuyerName + " from " + BuyerClass + "\n code: " + str(num))
