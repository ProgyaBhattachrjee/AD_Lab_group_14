from flask import Flask, request, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

selected_company = None  # ✅ Global variable to store selected company

@app.route('/api/selectCompany', methods=['POST'])
def select_company():
    global selected_company
    data = request.get_json()
    selected_company = data.get("selectedCompany")  # ✅ Store in global variable

    if selected_company:
        print(f"Selected Company Ticker: {selected_company}")  # ✅ Debugging

    return jsonify({"message": f"Company {selected_company} selected"}), 200

@app.route('/api/indicators', methods=['GET'])
def get_indicators():
    global selected_company

    if not selected_company:
        return jsonify({"error": "No company selected"}), 400

    print(f"Fetching indicators for: {selected_company}")  # ✅ Debugging

    data = yf.download(selected_company, start='2023-01-01', end='2024-01-01')

    indicators = {
        "SMA_20": data['Close'].rolling(window=20).mean().dropna().tolist(),
        "SMA_50": data['Close'].rolling(window=50).mean().dropna().tolist(),
        "RSI_14": (100 - (100 / (1 + data['Close'].diff().rolling(14).mean() / data['Close'].diff().rolling(14).std()))).dropna().tolist()
    }

    return jsonify({"company": selected_company, "indicators": indicators})

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
