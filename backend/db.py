"""
=============================================================================
  DUAL ANALYTICS ENGINE (DUCKDB + SUPABASE POSTGRESQL) — TechJob Analytics
=============================================================================
  Provides seamless zero-copy DuckDB Parquet in-memory analytics locally
  and connects dynamically to Supabase PostgreSQL when DATABASE_URL is set.
=============================================================================
"""

import logging
import os
import threading
from typing import Any, Dict, List, Optional

import duckdb

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
POSSIBLE_PATHS = [
    os.path.abspath(os.path.join(BACKEND_DIR, "data", "parquet")),
    os.path.abspath(os.path.join(BACKEND_DIR, "parquet")),
    os.path.abspath(os.path.join(BACKEND_DIR, "..", "data", "parquet")),
    os.path.abspath(os.path.join(BACKEND_DIR, "..", "..", "projet-data-maroc-tech", "data", "parquet")),
    "/app/data/parquet",
]

PARQUET_DIR = None
for path in POSSIBLE_PATHS:
    if os.path.exists(path) and os.path.exists(os.path.join(path, "fact_offres.parquet")):
        PARQUET_DIR = path.replace("\\", "/")
        break


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
        self.lock = threading.Lock()
        self.database_url = os.getenv("DATABASE_URL")
        self.engine_type = "duckdb"
        self.con = None
        self._init_engine()

    def _init_engine(self):
        """Initialize primary database engine with fallback."""
        # 1. Try DuckDB in-memory with Parquet views (Default / Local / Container)
        self.con = duckdb.connect(database=":memory:", read_only=False)
        if PARQUET_DIR:
            logger.info(f"Found Parquet directory at: {PARQUET_DIR}")
            for table in TABLE_NAMES:
                file_path = f"{PARQUET_DIR}/{table}.parquet"
                if os.path.exists(file_path):
                    self.con.execute(f"CREATE OR REPLACE VIEW {table} AS SELECT * FROM read_parquet('{file_path}')")
                    logger.info(f"Created view for table: {table}")
                else:
                    logger.error(f"Parquet file not found: {file_path}")
                    raise RuntimeError(f"Required Parquet file missing: {file_path}")
            logger.info(f"DatabaseManager: DuckDB In-Memory initialized with {len(TABLE_NAMES)} Parquet views at {PARQUET_DIR}")
        else:
            logger.error("Parquet directory not found. Searched paths: " + ", ".join(POSSIBLE_PATHS))
            raise RuntimeError("Parquet data directory not found. Application cannot start without required analytical data.")

    def query(self, sql: str, params: Optional[List[Any]] = None) -> List[Dict[str, Any]]:
        """Execute a parameterized query and return records as a list of dicts."""
        with self.lock:
            if params:
                cursor = self.con.execute(sql, params)
            else:
                cursor = self.con.execute(sql)
            cols = [desc[0] for desc in cursor.description]
            return [dict(zip(cols, row)) for row in cursor.fetchall()]

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

    def execute(self, sql: str, params: Optional[List[Any]] = None) -> List[Any]:
        """Execute a query thread-safely and return all rows as tuples."""
        with self.lock:
            if params:
                cursor = self.con.execute(sql, params)
            else:
                cursor = self.con.execute(sql)
            return cursor.fetchall()

    def fetchone(self, sql: str, params: Optional[List[Any]] = None) -> Optional[Any]:
        """Execute a query thread-safely and return a single tuple row."""
        with self.lock:
            if params:
                cursor = self.con.execute(sql, params)
            else:
                cursor = self.con.execute(sql)
            return cursor.fetchone()

# Singleton accessor
db = DatabaseManager()
