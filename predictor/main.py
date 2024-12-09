from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

def download_stock_data(ticker, start_date, end_date):
    # data = yf.download(ticker, start=start_date, end=end_date)
    data = ticker.history(start=start_date, end=end_date)
    print(data)
    if data.empty:
        raise ValueError("No data found. Please check the ticker and date range.")
    return data

# Step 2: Preprocess Data
def preprocess_data_for_classification(data, sequence_length=60):
    # Use only the 'Close' column
    data = data[['Close']]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Create sequences and binary target
    X, y = [], []
    for i in range(sequence_length, len(scaled_data) - 1):
        X.append(scaled_data[i-sequence_length:i, 0])
        y.append(1 if scaled_data[i+1, 0] > scaled_data[i, 0] else 0)  # Binary classification: Increase (1), Decrease (0)

    X, y = np.array(X), np.array(y)
    return X, y, scaler, scaled_data

# Step 3: Preprocess Data for Regression
def preprocess_data_for_regression(data, sequence_length=60):
    data = data[['Close']]
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    X, y = [], []
    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i-sequence_length:i, 0])
        y.append(scaled_data[i, 0])

    X, y = np.array(X), np.array(y)
    print(X, y, scaler)
    return X, y, scaler

# Step 4: Train Logistic Regression
def train_logistic_regression(X_train, y_train):
    model = LogisticRegression(max_iter=1000)  # Increased iterations for convergence
    model.fit(X_train, y_train)
    print("OK")
    return model

# Step 5: Train Linear Regression for Price Prediction
def train_linear_regression(X_train, y_train):
    model = LinearRegression()
    model.fit(X_train, y_train)
    print("ok2")
    return model


