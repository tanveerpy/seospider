import pandas as pd
import os
import sys

# File paths
cl_path = r'd:\niche tools\spider-frog-online\crawllogic.csv'
sf_path = r'd:\niche tools\spider-frog-online\screaming_frog.xlsx'

print(f"Loading files...\nCrawlLogic: {cl_path}\nScreaming Frog: {sf_path}")

try:
    df_cl = pd.read_csv(cl_path)
    print(f"Loaded CrawlLogic Rows: {len(df_cl)}")
    # SF is excel, usually requires openpyxl
    df_sf = pd.read_excel(sf_path, engine='openpyxl') 
    print(f"Loaded Screaming Frog Rows: {len(df_sf)}")
except Exception as e:
    print(f"Error loading files: {e}")
    # Print available columns if one loaded
    exit(1)

# Normalize Columns
# CL has 'URL', 'Status Code', 'Title', 'Meta Description', 'Word Count'
# SF usually has 'Address', 'Status Code', 'Title 1', 'Meta Description 1', 'Word Count'

# Map SF to CL names
sf_rename_map = {
    'Address': 'URL',
    'Title 1': 'Title',
    'Meta Description 1': 'Meta Description',
    'H1-1': 'H1'
}
df_sf.rename(columns=sf_rename_map, inplace=True)

# Normalize URLs (strip trailing slash, lowercase for comparison?)
# Let's be careful. http vs https, trailing slash.
# I'll add a 'norm_url' column to both.
def normalize_url(url):
    if not isinstance(url, str): return ""
    u = url.strip().lower()
    if u.endswith('/'): u = u[:-1]
    return u

if 'URL' not in df_sf.columns:
    print("Error: 'URL' (mapped from Address) column not found in Screaming Frog file.")
    print("Available SF columns:", df_sf.columns.tolist())
    exit(1)

df_cl['norm_url'] = df_cl['URL'].apply(normalize_url)
df_sf['norm_url'] = df_sf['URL'].apply(normalize_url)

# Remove duplicates based on norm_url to avoid explosion
df_cl = df_cl.drop_duplicates(subset='norm_url')
df_sf = df_sf.drop_duplicates(subset='norm_url')

# Comparison 1: Missing URLs
cl_urls = set(df_cl['norm_url'])
sf_urls = set(df_sf['norm_url'])

in_cl_only = cl_urls - sf_urls
in_sf_only = sf_urls - cl_urls

print(f"\n--- URL Comparison ---")
print(f"Total Unique URLs in CrawlLogic: {len(cl_urls)}")
print(f"Total Unique URLs in Screaming Frog: {len(sf_urls)}")
print(f"URLs only in CrawlLogic: {len(in_cl_only)}")
print(f"URLs only in Screaming Frog: {len(in_sf_only)}")

if in_cl_only:
    print("\nExamples in CrawlLogic only:")
    for u in list(in_cl_only)[:5]: print(f" - {u}")

if in_sf_only:
    print("\nExamples in Screaming Frog only:")
    for u in list(in_sf_only)[:5]: print(f" - {u}")

# Comparison 2: Join on norm_url
merged = pd.merge(df_cl, df_sf, on='norm_url', suffixes=('_cl', '_sf'), how='inner')

print(f"\n--- Data Discrepancies (Common URLs: {len(merged)}) ---")

# Check Status Codes
if 'Status Code_cl' in merged.columns and 'Status Code_sf' in merged.columns:
    # Coerce to string for comparison
    merged['Status Code_cl'] = merged['Status Code_cl'].astype(str)
    merged['Status Code_sf'] = merged['Status Code_sf'].astype(str)
    
    status_diff = merged[merged['Status Code_cl'] != merged['Status Code_sf']]
    print(f"Status Code Mismatches: {len(status_diff)}")
    if len(status_diff) > 0:
        print(status_diff[['URL_cl', 'Status Code_cl', 'Status Code_sf']].head().to_string())

# Check Word Counts
if 'Word Count' in df_cl.columns and 'Word Count' in df_sf.columns: 
     # Clean non-numeric
     merged['Word Count_cl'] = pd.to_numeric(merged['Word Count'], errors='coerce').fillna(0)
     merged['Word Count_sf'] = pd.to_numeric(merged['Word Count_sf'], errors='coerce').fillna(0) # Rename didn't happen for SF Word Count? It should be there.
     
     merged['wc_diff'] = (merged['Word Count_cl'] - merged['Word Count_sf']).abs()
     wc_mismatch = merged[merged['wc_diff'] > 100] # Diff > 100 words
     print(f"Significant Word Count Differences (> 100 words): {len(wc_mismatch)}")
     if len(wc_mismatch) > 0:
         print(wc_mismatch[['URL_cl', 'Word Count_cl', 'Word Count_sf']].head().to_string())

# Generate CSV Report
merged.to_csv(r'd:\niche tools\spider-frog-online\comparison_report.csv', index=False)
print("\nComparison report saved to comparison_report.csv")
print("\nDone.")
