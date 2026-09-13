import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

def process_csv_data(df: pd.DataFrame) -> dict:
    # Standardize column names (assuming user uploads Date, Amount, Category, Description)
    df.columns = df.columns.str.strip().str.title()
    
    if 'Amount' not in df.columns or 'Date' not in df.columns:
        raise ValueError("CSV must contain 'Date' and 'Amount' columns.")

    # Clean data
    df['Amount'] = pd.to_numeric(df['Amount'], errors='coerce')
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df = df.dropna(subset=['Amount', 'Date'])

    # ML: Anomaly Detection using Isolation Forest
    # Contamination defines the proportion of outliers in the data set (5%)
    model = IsolationForest(contamination=0.05, random_state=42)
    df['Anomaly'] = model.fit_predict(df[['Amount']])

    # Extract insights
    anomalies_df = df[df['Anomaly'] == -1]
    
    total_spent = float(df['Amount'].sum())
    avg_transaction = float(df['Amount'].mean())
    
    # Format anomalies for the frontend
    anomalies = anomalies_df[['Date', 'Amount', 'Category']].fillna("Unknown").to_dict(orient='records')
    # Convert timestamps to strings
    for item in anomalies:
        item['Date'] = item['Date'].strftime('%Y-%m-%d')

    # Monthly breakdown for charts
    df['Month'] = df['Date'].dt.strftime('%b %Y')
    monthly_data = df.groupby('Month')['Amount'].sum().reset_index().to_dict(orient='records')

    return {
        "total_spent": round(total_spent, 2),
        "avg_transaction": round(avg_transaction, 2),
        "anomalies_count": len(anomalies),
        "anomalies": anomalies,
        "monthly_trend": monthly_data
    }