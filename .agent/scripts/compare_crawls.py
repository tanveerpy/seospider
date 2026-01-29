import pandas as pd
import os
import sys

def analyze_comparison():
    sf_file = 'screaming_frog.xlsx'
    cl_file = 'craw_logic.csv'

    print("Analyzing Crawl Data (Issue Summary Mode)...")

    # Load CrawlLogic Data
    try:
        # SpiderFrog CSV
        cl_df = pd.read_csv(cl_file)
        print(f"Loaded SpiderFrog Data: {len(cl_df)} rows")
    except Exception as e:
        print(f"Error loading {cl_file}: {e}")
        return

    # Load Screaming Frog Data
    try:
        xls = pd.ExcelFile(sf_file)
        target_sheet = xls.sheet_names[0] # Expecting '1 - Issues Overview' or similar
        sf_df = pd.read_excel(sf_file, sheet_name=target_sheet)
        print(f"Loaded Screaming Frog Data ({target_sheet}): {len(sf_df)} rows")
        
    except Exception as e:
        print(f"Error loading {sf_file}: {e}")
        return

    # Normalization & Aggregation
    
    # 1. Aggregate SpiderFrog Issues from "Issues" column
    # Format: "Issue Name; Issue Name 2"
    cl_issues_map = {}
    
    if 'Issues' in cl_df.columns:
        for issues_str in cl_df['Issues'].fillna(''):
            if not isinstance(issues_str, str) or not issues_str.strip():
                continue
            for issue in issues_str.split(';'):
                issue = issue.strip()
                if not issue: continue
                # Specific Normalization to match SF if needed
                # For now, we assume our internal codes map closely or we report them as is
                cl_issues_map[issue] = cl_issues_map.get(issue, 0) + 1
    
    # 2. Extract Screaming Frog Issues
    # Columns: 'Issue Name', 'URLs' (Which represents Count/Affected)
    sf_issues_map = {}
    
    # Identify URL/Count column
    count_col = 'URLs'
    if count_col not in sf_df.columns:
        # Fallback: Look for number column
        for col in sf_df.columns:
            if pd.api.types.is_numeric_dtype(sf_df[col]):
                count_col = col
                break
    
    name_col = 'Issue Name'
    if name_col not in sf_df.columns:
         name_col = sf_df.columns[0] # Assume first column is name

    for index, row in sf_df.iterrows():
        name = str(row.get(name_col, 'Unknown')).strip()
        count = row.get(count_col, 0)
        try:
            count = int(count)
        except:
            count = 0
        sf_issues_map[name] = count

    # 3. Generate Report
    report = []
    report.append("# 🕷️ SpiderFrog vs Screaming Frog: Issue Gap Analysis")
    report.append(f"\n**Target:** writeoffcalc.com")
    report.append(f"**SpiderFrog Pages Crawled:** {len(cl_df)}")
    report.append(f"**Analysis Mode:** Issue Summary Comparison (SF file was a summary report)")
    
    report.append("\n## ⚠️ Discrepancy Matrix")
    report.append("| Issue Type | SF Count | SpiderFrog Count | Gap | Status |")
    report.append("|---|---|---|---|---|")

    # Union of all issue names
    all_issues = sorted(list(set(cl_issues_map.keys()) | set(sf_issues_map.keys())))

    # Fuzzy Mapping / grouping could happen here. 
    # For now, listing all.
    
    for issue in all_issues:
        cl_count = cl_issues_map.get(issue, 0)
        sf_count = sf_issues_map.get(issue, 0)
        
        diff = cl_count - sf_count
        gap_str = f"{diff:+d}" if diff != 0 else "0"
        
        if diff == 0:
            status = "✅ Perfect"
        elif abs(diff) < 3:
            status = "🟢 Close"
        elif cl_count == 0 and sf_count > 0:
            status = "🔴 MISSED"
        elif cl_count > 0 and sf_count == 0:
            status = "🔵 UNIQUE FIND"
        else:
            status = "⚠️ Mismatch"
            
        report.append(f"| {issue} | {sf_count} | {cl_count} | {gap_str} | {status} |")

    report.append("\n## Analysis Summary")
    report.append("- **🔴 MISSED:** Issues Screaming Frog found but SpiderFrog missed.")
    report.append("- **🔵 UNIQUE FIND:** Issues SpiderFrog found but Screaming Frog didn't report (or named differently).")
    report.append("- **✅ Perfect:** Counts matched exactly.")

    # print("\n".join(report)) # Avoid Unicode Error on Windows Console
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        print("\n".join(report))
    except:
        print("Report generated (Unicode characters suppressed in console). See COMPARISON_REPORT.md")
    
    # Save Report
    with open('COMPARISON_REPORT.md', 'w', encoding='utf-8') as f:
        f.write("\n".join(report))

if __name__ == "__main__":
    analyze_comparison()
