# import pandas as pd
# import yfinance as yf
# import numpy as np

# # Fetch historical data for a specific ticker
# ticker = 'AAPL'
# data = yf.download(ticker, start='2022-01-01', end='2023-01-01')

# # Ensure 'Close' and 'Volume' columns are present
# if 'Close' not in data.columns or 'Volume' not in data.columns:
#     raise ValueError("The fetched data does not contain 'Close' or 'Volume' columns.")

# # Calculate Simple Moving Average (SMA)
# data['SMA20'] = data['Close'].rolling(window=20).mean()
# data['SMA50'] = data['Close'].rolling(window=50).mean()

# # Calculate Exponential Moving Average (EMA)
# data['EMA20'] = data['Close'].ewm(span=20, adjust=False).mean()

# # Calculate MACD
# data['EMA12'] = data['Close'].ewm(span=12, adjust=False).mean()
# data['EMA26'] = data['Close'].ewm(span=26, adjust=False).mean()
# data['MACD'] = data['EMA12'] - data['EMA26']
# data['MACD_signal'] = data['MACD'].ewm(span=9, adjust=False).mean()
# data['MACD_hist'] = data['MACD'] - data['MACD_signal']

# # Calculate Relative Strength Index (RSI)
# def calculate_rsi(series, window):
#     delta = series.diff()
#     gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
#     loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
#     rs = gain / loss
#     rsi = 100 - (100 / (1 + rs))
#     return rsi

# data['RSI'] = calculate_rsi(data['Close'], window=14)

# # Calculate On-Balance Volume (OBV)
# data['OBV'] = (np.sign(data['Close'].diff()) * data['Volume']).fillna(0).cumsum()

# # Calculate Money Flow Index (MFI)
# typical_price = (data['High'] + data['Low'] + data['Close']) / 3
# money_flow = typical_price * data['Volume']
# positive_flow = money_flow.where(data['Close'] > data['Close'].shift(1), 0).rolling(window=14).sum()
# negative_flow = money_flow.where(data['Close'] < data['Close'].shift(1), 0).rolling(window=14).sum()
# data['MFI'] = 100 - (100 / (1 + (positive_flow / negative_flow)))

# # Display the DataFrame with the calculated indicators
# print(data[['Close', 'SMA20', 'SMA50', 'EMA20', 'MACD', 'MACD_signal', 'MACD_hist', 'RSI', 'OBV', 'MFI']].tail())