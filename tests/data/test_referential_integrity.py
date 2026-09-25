"""
=============================================================================
TECHJOB ANALYTICS — REFERENTIAL INTEGRITY TESTS
=============================================================================
Asserts that all foreign keys in the Fact table exist within their respective
Dimension tables (no orphaned records). Validates bridge table integrity.
=============================================================================
"""

import pytest


@pytest.mark.data
def test_fact_date_fk_integrity(sample_duckdb_db):
    """Verify all date_id values in fact_offres exist in dim_date."""
    orphaned = sample_duckdb_db.execute("""
        SELECT f.job_id, f.date_id
        FROM fact_offres f
        LEFT JOIN dim_date d ON f.date_id = d.date_id
        WHERE d.date_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned date_id references in fact_offres"


@pytest.mark.data
def test_fact_city_fk_integrity(sample_duckdb_db):
    """Verify all city_id values in fact_offres exist in dim_city."""
    orphaned = sample_duckdb_db.execute("""
        SELECT f.job_id, f.city_id
        FROM fact_offres f
        LEFT JOIN dim_city c ON f.city_id = c.city_id
        WHERE c.city_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned city_id references in fact_offres"


@pytest.mark.data
def test_fact_contract_fk_integrity(sample_duckdb_db):
    """Verify all contract_id values in fact_offres exist in dim_contract."""
    orphaned = sample_duckdb_db.execute("""
        SELECT f.job_id, f.contract_id
        FROM fact_offres f
        LEFT JOIN dim_contract c ON f.contract_id = c.contract_id
        WHERE c.contract_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned contract_id references in fact_offres"


@pytest.mark.data
def test_fact_education_fk_integrity(sample_duckdb_db):
    """Verify all edu_id values in fact_offres exist in dim_education."""
    orphaned = sample_duckdb_db.execute("""
        SELECT f.job_id, f.edu_id
        FROM fact_offres f
        LEFT JOIN dim_education e ON f.edu_id = e.edu_id
        WHERE e.edu_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned edu_id references in fact_offres"


@pytest.mark.data
def test_fact_experience_fk_integrity(sample_duckdb_db):
    """Verify all exp_id values in fact_offres exist in dim_experience."""
    orphaned = sample_duckdb_db.execute("""
        SELECT f.job_id, f.exp_id
        FROM fact_offres f
        LEFT JOIN dim_experience e ON f.exp_id = e.exp_id
        WHERE e.exp_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned exp_id references in fact_offres"


@pytest.mark.data
def test_fact_entreprise_fk_integrity(sample_duckdb_db):
    """Verify all entreprise_id values in fact_offres exist in dim_entreprise."""
    orphaned = sample_duckdb_db.execute("""
        SELECT f.job_id, f.entreprise_id
        FROM fact_offres f
        LEFT JOIN dim_entreprise e ON f.entreprise_id = e.entreprise_id
        WHERE e.entreprise_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned entreprise_id references in fact_offres"


@pytest.mark.data
def test_bridge_tech_job_fk_integrity(sample_duckdb_db):
    """Verify all job_id values in bridge_tech exist in fact_offres."""
    orphaned = sample_duckdb_db.execute("""
        SELECT bt.job_id, bt.tech_id
        FROM bridge_tech bt
        LEFT JOIN fact_offres f ON bt.job_id = f.job_id
        WHERE f.job_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned job_id references in bridge_tech"


@pytest.mark.data
def test_bridge_tech_tech_fk_integrity(sample_duckdb_db):
    """Verify all tech_id values in bridge_tech exist in dim_tech."""
    orphaned = sample_duckdb_db.execute("""
        SELECT bt.job_id, bt.tech_id
        FROM bridge_tech bt
        LEFT JOIN dim_tech t ON bt.tech_id = t.tech_id
        WHERE t.tech_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned tech_id references in bridge_tech"


@pytest.mark.data
def test_bridge_soft_skills_job_fk_integrity(sample_duckdb_db):
    """Verify all job_id values in bridge_soft_skills exist in fact_offres."""
    orphaned = sample_duckdb_db.execute("""
        SELECT bs.job_id, bs.soft_id
        FROM bridge_soft_skills bs
        LEFT JOIN fact_offres f ON bs.job_id = f.job_id
        WHERE f.job_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned job_id references in bridge_soft_skills"


@pytest.mark.data
def test_bridge_soft_skills_soft_fk_integrity(sample_duckdb_db):
    """Verify all soft_id values in bridge_soft_skills exist in dim_soft_skills."""
    orphaned = sample_duckdb_db.execute("""
        SELECT bs.job_id, bs.soft_id
        FROM bridge_soft_skills bs
        LEFT JOIN dim_soft_skills s ON bs.soft_id = s.soft_id
        WHERE s.soft_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned soft_id references in bridge_soft_skills"


@pytest.mark.data
def test_bridge_languages_job_fk_integrity(sample_duckdb_db):
    """Verify all job_id values in bridge_languages exist in fact_offres."""
    orphaned = sample_duckdb_db.execute("""
        SELECT bl.job_id, bl.language_id
        FROM bridge_languages bl
        LEFT JOIN fact_offres f ON bl.job_id = f.job_id
        WHERE f.job_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned job_id references in bridge_languages"


@pytest.mark.data
def test_bridge_languages_language_fk_integrity(sample_duckdb_db):
    """Verify all language_id values in bridge_languages exist in dim_languages."""
    orphaned = sample_duckdb_db.execute("""
        SELECT bl.job_id, bl.language_id
        FROM bridge_languages bl
        LEFT JOIN dim_languages l ON bl.language_id = l.language_id
        WHERE l.language_id IS NULL
    """).fetchall()
    
    assert len(orphaned) == 0, f"Found {len(orphaned)} orphaned language_id references in bridge_languages"


@pytest.mark.data
def test_no_duplicate_bridge_tech_entries(sample_duckdb_db):
    """Verify no duplicate (job_id, tech_id) pairs in bridge_tech."""
    duplicates = sample_duckdb_db.execute("""
        SELECT job_id, tech_id, COUNT(*) as count
        FROM bridge_tech
        GROUP BY job_id, tech_id
        HAVING COUNT(*) > 1
    """).fetchall()
    
    assert len(duplicates) == 0, f"Found {len(duplicates)} duplicate (job_id, tech_id) pairs in bridge_tech"


@pytest.mark.data
def test_no_duplicate_bridge_soft_skills_entries(sample_duckdb_db):
    """Verify no duplicate (job_id, soft_id) pairs in bridge_soft_skills."""
    duplicates = sample_duckdb_db.execute("""
        SELECT job_id, soft_id, COUNT(*) as count
        FROM bridge_soft_skills
        GROUP BY job_id, soft_id
        HAVING COUNT(*) > 1
    """).fetchall()
    
    assert len(duplicates) == 0, f"Found {len(duplicates)} duplicate (job_id, soft_id) pairs in bridge_soft_skills"
