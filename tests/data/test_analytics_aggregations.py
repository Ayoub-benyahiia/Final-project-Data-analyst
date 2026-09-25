"""
=============================================================================
TECHJOB ANALYTICS — ANALYTICS AGGREGATIONS TESTS
=============================================================================
Tests DuckDB SQL functions for key features against pre-calculated ground
truths on the sample dataset. Validates core business logic correctness.
=============================================================================
"""

import pytest
import sys
from pathlib import Path

# Add parent directory to path for conftest import
sys.path.insert(0, str(Path(__file__).parent.parent))
from conftest import GROUND_TRUTH


@pytest.mark.data
def test_total_jobs_aggregation(sample_duckdb_db):
    """Verify total job count matches ground truth."""
    result = sample_duckdb_db.execute("SELECT COUNT(*) as total FROM fact_offres").fetchone()
    total = result[0] if result else 0
    
    assert total == GROUND_TRUTH["total_jobs"], f"Expected {GROUND_TRUTH['total_jobs']} jobs, got {total}"


@pytest.mark.data
def test_total_companies_aggregation(sample_duckdb_db):
    """Verify unique company count matches ground truth."""
    result = sample_duckdb_db.execute("SELECT COUNT(DISTINCT entreprise_id) as total FROM fact_offres").fetchone()
    total = result[0] if result else 0
    
    assert total == GROUND_TRUTH["total_companies"], f"Expected {GROUND_TRUTH['total_companies']} companies, got {total}"


@pytest.mark.data
def test_total_cities_aggregation(sample_duckdb_db):
    """Verify unique city count matches ground truth."""
    result = sample_duckdb_db.execute("SELECT COUNT(DISTINCT city_id) as total FROM fact_offres").fetchone()
    total = result[0] if result else 0
    
    assert total == GROUND_TRUTH["total_cities"], f"Expected {GROUND_TRUTH['total_cities']} cities, got {total}"


@pytest.mark.data
def test_remote_jobs_aggregation(sample_duckdb_db):
    """Verify remote jobs count matches ground truth."""
    result = sample_duckdb_db.execute("""
        SELECT COUNT(*) as total
        FROM fact_offres
        WHERE allows_remote = 1
    """).fetchone()
    total = result[0] if result else 0
    
    assert total == GROUND_TRUTH["remote_jobs"], f"Expected {GROUND_TRUTH['remote_jobs']} remote jobs, got {total}"


@pytest.mark.data
def test_hybrid_jobs_aggregation(sample_duckdb_db):
    """Verify hybrid jobs count matches ground truth."""
    result = sample_duckdb_db.execute("""
        SELECT COUNT(*) as total
        FROM fact_offres
        WHERE allows_hybrid = 1
    """).fetchone()
    total = result[0] if result else 0
    
    assert total == GROUND_TRUTH["hybrid_jobs"], f"Expected {GROUND_TRUTH['hybrid_jobs']} hybrid jobs, got {total}"


@pytest.mark.data
def test_contract_distribution_aggregation(sample_duckdb_db):
    """Verify contract distribution matches ground truth."""
    result = sample_duckdb_db.execute("""
        SELECT c.contract_type, COUNT(*) as count
        FROM fact_offres f
        JOIN dim_contract c ON f.contract_id = c.contract_id
        GROUP BY c.contract_type
        ORDER BY count DESC
    """).fetchall()
    
    contract_counts = {row[0]: row[1] for row in result}
    
    for contract, expected_count in GROUND_TRUTH["contract_distribution"].items():
        actual_count = contract_counts.get(contract, 0)
        assert actual_count == expected_count, f"Contract {contract}: expected {expected_count}, got {actual_count}"


@pytest.mark.data
def test_technology_demand_aggregation(sample_duckdb_db):
    """Verify top technology counts match ground truth."""
    result = sample_duckdb_db.execute("""
        SELECT t.tech_name, COUNT(DISTINCT f.job_id) as count
        FROM fact_offres f
        JOIN bridge_tech b ON f.job_id = b.job_id
        JOIN dim_tech t ON b.tech_id = t.tech_id
        GROUP BY t.tech_name
        ORDER BY count DESC
    """).fetchall()
    
    tech_counts = {row[0]: row[1] for row in result}
    
    for tech, expected_count in GROUND_TRUTH["top_tech"].items():
        actual_count = tech_counts.get(tech, 0)
        assert actual_count == expected_count, f"Technology {tech}: expected {expected_count}, got {actual_count}"


@pytest.mark.data
def test_city_distribution_aggregation(sample_duckdb_db):
    """Verify city distribution matches ground truth."""
    result = sample_duckdb_db.execute("""
        SELECT c.city_name, COUNT(*) as count
        FROM fact_offres f
        JOIN dim_city c ON f.city_id = c.city_id
        GROUP BY c.city_name
        ORDER BY count DESC
    """).fetchall()
    
    city_counts = {row[0]: row[1] for row in result}
    
    for city, expected_count in GROUND_TRUTH["city_distribution"].items():
        actual_count = city_counts.get(city, 0)
        assert actual_count == expected_count, f"City {city}: expected {expected_count}, got {actual_count}"


