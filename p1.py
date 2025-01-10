import yfinance as yf
import json
tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NFLX', 'NVDA', 'JPM', 'BA']
start_date = '2018-01-01'
end_date = '2023-12-31'
data = {}
for ticker in tickers:
    print(f"Downloading data for {ticker}...")
    stock_data = yf.download(ticker, start=start_date, end=end_date)
    stock_data.reset_index(inplace=True) 
    stock_data['Date'] = stock_data['Date'].dt.strftime('%Y-%m-%d') 
    stock_data.columns = [str(col) for col in stock_data.columns] 
    data[ticker] = stock_data.to_dict(orient='records') 
with open('financial_data.json', 'w') as file:
    json.dump(data, file, indent=4)

print("Data saved to financial_data.json")
