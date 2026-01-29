import pandas as pd
import re

# File paths
cl_path = r'd:\niche tools\spider-frog-online\crawllogic.csv'
sf_path = r'd:\niche tools\spider-frog-online\screaming_frog.xlsx'
output_path = r'd:\niche tools\spider-frog-online\comparison_results.csv'

print("Generating Issue Comparison Report...")

# 1. Process CrawlLogic Data
try:
    df_cl = pd.read_csv(cl_path)
    cl_issues_list = []
    
    # Iterate through each row's 'Issues' column
    if 'Issues' in df_cl.columns:
        for issues_str in df_cl['Issues'].dropna():
            # Split by semicolon and strip whitespace
            issues = [i.strip() for i in issues_str.split(';') if i.strip()]
            cl_issues_list.extend(issues)
            
    # Count frequencies
    cl_counts = pd.Series(cl_issues_list).value_counts().reset_index()
    cl_counts.columns = ['Issue Name', 'CrawlLogic Count']
    
    print(f"CrawlLogic: Processed {len(df_cl)} URLs, found {len(cl_issues_list)} total issue instances.")
    
except Exception as e:
    print(f"Error processing CrawlLogic CSV: {e}")
    exit(1)

# 2. Process Screaming Frog Data
try:
    df_sf = pd.read_excel(sf_path, engine='openpyxl')
    # Use 'Issue Name' and 'URLs' (which is the count)
    sf_counts = df_sf[['Issue Name', 'URLs']].copy()
    sf_counts.columns = ['Issue Name', 'Screaming Frog Count']
    
    print(f"Screaming Frog: Loaded {len(df_sf)} issue types.")

except Exception as e:
    print(f"Error processing Screaming Frog Excel: {e}")
    exit(1)

# 3. Merge and Compare
# Outer join to see what's unique to each
merged = pd.merge(cl_counts, sf_counts, on='Issue Name', how='outer').fillna(0)

# Convert counts to int
merged['CrawlLogic Count'] = merged['CrawlLogic Count'].astype(int)
merged['Screaming Frog Count'] = merged['Screaming Frog Count'].astype(int)

# Calculate Difference
merged['Difference'] = merged['CrawlLogic Count'] - merged['Screaming Frog Count']

# Sort by biggest difference descending (absolute)
merged['Abs Diff'] = merged['Difference'].abs()
merged = merged.sort_values('Abs Diff', ascending=False).drop(columns=['Abs Diff'])

# 4. Output
print("\n--- Comparison Results ---")
print(merged.to_string(index=False))

merged.to_csv(output_path, index=False)
print(f"\nReport saved to: {output_path}")