@pytest.mark.data
def test_skill_cooccurrence_matrix(sample_duckdb_db):
    """Verify skill co-occurrence calculation for React."""
    # React + TypeScript should co-occur in 2 jobs
    result = sample_duckdb_db.execute("""
        SELECT COUNT(DISTINCT f.job_id) as co_count
        FROM fact_offres f
        WHERE f.job_id IN (
            SELECT b1.job_id FROM bridge_tech b1
            JOIN dim_tech t1 ON b1.tech_id = t1.tech_id
            WHERE t1.tech_name = 'React'
        )
        AND f.job_id IN (
            SELECT b2.job_id FROM bridge_tech b2
            JOIN dim_tech t2 ON b2.tech_id = t2.tech_id
            WHERE t2.tech_name = 'TypeScript'
        )
    """).fetchone()
    
    co_count = result[0] if result else 0
    assert co_count == 2, f"Expected React+TypeScript co-occurrence in 2 jobs, got {co_count}"


@pytest.mark.data
def test_yoy_growth_calculation(sample_duckdb_db):
    """Verify year-over-year growth calculation."""
    # Compare 2024 vs 2023 job counts
    result = sample_duckdb_db.execute("""
        WITH yearly AS (
            SELECT d.year, COUNT(*) as count
            FROM fact_offres f
            JOIN dim_date d ON f.date_id = d.date_id
            WHERE d.year IN (2023, 2024)
            GROUP BY d.year
        )
        SELECT 
            MAX(CASE WHEN year = 2024 THEN count END) as y24,
            MAX(CASE WHEN year = 2023 THEN count END) as y23
        FROM yearly
    """).fetchone()
    
    if result:
        y24 = result[0] or 0
        y23 = result[1] or 0
        
        # We expect 2 jobs in 2024 and 1 job in 2023 based on sample data
        assert y24 == 2, f"Expected 2 jobs in 2024, got {y24}"
        assert y23 == 1, f"Expected 1 job in 2023, got {y23}"


@pytest.mark.data
def test_stack_matcher_coverage_calculation(sample_duckdb_db):
    """Verify stack matcher market coverage calculation."""
    # Test with React + TypeScript stack
    stack_skills = ["React", "TypeScript"]
    
    # Get total jobs
    total_jobs = sample_duckdb_db.execute("SELECT COUNT(*) FROM fact_offres").fetchone()[0]
    
    # Get jobs matching at least 70% of stack (2 skills required)
    matched_jobs = sample_duckdb_db.execute("""
        WITH matched AS (
            SELECT f.job_id
            FROM fact_offres f
            JOIN bridge_tech b ON f.job_id = b.job_id
            JOIN dim_tech t ON b.tech_id = t.tech_id
            WHERE t.tech_name IN ('React', 'TypeScript')
            GROUP BY f.job_id
            HAVING COUNT(DISTINCT t.tech_name) >= 2
        )
        SELECT COUNT(*) FROM matched
    """).fetchone()[0]
    
    match_rate = (matched_jobs / total_jobs * 100) if total_jobs > 0 else 0
    
    # Should match 2 jobs (job_id 1 and 3 have both React and TypeScript)
    assert matched_jobs == 2, f"Expected 2 matched jobs, got {matched_jobs}"
    assert match_rate == 40.0, f"Expected 40% match rate, got {match_rate}%"


@pytest.mark.data
def test_education_level_distribution(sample_duckdb_db):
    """Verify education level distribution calculation."""
    result = sample_duckdb_db.execute("""
        SELECT e.education_level, COUNT(*) as count
        FROM fact_offres f
        JOIN dim_education e ON f.edu_id = e.edu_id
        GROUP BY e.education_level
        ORDER BY count DESC
    """).fetchall()
    
    edu_counts = {row[0]: row[1] for row in result}
    
    # Based on sample data: Bac+5 (1), Bac+3 (2), Bac+2 (1), Bac+4 (1)
    assert edu_counts.get("Bac+5", 0) == 1, f"Expected 1 Bac+5, got {edu_counts.get('Bac+5', 0)}"
    assert edu_counts.get("Bac+3", 0) == 2, f"Expected 2 Bac+3, got {edu_counts.get('Bac+3', 0)}"


@pytest.mark.data
def test_experience_tier_distribution(sample_duckdb_db):
    """Verify experience tier distribution calculation."""
    result = sample_duckdb_db.execute("""
        SELECT e.tier, COUNT(*) as count
        FROM fact_offres f
        JOIN dim_experience e ON f.exp_id = e.exp_id
        GROUP BY e.tier
        ORDER BY count DESC
    """).fetchall()
    
    tier_counts = {row[0]: row[1] for row in result}
    
    # Based on sample data: Senior (1), Junior (2), Mid-Level (1), Lead/Expert (1)
    assert tier_counts.get("Senior", 0) == 1, f"Expected 1 Senior, got {tier_counts.get('Senior', 0)}"
    assert tier_counts.get("Junior", 0) == 2, f"Expected 2 Junior, got {tier_counts.get('Junior', 0)}"
