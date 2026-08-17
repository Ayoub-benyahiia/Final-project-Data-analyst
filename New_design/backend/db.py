"""
=============================================================================
  DUCKDB PARQUET ANALYTICS LAYER — TechJob Analytics (Morocco)
=============================================================================
  Initializes an in-process, vectorized DuckDB instance over high-performance
  Parquet files generated from the sanitized Moroccan IT Job Star Schema.
=============================================================================
"""

import os
import threading
import duckdb
from typing import Dict, Any, List, Optional

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
POSSIBLE_PATHS = [
    os.path.abspath(os.path.join(BACKEND_DIR, "..", "..", "projet-data-maroc-tech", "data", "parquet")),
    os.path.abspath(os.path.join(BACKEND_DIR, "data", "parquet")),
    "C:/Users/ayoub/Desktop/TechJob_SaaS_App/projet-data-maroc-tech/data/parquet"
]

PARQUET_DIR = None
for path in POSSIBLE_PATHS:
    if os.path.exists(path) and os.path.exists(os.path.join(path, "fact_offres.parquet")):
        PARQUET_DIR = path.replace("\\", "/")
        break

if not PARQUET_DIR:
    raise RuntimeError(f"Could not locate parquet directory. Checked: {POSSIBLE_PATHS}")

TABLE_NAMES = [
    "fact_offres",
    "bridge_tech",
    "bridge_soft_skills",
    "bridge_languages",
    "dim_tech",
    "dim_experience",
    "dim_city",
    "dim_contract",
    "dim_education",
    "dim_entreprise",
    "dim_date",
    "dim_soft_skills",
    "dim_languages"
]

class DatabaseManager:
    _instance = None

    def __init__(self):
        self.con = duckdb.connect(database=":memory:", read_only=False)
        self.lock = threading.Lock()
        self._init_views()

    def _init_views(self):
        """Register all Parquet files as zero-copy views in DuckDB."""
        for table in TABLE_NAMES:
            file_path = f"{PARQUET_DIR}/{table}.parquet"
            if os.path.exists(file_path):
                self.con.execute(f"CREATE OR REPLACE VIEW {table} AS SELECT * FROM read_parquet('{file_path}')")
        print(f"[DuckDB] Initialized in-memory views over Parquet at: {PARQUET_DIR}")

    def query(self, sql: str, params: Optional[List[Any]] = None) -> List[Dict[str, Any]]:
        """Execute a parameterized query and return records as a list of dicts."""
        with self.lock:
            if params:
                cursor = self.con.execute(sql, params)
            else:
                cursor = self.con.execute(sql)
            df = cursor.df()
            return df.to_dict(orient="records")

    def query_one(self, sql: str, params: Optional[List[Any]] = None) -> Optional[Dict[str, Any]]:
        """Execute a query and return a single record dict."""
        records = self.query(sql, params)
        return records[0] if records else None

    def query_value(self, sql: str, params: Optional[List[Any]] = None) -> Any:
        """Execute a query returning a scalar value."""
        with self.lock:
            if params:
                cursor = self.con.execute(sql, params)
            else:
                cursor = self.con.execute(sql)
            res = cursor.fetchone()
            return res[0] if res else None

# Singleton accessor
db = DatabaseManager()
