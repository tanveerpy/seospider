# 🕷️ SpiderFrog vs Screaming Frog: Issue Gap Analysis

**Target:** writeoffcalc.com
**SpiderFrog Pages Crawled:** 43
**Analysis Mode:** Issue Summary Comparison (SF file was a summary report)

## ⚠️ Discrepancy Matrix
| Issue Type | SF Count | SpiderFrog Count | Gap | Status |
|---|---|---|---|---|
| Bot Protection: Access Restricted by Server | 0 | 1 | +1 | 🟢 Close |
| Canonicals: Missing | 41 | 42 | +1 | 🟢 Close |
| Content: Low Content Pages | 2 | 0 | -2 | 🟢 Close |
| Content: Readability Difficult | 2 | 0 | -2 | 🟢 Close |
| Content: Thin Content (< 300 words) | 0 | 2 | +2 | 🟢 Close |
| H1: Missing | 6 | 7 | +1 | 🟢 Close |
| H2: Missing | 1 | 1 | 0 | ✅ Perfect |
| H2: Multiple | 39 | 0 | -39 | 🔴 MISSED |
| H2: Multiple (High Count) | 0 | 1 | +1 | 🟢 Close |
| Headings: H2 with Missing H1 | 0 | 7 | +7 | 🔵 UNIQUE FIND |
| Images: Missing Size Attributes | 27 | 27 | 0 | ✅ Perfect |
| Images: Over 100 KB | 23 | 0 | -23 | 🔴 MISSED |
| Meta Description: Duplicate | 5 | 8 | +3 | ⚠️ Mismatch |
| Meta Description: Over 155 Characters | 9 | 10 | +1 | 🟢 Close |
| Meta Description: Over 985 Pixels | 9 | 0 | -9 | 🔴 MISSED |
| Page Titles: Duplicate | 5 | 7 | +2 | 🟢 Close |
| Page Titles: Over 561 Pixels | 36 | 0 | -36 | 🔴 MISSED |
| Page Titles: Over 60 Characters | 36 | 37 | +1 | 🟢 Close |
| Response Codes: Internal Client Error (4xx) | 1 | 0 | -1 | 🟢 Close |
| Schema: Missing Structured Data | 0 | 42 | +42 | 🔵 UNIQUE FIND |
| Security: Missing Content-Security-Policy Header | 88 | 0 | -88 | 🔴 MISSED |
| Security: Missing HSTS Header | 88 | 0 | -88 | 🔴 MISSED |
| Security: Missing Secure Referrer-Policy Header | 88 | 0 | -88 | 🔴 MISSED |
| Security: Missing X-Content-Type-Options Header | 88 | 0 | -88 | 🔴 MISSED |
| Security: Missing X-Frame-Options Header | 88 | 0 | -88 | 🔴 MISSED |

## Analysis Summary
- **🔴 MISSED:** Issues Screaming Frog found but SpiderFrog missed.
- **🔵 UNIQUE FIND:** Issues SpiderFrog found but Screaming Frog didn't report (or named differently).
- **✅ Perfect:** Counts matched exactly.