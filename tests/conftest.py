"""
=============================================================================
TECHJOB ANALYTICS — PYTEST FIXTURES & SHARED TEST UTILITIES
=============================================================================
Provides fixtures for in-memory DuckDB with minimal deterministic dataset,
FastAPI TestClient, and ground truth data for validation.
=============================================================================
"""

import pytest
import tempfile
import shutil
from pathlib import Path
import duckdb
import pandas as pd
from fastapi.testclient import TestClient
import sys
import os

# Add backend to path for imports
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from main import app


# ============================================================================
# MINIMAL DETERMINISTIC DATASET (5 fact records for fast testing)
# ============================================================================

SAMPLE_FACT_DATA = [
    {
        "job_id": 1,
        "date_id": 1,
        "city_id": 1,
        "contract_id": 1,
        "edu_id": 1,
        "exp_id": 1,
        "entreprise_id": 1,
        "job_title": "Senior React Developer",
        "job_id_original": "JOB001",
        "job_function": "IT",
        "work_mode": "Hybride",
        "allows_remote": 1,
        "allows_hybrid": 1,
        "uses_agile": 1,
        "is_junior_friendly": 0,
        "nb_tech_skills": 3,
        "nb_soft_skills": 2,
        "nb_languages": 1,
    },
    {
        "job_id": 2,
        "date_id": 2,
        "city_id": 2,
        "contract_id": 1,
        "edu_id": 2,
        "exp_id": 2,
        "entreprise_id": 2,
        "job_title": "Junior Python Engineer",
        "job_id_original": "JOB002",
        "job_function": "IT",
        "work_mode": "Télétravail",
        "allows_remote": 1,
        "allows_hybrid": 0,
        "uses_agile": 1,
        "is_junior_friendly": 1,
        "nb_tech_skills": 2,
        "nb_soft_skills": 2,
        "nb_languages": 1,
    },
    {
        "job_id": 3,
        "date_id": 3,
        "city_id": 1,
        "contract_id": 2,
        "edu_id": 3,
        "exp_id": 3,
        "entreprise_id": 1,
        "job_title": "Full Stack Developer",
        "job_id_original": "JOB003",
        "job_function": "IT",
        "work_mode": "Sur site",
        "allows_remote": 0,
        "allows_hybrid": 0,
        "uses_agile": 0,
        "is_junior_friendly": 0,
        "nb_tech_skills": 4,
        "nb_soft_skills": 3,
        "nb_languages": 2,
    },
    {
        "job_id": 4,
        "date_id": 4,
        "city_id": 3,
        "contract_id": 1,
        "edu_id": 2,
        "exp_id": 2,
        "entreprise_id": 3,
        "job_title": "Data Analyst",
        "job_id_original": "JOB004",
        "job_function": "Data",
        "work_mode": "Hybride",
        "allows_remote": 1,
        "allows_hybrid": 1,
        "uses_agile": 0,
        "is_junior_friendly": 1,
        "nb_tech_skills": 2,
        "nb_soft_skills": 2,
        "nb_languages": 1,
    },
    {
        "job_id": 5,
        "date_id": 5,
        "city_id": 2,
        "contract_id": 3,
        "edu_id": 4,
        "exp_id": 4,
        "entreprise_id": 2,
        "job_title": "DevOps Engineer",
        "job_id_original": "JOB005",
        "job_function": "IT",
        "work_mode": "Télétravail",
        "allows_remote": 1,
        "allows_hybrid": 0,
        "uses_agile": 1,
        "is_junior_friendly": 0,
        "nb_tech_skills": 3,
        "nb_soft_skills": 1,
        "nb_languages": 1,
    },
]

