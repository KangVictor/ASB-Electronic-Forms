from flask import Flask
import random
app = Flask(__name__)

@app.route('/test', methods=['GET'])
def test():
	return str(random.randint(1,10000))
