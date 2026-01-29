import pandas as pd
import os

sf_path = r'd:\niche tools\spider-frog-online\screaming_frog.xlsx'

try:
    df_sf = pd.read_excel(sf_path, engine='openpyxl')
    print("Columns:", df_sf.columns.tolist())
    print("\nFirst 20 rows:")
    print(df_sf[['Issue Name', 'Issue Type', 'URLs']].to_string())
except Exception as e:
    print(f"Error: {e}")
