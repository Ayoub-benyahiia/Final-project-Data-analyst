"""
=============================================================================
SUPABASE MIGRATION TOOL (NOT RUNTIME ARCHITECTURE)
=============================================================================
Purpose: Export Parquet star schema to Supabase PostgreSQL for backup/storage
Usage: python export_and_sync_supabase.py --database-url "<SUPABASE_URL>"
       python export_and_sync_supabase.py --verify-local
Note: This script is NOT part of the production runtime architecture
Runtime: DuckDB + Parquet (see backend/db.py)
Dependencies: SQLAlchemy (migration only), pandas (data export)
Migration Documentation: See MIGRATION.md in repository root
=============================================================================
"""

import os
import sys
import argparse
import pandas as pd

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_DIR = os.path.join(ROOT_DIR, "projet-data-maroc-tech", "data", "star_schema")
PARQUET_DIR = os.path.join(ROOT_DIR, "projet-data-maroc-tech", "data", "parquet")

# Ingestion order honoring foreign key dependencies
IMPORT_SEQUENCE = [
    ("dim_date", "dim_date.csv"),
    ("dim_city", "dim_city.csv"),
    ("dim_contract", "dim_contract.csv"),
    ("dim_education", "dim_education.csv"),
    ("dim_experience", "dim_experience.csv"),
    ("dim_entreprise", "dim_entreprise.csv"),
    ("dim_tech", "dim_tech.csv"),
    ("dim_soft_skills", "dim_soft_skills.csv"),
    ("dim_languages", "dim_languages.csv"),
    ("fact_offres", "fact_offres.csv"),
    ("bridge_tech", "bridge_tech.csv"),
    ("bridge_soft_skills", "bridge_soft_skills.csv"),
    ("bridge_languages", "bridge_languages.csv"),
]

def verify_local_files():
    print("\n[1/2] Verifying Local Star Schema CSV & Parquet Files...")
    all_ok = True
    for table_name, csv_filename in IMPORT_SEQUENCE:
        csv_path = os.path.join(CSV_DIR, csv_filename)
        parquet_path = os.path.join(PARQUET_DIR, f"{table_name}.parquet")
        
        csv_exists = os.path.exists(csv_path)
        parquet_exists = os.path.exists(parquet_path)
        
        if csv_exists:
            df = pd.read_csv(csv_path)
            rows = len(df)
            p_status = "OK" if parquet_exists else "MISSING"
            print(f"  [OK] {table_name:20s}: {rows:>6,d} rows (CSV: OK | Parquet: {p_status})")
        else:
            print(f"  [MISSING] {table_name:20s}: CSV NOT FOUND at {csv_path}")
            all_ok = False
            
    return all_ok

def sync_to_supabase(database_url: str):
    print(f"\n[2/2] Connecting to Supabase PostgreSQL at: {database_url.split('@')[-1] if '@' in database_url else '...'}")
    try:
        from sqlalchemy import create_engine
        engine = create_engine(database_url)
        with engine.connect() as conn:
            print("  [OK] Database connection established successfully!")
            
            for table_name, csv_filename in IMPORT_SEQUENCE:
                csv_path = os.path.join(CSV_DIR, csv_filename)
                df = pd.read_csv(csv_path)
                print(f"  -> Uploading {len(df):,d} records to table '{table_name}'...")
                df.to_sql(table_name, engine, if_exists='append', index=False, method='multi', chunksize=1000)
                print(f"     [OK] {table_name} populated successfully.")
                
        print("\n=== ALL 13 TABLES SUCCESSFULLY IMPORTED INTO SUPABASE POSTGRESQL! ===\n")
    except Exception as e:
        print(f"\n[ERROR] Supabase upload failed: {e}")
        print("\nAlternative (Direct PSQL / Supabase UI Method):")
        print("Run the following psql copy commands in terminal:")
        for table_name, csv_filename in IMPORT_SEQUENCE:
            csv_path = os.path.join(CSV_DIR, csv_filename).replace("\\", "/")
            print(f"  \\copy {table_name} FROM '{csv_path}' WITH (FORMAT csv, HEADER true);")

def main():
    parser = argparse.ArgumentParser(description="Export & Sync TechJob Star Schema to Supabase")
    parser.add_argument("--database-url", type=str, default=os.getenv("DATABASE_URL"), help="PostgreSQL connection string")
    parser.add_argument("--verify-local", action="store_true", help="Only verify local CSV/Parquet files")
    args = parser.parse_args()

    files_ok = verify_local_files()
    if not files_ok:
        print("\n[ERROR] Missing required data files. Aborting.")
        sys.exit(1)

    if args.database_url and not args.verify_local:
        sync_to_supabase(args.database_url)
    else:
        print("\n[INFO] To import to Supabase:")
        print("1. Run `supabase_setup_ddl.sql` in Supabase SQL Editor.")
        print("2. Run `python export_and_sync_supabase.py --database-url \"<YOUR_SUPABASE_DATABASE_URL>\"`")

if __name__ == "__main__":
    main()
