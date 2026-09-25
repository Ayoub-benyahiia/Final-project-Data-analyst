"""
=============================================================================
TECHJOB ANALYTICS — SCHEMA VALIDATION TESTS
=============================================================================
Verifies that sample Parquet/DuckDB tables strictly conform to Pydantic
schema models for data contract enforcement.
=============================================================================
"""

import pytest
import pandas as pd
from pathlib import Path
import sys

# Add backend to path for imports
backend_dir = Path(__file__).parent.parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from schemas.responses import (
    ContractDistributionItem,
    YearlyTrendItem,
    RegionalHubItem,
    EducationLevelItem,
    TopTechnologyItem,
)
from schemas.filters import GlobalFilterSchema


@pytest.mark.data
def test_fact_table_schema_conformance(sample_duckdb_db):
    """Verify fact_offres table has expected columns and data types."""
    df = sample_duckdb_db.execute("SELECT * FROM fact_offres").df()
    
    expected_columns = [
        "job_id", "date_id", "city_id", "contract_id", "edu_id", "exp_id",
        "entreprise_id", "job_title", "job_id_original", "job_function",
        "work_mode", "allows_remote", "allows_hybrid", "uses_agile",
        "is_junior_friendly", "nb_tech_skills", "nb_soft_skills", "nb_languages"
    ]
    
    assert set(df.columns) == set(expected_columns), f"Columns mismatch. Expected: {expected_columns}, Got: {list(df.columns)}"
    assert len(df) == 5, f"Expected 5 fact records, got {len(df)}"
    assert df["job_id"].is_unique, "job_id should be unique (primary key)"


@pytest.mark.data
def test_dim_tech_schema_conformance(sample_duckdb_db):
    """Verify dim_tech table conforms to expected schema."""
    df = sample_duckdb_db.execute("SELECT * FROM dim_tech").df()
    
    expected_columns = ["tech_id", "tech_name", "category"]
    assert set(df.columns) == set(expected_columns), f"Columns mismatch. Expected: {expected_columns}, Got: {list(df.columns)}"
    assert df["tech_id"].is_unique, "tech_id should be unique"
    assert df["tech_name"].is_unique, "tech_name should be unique"
    
    # Validate category values are from expected set
    valid_categories = ["Frontend", "Backend", "Cloud & DevOps", "Database", "Data & AI", "Other"]
    assert all(cat in valid_categories for cat in df["category"].dropna()), f"Invalid categories found: {df['category'].unique()}"


@pytest.mark.data
def test_dim_city_schema_conformance(sample_duckdb_db):
    """Verify dim_city table conforms to expected schema."""
    df = sample_duckdb_db.execute("SELECT * FROM dim_city").df()
    
    expected_columns = ["city_id", "city_name", "region", "is_major_hub"]
    assert set(df.columns) == set(expected_columns), f"Columns mismatch. Expected: {expected_columns}, Got: {list(df.columns)}"
    assert df["city_id"].is_unique, "city_id should be unique"
    assert df["city_name"].is_unique, "city_name should be unique"
    
    # Validate is_major_hub is boolean (0 or 1)
    assert all(val in [0, 1] for val in df["is_major_hub"]), "is_major_hub should be 0 or 1"


@pytest.mark.data
def test_dim_contract_schema_conformance(sample_duckdb_db):
    """Verify dim_contract table conforms to expected schema."""
    df = sample_duckdb_db.execute("SELECT * FROM dim_contract").df()
    
    expected_columns = ["contract_id", "contract_type", "is_permanent", "is_internship"]
    assert set(df.columns) == set(expected_columns), f"Columns mismatch. Expected: {expected_columns}, Got: {list(df.columns)}"
    assert df["contract_id"].is_unique, "contract_id should be unique"
    assert df["contract_type"].is_unique, "contract_type should be unique"


@pytest.mark.data
def test_bridge_tech_schema_conformance(sample_duckdb_db):
    """Verify bridge_tech table has correct composite key structure."""
    df = sample_duckdb_db.execute("SELECT * FROM bridge_tech").df()
    
    expected_columns = ["job_id", "tech_id"]
    assert set(df.columns) == set(expected_columns), f"Columns mismatch. Expected: {expected_columns}, Got: {list(df.columns)}"
    
    # Verify composite key uniqueness
    composite_key = df[["job_id", "tech_id"]].apply(tuple, axis=1)
    assert composite_key.is_unique, "Composite key (job_id, tech_id) should be unique"


@pytest.mark.data
def test_pydantic_contract_distribution_validation():
    """Verify Pydantic model validates contract distribution data correctly."""
    valid_data = {
        "name": "CDI",
        "count": 100,
        "pct": 45.5
    }
    item = ContractDistributionItem(**valid_data)
    assert item.name == "CDI"
    assert item.count == 100
    assert item.pct == 45.5


@pytest.mark.data
def test_pydantic_regional_hub_validation():
    """Verify Pydantic model validates regional hub data correctly."""
    valid_data = {
        "city": "Casablanca",
        "count": 5000
    }
    item = RegionalHubItem(**valid_data)
    assert item.city == "Casablanca"
    assert item.count == 5000


@pytest.mark.data
def test_pydantic_top_technology_validation():
    """Verify Pydantic model validates technology data correctly."""
    valid_data = {
        "name": "React",
        "count": 2500,
        "category": "Frontend"
    }
    item = TopTechnologyItem(**valid_data)
    assert item.name == "React"
    assert item.count == 2500
    assert item.category == "Frontend"


@pytest.mark.data
def test_pydantic_global_filter_schema_validation():
    """Verify Pydantic filter schema handles various input formats."""
    # Test with all fields
    valid_data = {
        "cities": ["Casablanca", "Rabat"],
        "contracts": ["CDI"],
        "education": ["Bac+5"],
        "experience": ["Senior"],
        "technologies": ["React", "Python"],
        "soft_skills": ["Communication"]
    }
    schema = GlobalFilterSchema(**valid_data)
    assert len(schema.cities) == 2
    assert len(schema.contracts) == 1
    assert len(schema.technologies) == 2
    
    # Test with empty arrays (default)
    empty_schema = GlobalFilterSchema()
    assert empty_schema.cities == []
    assert empty_schema.contracts == []
