import pandas as pd
import json
import re
import os

file_path = r"c:\Users\tahah\OneDrive\Desktop\discover-azerbaijan-backend\Price Packages for Discover Azerbaijan.xlsx"
output_path = r"c:\Users\tahah\OneDrive\Desktop\discover-azerbaijan-backend\prisma\packages.json"

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

try:
    df = pd.read_excel(file_path, sheet_name="Discover Azerbaijan Packages")
    df.columns = ["Package", "Star3", "Star4", "Star5", "Inclusions", "IslamabadAddon", "ExpressVisaAddon"]

    categories = []
    current_category = None

    for idx, row in df.iterrows():
        package_name = row["Package"]
        if pd.isna(package_name):
            continue
        
        package_name = str(package_name).strip()
        
        # Skip the header row if it is read as a data row
        if package_name.lower() == "package":
            continue
        
        # Check if this row is a category header.
        # It's a category if Star3, Star4, and Star5 are all null.
        is_category = pd.isna(row["Star3"]) and pd.isna(row["Star4"]) and pd.isna(row["Star5"])
        
        if is_category:
            current_category = {
                "category": package_name,
                "packages": []
            }
            categories.append(current_category)
        else:
            if current_category is None:
                current_category = {
                    "category": "General",
                    "packages": []
                }
                categories.append(current_category)
                
            # Parse Inclusions
            inclusions_raw = row["Inclusions"]
            inclusions = []
            if not pd.isna(inclusions_raw):
                inclusions = [line.strip() for line in str(inclusions_raw).split("\n") if line.strip()]
                
            # Helper to convert to float/null
            def to_float(val):
                if pd.isna(val):
                    return None
                try:
                    clean_val = str(val).replace(",", "").replace("PKR", "").strip()
                    return float(clean_val)
                except:
                    return None
            
            star3 = to_float(row["Star3"])
            star4 = to_float(row["Star4"])
            star5 = to_float(row["Star5"])
            islamabad_addon = to_float(row["IslamabadAddon"])
            express_visa_addon = to_float(row["ExpressVisaAddon"])
            
            # Determine duration days and text
            duration_days = None
            duration_text = None
            
            match = re.search(r"(\d+)\s*Days?\s*/\s*(\d+)\s*Nights?", package_name, re.IGNORECASE)
            if match:
                days = int(match.group(1))
                nights = int(match.group(2))
                duration_days = days
                duration_text = f"{days} Days / {nights} Nights"
            else:
                match_days = re.search(r"(\d+)\s*Days?", package_name, re.IGNORECASE)
                if match_days:
                    duration_days = int(match_days.group(1))
                    duration_text = f"{duration_days} Days"
            
            # Base price is the 3-star price
            price = star3 if star3 is not None else star4
            
            pkg = {
                "title": package_name,
                "price": price,
                "price3Star": star3,
                "price4Star": star4,
                "price5Star": star5,
                "islamabadDepartureAddOn": islamabad_addon,
                "expressVisaAddOn": express_visa_addon,
                "inclusions": inclusions,
                "durationDays": duration_days,
                "durationText": duration_text
            }
            current_category["packages"].append(pkg)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(categories, f, indent=2, ensure_ascii=False)

    print(f"Successfully wrote parsed packages to {output_path}")

except Exception as e:
    print("Error parsing Excel to JSON:", e)