SAMPLE_DIM_DATA = {
    "dim_date": [
        {"date_id": 1, "year": 2024, "decade": "2020s", "is_recent": 1},
        {"date_id": 2, "year": 2025, "decade": "2020s", "is_recent": 1},
        {"date_id": 3, "year": 2023, "decade": "2020s", "is_recent": 1},
        {"date_id": 4, "year": 2024, "decade": "2020s", "is_recent": 1},
        {"date_id": 5, "year": 2025, "decade": "2020s", "is_recent": 1},
    ],
    "dim_city": [
        {"city_id": 1, "city_name": "Casablanca", "region": "Casablanca-Settat", "is_major_hub": 1},
        {"city_id": 2, "city_name": "Rabat", "region": "Rabat-Salé-Kénitra", "is_major_hub": 1},
        {"city_id": 3, "city_name": "Tanger", "region": "Tanger-Tétouan-Al Hoceïma", "is_major_hub": 1},
    ],
    "dim_contract": [
        {"contract_id": 1, "contract_type": "CDI", "is_permanent": 1, "is_internship": 0},
        {"contract_id": 2, "contract_type": "CDD", "is_permanent": 0, "is_internship": 0},
        {"contract_id": 3, "contract_type": "Freelance", "is_permanent": 0, "is_internship": 0},
    ],
    "dim_education": [
        {"edu_id": 1, "education_level": "Bac+5"},
        {"edu_id": 2, "education_level": "Bac+3"},
        {"edu_id": 3, "education_level": "Bac+2"},
        {"edu_id": 4, "education_level": "Bac+4"},
    ],
    "dim_experience": [
        {"exp_id": 1, "experience_label": "Sénior (5 - 10 ans)", "exp_years_min": 5, "exp_years_max": 10, "tier": "Senior"},
        {"exp_id": 2, "experience_label": "Junior (1 - 3 ans)", "exp_years_min": 1, "exp_years_max": 3, "tier": "Junior"},
        {"exp_id": 3, "experience_label": "Intermédiaire (3 - 5 ans)", "exp_years_min": 3, "exp_years_max": 5, "tier": "Mid-Level"},
        {"exp_id": 4, "experience_label": "Expert (10+ ans)", "exp_years_min": 10, "exp_years_max": 20, "tier": "Lead / Expert"},
    ],
    "dim_entreprise": [
        {"entreprise_id": 1, "company_name": "TechCorp", "industry_sector": "IT Services"},
        {"entreprise_id": 2, "company_name": "Data Solutions", "industry_sector": "Data & AI"},
        {"entreprise_id": 3, "company_name": "Cloud Systems", "industry_sector": "Cloud & DevOps"},
    ],
    "dim_tech": [
        {"tech_id": 1, "tech_name": "React", "category": "Frontend"},
        {"tech_id": 2, "tech_name": "Python", "category": "Backend"},
        {"tech_id": 3, "tech_name": "TypeScript", "category": "Frontend"},
        {"tech_id": 4, "tech_name": "SQL", "category": "Database"},
        {"tech_id": 5, "tech_name": "Docker", "category": "Cloud & DevOps"},
    ],
    "dim_soft_skills": [
        {"soft_id": 1, "soft_skill_name": "Communication"},
        {"soft_id": 2, "soft_skill_name": "Travail en équipe"},
        {"soft_id": 3, "soft_skill_name": "Rigueur"},
    ],
    "dim_languages": [
        {"language_id": 1, "language_name": "Français"},
        {"language_id": 2, "language_name": "Anglais"},
    ],
}