@app.route('/api/prediction', methods=['GET'])
def predict_stock():
    try:
        # User Inputs
        ticker_name = request.args.get('name')
        months = int(request.args.get('month'))
        print(ticker_name, months)
        end_date = datetime.now()
        ticker=yf.Ticker(ticker_name)
        start_date = end_date - timedelta(days=months * 30)
        sequence_length = 60
        print(ticker, months, end_date, start_date, sequence_length)

        # Download and preprocess data
        stock_data = download_stock_data(ticker, start_date, end_date)
        X_class, y_class, scaler_class, scaled_data = preprocess_data_for_classification(stock_data, sequence_length)
        X_reg, y_reg, scaler_reg = preprocess_data_for_regression(stock_data, sequence_length)

        # Check dataset size and dynamically adjust test_size
        if len(X_class) == 0 or len(X_reg) == 0:
            raise ValueError("Insufficient data to create sequences. Please use a larger date range or shorter sequence length.")
        
        test_size = min(0.2, len(X_class) / 2)  # Adjust test size if the dataset is small
        X_train_class, X_test_class, y_train_class, y_test_class = train_test_split(X_class, y_class, test_size=test_size, random_state=42)
        X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(X_reg, y_reg, test_size=test_size, random_state=42)

        # Validate training set size
        if len(X_train_class) < 10 or len(X_train_reg) < 10:
            raise ValueError("Training data size is too small for meaningful training.")

        # Train Logistic Regression Model
        model_class = train_logistic_regression(X_train_class, y_train_class)

        # Train Linear Regression Model
        model_reg = train_linear_regression(X_train_reg, y_train_reg)

        # Evaluate Logistic Regression Model
        # y_pred_class = evaluate_model(model_class, X_test_class, y_test_class)

        # Predict next day's movement
        recent_data_class = X_class[-1].reshape(1, -1)  # Last sequence for movement prediction
        next_day_movement = model_class.predict(recent_data_class)[0]
        movement = "Increase" if next_day_movement == 1 else "Decrease"

        # Predict next day's price
        recent_data_reg = X_reg[-1].reshape(1, -1)  # Last sequence for price prediction
        next_day_price_scaled = model_reg.predict(recent_data_reg)[0]
        next_day_price = scaler_reg.inverse_transform([[next_day_price_scaled]])[0][0]

        # Output results
        start_day_price = stock_data['Close'].iloc[0]
        end_day_price = stock_data['Close'].iloc[-1]

        print(f"Start day stock value: {start_day_price}")
        print(f"End day stock value: {end_day_price}")
        print(f"Predicted next day's price movement: {movement}")
        print(f"Predicted next day's closing price: {next_day_price}")

        return jsonify({'sdp': start_day_price, 'edp': end_day_price, 'move': movement, 'ndp': next_day_price}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/api/ml3', methods=['GET'])
def get_stock_dataa():
        # Get the 'ind' query parameter
    try:
        ind = request.args.get('ind')

        # Handle missing or invalid 'ind'
        if ind is None:
            return jsonify({'error': 'Parameter "ind" is missing'}), 400

        
        # Split the string into a list
        ind_list = ind.split(',')
        # print(ind_list)
        # print(ind_list[0])    
        #find the open, close, high, low, volume, and date of the stocks in the list for last date and return them in an array of objects
        formatted_data = []
        for i in ind_list:
            ticker = yf.Ticker(i)
            # print(ticker)
            hist = ticker.history(period='1mo')
            info = ticker.info
            # print(hist)
            # print("ioio ",len(hist)-1)
            data_point = {
                'Date': hist.index[len(hist)-1].strftime('%Y-%m-%d'),
                'Open': float(hist['Open'].iloc[len(hist)-1]),
                'High': float(hist['High'].iloc[len(hist)-1]),
                'Low': float(hist['Low'].iloc[len(hist)-1]),
                'Close': float(hist['Close'].iloc[len(hist)-1]),
                'Volume': int(hist['Volume'].iloc[len(hist)-1]),
                'symbol': i,
                'fiftyTwoWeekHigh': info.get('fiftyTwoWeekHigh', 'USD'),
                'fiftyTwoWeekLow': info.get('fiftyTwoWeekLow', 'USD'),
                'fiftyDayAverage': info.get('fiftyDayAverage', 'USD'),   
                'CompanyName': info.get('longName', i),     
            }
            formatted_data.append(data_point)
        return jsonify({'data': formatted_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/news', methods=['GET'])
def get_news_data():
    tick= request.args.get('tick')
    try:
        ticker = yf.Ticker(tick)
        news = ticker.news
        return jsonify({'data': news}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/strategy', methods=['GET'])
def get_strategy_data():
    try:
        # Get parameters from the request
        ticker_name = request.args.get('name')
        months = int(request.args.get('month'))
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months * 30)
        
        ticker = yf.Ticker(ticker_name)
        
        # Fetch historical data
        ticker_data = ticker.history(start=start_date, end=end_date)
        if ticker_data.empty:
            return jsonify({"error": "Invalid ticker name or no data found"}), 404
        
        # Ensure data integrity
        ticker_data = ticker_data.dropna()

        # Bollinger Bands Strategy (BBS)
        def calculate_bollinger_bands(data, window=20):
            data['SMA'] = data['Close'].rolling(window).mean()
            data['STD'] = data['Close'].rolling(window).std()
            data['BB_upper'] = data['SMA'] + (2 * data['STD'])
            data['BB_lower'] = data['SMA'] - (2 * data['STD'])
            return data

        ticker_data = calculate_bollinger_bands(ticker_data)

        def bbs_signal(row):
            if row['Close'] < row['BB_lower']:
                return 1  # Buy
            elif row['Close'] > row['BB_upper']:
                return -1  # Sell
            else:
                return 0  # Hold

        ticker_data['BBS'] = ticker_data.apply(bbs_signal, axis=1)

        # Moving Average Crossover Strategy (MAC)
        def calculate_moving_averages(data, short_window=9, long_window=21):
            data['Short_MA'] = data['Close'].rolling(short_window).mean()
            data['Long_MA'] = data['Close'].rolling(long_window).mean()
            return data

        ticker_data = calculate_moving_averages(ticker_data)

        def mac_signal(row):
            if row['Short_MA'] > row['Long_MA']:
                return 1  # Buy
            elif row['Short_MA'] < row['Long_MA']:
                return -1  # Sell
            else:
                return 0  # Hold

        ticker_data['MAC'] = ticker_data.apply(mac_signal, axis=1)

        # RSI Strategy (RSIS)
        def calculate_rsi(data, window=14):
            delta = data['Close'].diff()
            gain = delta.where(delta > 0, 0)
            loss = -delta.where(delta < 0, 0)
            avg_gain = gain.rolling(window).mean()
            avg_loss = loss.rolling(window).mean()
            rs = avg_gain / avg_loss
            data['RSI'] = 100 - (100 / (1 + rs))
            return data

        ticker_data = calculate_rsi(ticker_data)

        def rsi_signal(rsi_value):
            if rsi_value < 30:
                return 1  # Buy
            elif rsi_value > 70:
                return -1  # Sell
            else:
                return 0  # Hold

        ticker_data['RSIS'] = ticker_data['RSI'].apply(lambda x: rsi_signal(x) if pd.notna(x) else 0)

        # Exponential Moving Average Crossover Strategy (EMA)
        def calculate_ema(data, short_window=12, long_window=26):
            data['Short_EMA'] = data['Close'].ewm(span=short_window, adjust=False).mean()
            data['Long_EMA'] = data['Close'].ewm(span=long_window, adjust=False).mean()
            return data

        ticker_data = calculate_ema(ticker_data)

        def ema_signal(row):
            if row['Short_EMA'] > row['Long_EMA']:
                return 1  # Buy
            elif row['Short_EMA'] < row['Long_EMA']:
                return -1  # Sell
            else:
                return 0  # Hold

        ticker_data['EMA'] = ticker_data.apply(ema_signal, axis=1)

        # Stochastic Oscillator Strategy
        def calculate_stochastic(data, k_window=14, d_window=3):
            data['L14'] = data['Low'].rolling(window=k_window).min()
            data['H14'] = data['High'].rolling(window=k_window).max()
            data['%K'] = (data['Close'] - data['L14']) / (data['H14'] - data['L14']) * 100
            data['%D'] = data['%K'].rolling(window=d_window).mean()
            return data

        ticker_data = calculate_stochastic(ticker_data)

        def stochastic_signal(row):
            if row['%K'] < 20 and row['%K'] < row['%D']:
                return 1  # Buy
            elif row['%K'] > 80 and row['%K'] > row['%D']:
                return -1  # Sell
            else:
                return 0  # Hold

        ticker_data['Stochastic'] = ticker_data.apply(stochastic_signal, axis=1)

        # Average True Range (ATR)
        def calculate_atr(data, window=14):
            data['TR'] = data[['High', 'Low', 'Close']].apply(
                lambda x: max(x[0] - x[1], abs(x[0] - x[2]), abs(x[1] - x[2])), axis=1)
            data['ATR'] = data['TR'].rolling(window).mean()
            return data

        ticker_data = calculate_atr(ticker_data)

        def atr_signal(row, threshold=0.05):
            if row['ATR'] / row['Close'] > threshold:
                return 1  # Buy
            else:
                return 0  # Hold

        ticker_data['ATR_Signal'] = ticker_data.apply(lambda row: atr_signal(row), axis=1)

        # Collect the most recent signals
        allresult = {
            'BBS': int(ticker_data['BBS'].iloc[-1]),
            'MAC': int(ticker_data['MAC'].iloc[-1]),
            'RSIS': int(ticker_data['RSIS'].iloc[-1]),
            'EMA': int(ticker_data['EMA'].iloc[-1]),
            'Stochastic': int(ticker_data['Stochastic'].iloc[-1]),
            'ATR': int(ticker_data['ATR_Signal'].iloc[-1])
        }

        return jsonify(allresult)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/ml2', methods=['GET'])
def get_stock_data():
    try:
        # Get parameters from request
        ticker_name = request.args.get('name')
        months = int(request.args.get('month'))
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months*30)
        
        # Fetch data from yfinance
        ticker = yf.Ticker(ticker_name)
        hist = ticker.history(start=start_date, end=end_date)
        info = ticker.info


        formatted_data = []
        
        for i in range(len(hist)):
            data_point = {
                'Date': hist.index[i].strftime('%Y-%m-%d'),
                'Open': float(hist['Open'].iloc[i]),
                'High': float(hist['High'].iloc[i]),
                'Low': float(hist['Low'].iloc[i]),
                'Close': float(hist['Close'].iloc[i]),
                'Volume': int(hist['Volume'].iloc[i]),
                'CompanyName': info.get('longName', ticker_name),
                'Currency': info.get('currency', 'USD')
            }
            formatted_data.append(data_point)
        
       
        return jsonify({'data': formatted_data, 'info': info}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/indicator', methods=['GET'])
def get_indicator_data():

    try:
        # Get parameters from request
        ticker_name = request.args.get('name')
        months = int(request.args.get('month'))
        indicator= request.args.get('indicator')
        # write functions for each possible values of indicator  'SMA', 'EMA', 'RSI', 'MACD', 'BB', 'SO', 'ATR', 'IC', 'VWAP', 'MFI'

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=months*30)

        # Fetch data from yfinance
        ticker = yf.Ticker(ticker_name)
        hist = ticker.history(start=start_date, end=end_date)
        info = ticker.info

        # Convert the data to array of objects format
        formatted_data = []

        if indicator == 'SMA':
            sma = hist['Close'].rolling(window=20).mean()
            for i in range(len(hist)):
                if pd.isnull(sma.iloc[i]):
                    continue
                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'Close': float(hist['Close'].iloc[i]),
                    'SMA': float(sma.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'EMA':
            ema = hist['Close'].ewm(span=20, adjust=False).mean()

            for i in range(len(hist)):
                if pd.isnull(ema.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'Close': float(hist['Close'].iloc[i]),
                    'EMA': float(ema.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'RSI':
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            for i in range(len(hist)):

                if pd.isnull(rsi.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'Close': float(hist['Close'].iloc[i]),
                    'RSI': float(rsi.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'MACD':
            ema_12 = hist['Close'].ewm(span=12, adjust=False).mean()
            ema_26 = hist['Close'].ewm(span=26, adjust=False).mean()
            macd = ema_12 - ema_26
            signal = macd.ewm(span=9, adjust=False).mean()
            for i in range(len(hist)):
                
                if pd.isnull(macd.iloc[i]):
                    continue
                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'MACD': float(macd.iloc[i]),
                    'Signal': float(signal.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'BB':
            sma = hist['Close'].rolling(window=20).mean()
            std = hist['Close'].rolling(window=20).std()
            upper = sma + 2 * std
            lower = sma - 2 * std
            for i in range(len(hist)):

                if pd.isnull(upper.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'Close': float(hist['Close'].iloc[i]),
                    'Upper': float(upper.iloc[i]),
                    'Lower': float(lower.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'SO':
            low_14 = hist['Low'].rolling(window=14).min()
            high_14 = hist['High'].rolling(window=14).max()
            k = 100 * (hist['Close'] - low_14) / (high_14 - low_14)
            d = k.rolling(window=3).mean()
            for i in range(len(hist)):
                
                if (pd.isnull(k.iloc[i]) or pd.isnull(d.iloc[i])):
                    continue
                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'K': float(k.iloc[i]),
                    'D': float(d.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'ATR':
            tr = pd.DataFrame()
            tr['h-l'] = hist['High'] - hist['Low']
            tr['h-pc'] = abs(hist['High'] - hist['Close'].shift())
            tr['l-pc'] = abs(hist['Low'] - hist['Close'].shift())
            atr = tr.max(axis=1).rolling(window=14).mean()
            for i in range(len(hist)):

                if pd.isnull(atr.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'ATR': float(atr.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'IC':
            ic = (hist['High'] + hist['Low'] + hist['Close']) / 3
            for i in range(len(hist)):
                
                if pd.isnull(ic.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'IC': float(ic.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'VWAP':
            vwap = (hist['Volume'] * (hist['High'] + hist['Low'] + hist['Close']) / 3).cumsum() / hist['Volume'].cumsum()
            for i in range(len(hist)):
                
                if pd.isnull(vwap.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'VWAP': float(vwap.iloc[i])
                }
                formatted_data.append(data_point)
        elif indicator == 'MFI':
            typical_price = (hist['High'] + hist['Low'] + hist['Close']) / 3
            raw_money_flow = typical_price * hist['Volume']
            change = typical_price.diff()
            positive_flow = (change.where(change > 0, 0) * hist['Volume']).rolling(window=14).sum()
            negative_flow = (-change.where(change < 0, 0) * hist['Volume']).rolling(window=14).sum()
            money_flow_ratio = positive_flow / negative_flow
            mfi = 100 - 100 / (1 + money_flow_ratio)
            for i in range(len(hist)):
                
                if pd.isnull(mfi.iloc[i]):
                    continue

                data_point = {
                    'Date': hist.index[i].strftime('%Y-%m-%d'),
                    'MFI': float(mfi.iloc[i])
                }
                formatted_data.append(data_point)
        else:
            return jsonify({'error': 'Invalid indicator'}), 400
        
        return jsonify({'data':formatted_data})       

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)