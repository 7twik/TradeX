import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.linear_model import LinearRegression

# Step 1: Download Stock Data
def download_stock_data(ticker, start_date, end_date):
    data = yf.download(ticker, start=start_date, end=end_date)
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
    return X, y, scaler

# Step 4: Train Logistic Regression
def train_logistic_regression(X_train, y_train):
    model = LogisticRegression(max_iter=1000)  # Increased iterations for convergence
    model.fit(X_train, y_train)
    return model

# Step 5: Train Linear Regression for Price Prediction
def train_linear_regression(X_train, y_train):
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model

# Step 6: Evaluate Models
def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2f}")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    return y_pred

# Step 7: Plot Actual vs Predicted Trends


if _name_ == "_main_":
    try:
        # User Inputs
        ticker = input("Enter stock ticker (e.g., AAPL, MSFT): ")
        start_date = input("Enter start date (YYYY-MM-DD): ")
        end_date = input("Enter end date (YYYY-MM-DD): ")
        sequence_length = 60

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
        y_pred_class = evaluate_model(model_class, X_test_class, y_test_class)

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

     

    except Exception as e:
        print(f"Error: {e}")