SAMPLE_BRIDGE_DATA = {
    "bridge_tech": [
        {"job_id": 1, "tech_id": 1},  # React
        {"job_id": 1, "tech_id": 3},  # TypeScript
        {"job_id": 1, "tech_id": 4},  # SQL
        {"job_id": 2, "tech_id": 2},  # Python
        {"job_id": 2, "tech_id": 4},  # SQL
        {"job_id": 3, "tech_id": 1},  # React
        {"job_id": 3, "tech_id": 2},  # Python
        {"job_id": 3, "tech_id": 3},  # TypeScript
        {"job_id": 3, "tech_id": 5},  # Docker
        {"job_id": 4, "tech_id": 2},  # Python
        {"job_id": 4, "tech_id": 4},  # SQL
        {"job_id": 5, "tech_id": 2},  # Python
        {"job_id": 5, "tech_id": 5},  # Docker
        {"job_id": 5, "tech_id": 4},  # SQL
    ],
    "bridge_soft_skills": [
        {"job_id": 1, "soft_id": 1},
        {"job_id": 1, "soft_id": 2},
        {"job_id": 2, "soft_id": 1},
        {"job_id": 2, "soft_id": 2},
        {"job_id": 3, "soft_id": 1},
        {"job_id": 3, "soft_id": 2},
        {"job_id": 3, "soft_id": 3},
        {"job_id": 4, "soft_id": 1},
        {"job_id": 4, "soft_id": 2},
        {"job_id": 5, "soft_id": 1},
    ],
    "bridge_languages": [
        {"job_id": 1, "language_id": 1},
        {"job_id": 2, "language_id": 1},
        {"job_id": 3, "language_id": 1},
        {"job_id": 3, "language_id": 2},
        {"job_id": 4, "language_id": 1},
        {"job_id": 5, "language_id": 1},
    ],
}

# Ground truth aggregations for validation
GROUND_TRUTH = {
    "total_jobs": 5,
    "total_companies": 3,
    "total_cities": 3,
    "remote_jobs": 4,  # allows_remote = 1
    "hybrid_jobs": 2,  # allows_hybrid = 1 (jobs 1 and 4)
    "contract_distribution": {"CDI": 3, "CDD": 1, "Freelance": 1},
    "top_tech": {"React": 2, "Python": 4, "TypeScript": 2, "SQL": 4, "Docker": 2},
    "city_distribution": {"Casablanca": 2, "Rabat": 2, "Tanger": 1},
}


# ============================================================================
# PYTEST FIXTURES
# ============================================================================

@pytest.fixture(scope="session")
def sample_parquet_dir():
    """Create temporary directory with sample Parquet files."""
    temp_dir = tempfile.mkdtemp()
    temp_path = Path(temp_dir)
    
    try:
        # Create fact table
        fact_df = pd.DataFrame(SAMPLE_FACT_DATA)
        fact_df.to_parquet(temp_path / "fact_offres.parquet", index=False)
        
        # Create dimension tables
        for table_name, data in SAMPLE_DIM_DATA.items():
            df = pd.DataFrame(data)
            df.to_parquet(temp_path / f"{table_name}.parquet", index=False)
        
        # Create bridge tables
        for table_name, data in SAMPLE_BRIDGE_DATA.items():
            df = pd.DataFrame(data)
            df.to_parquet(temp_path / f"{table_name}.parquet", index=False)
        
        yield temp_path
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture(scope="module")
def sample_duckdb_db(sample_parquet_dir):
    """Create in-memory DuckDB instance loaded with sample data."""
    conn = duckdb.connect(database=":memory:", read_only=False)
    
    # Create views from Parquet files
    table_names = [
        "fact_offres",
        "dim_date",
        "dim_city",
        "dim_contract",
        "dim_education",
        "dim_experience",
        "dim_entreprise",
        "dim_tech",
        "dim_soft_skills",
        "dim_languages",
        "bridge_tech",
        "bridge_soft_skills",
        "bridge_languages",
    ]
    
    for table in table_names:
        file_path = sample_parquet_dir / f"{table}.parquet"
        if file_path.exists():
            conn.execute(f"CREATE TABLE {table} AS SELECT * FROM read_parquet('{file_path}')")
    
    # Warm up DuckDB engine execution pipeline
    conn.execute("SELECT COUNT(*) FROM fact_offres").fetchone()

    yield conn
    conn.close()


@pytest.fixture(scope="function")
def test_client():
    """FastAPI TestClient instance for API testing."""
    return TestClient(app)


@pytest.fixture(scope="function")
def clean_cache():
    """Clear the application cache before each test."""
    from core.cache import query_cache
    query_cache.clear()
    yield
    query_cache.clear()
