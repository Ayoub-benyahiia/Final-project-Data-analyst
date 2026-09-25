"""
=============================================================================
TECHJOB ANALYTICS — PERFORMANCE BENCHMARK TESTS
=============================================================================
Asserts that query execution on the sample DuckDB instance stays under 15ms.
Uses pytest-benchmark for regression detection.
=============================================================================
"""

import pytest
import time


@pytest.mark.benchmark
def test_simple_count_query_performance(sample_duckdb_db):
    """Benchmark simple COUNT query."""
    start = time.time()
    result = sample_duckdb_db.execute("SELECT COUNT(*) FROM fact_offres").fetchone()
    elapsed_ms = (time.time() - start) * 1000
    
    assert result[0] == 5, "Query should return 5 records"
    assert elapsed_ms < 15, f"Simple COUNT query took {elapsed_ms:.2f}ms, expected < 15ms"


@pytest.mark.benchmark
def test_join_query_performance(sample_duckdb_db):
    """Benchmark JOIN query between fact and dimensions."""
    start = time.time()
    result = sample_duckdb_db.execute("""
        SELECT c.city_name, COUNT(*) as count
        FROM fact_offres f
        JOIN dim_city c ON f.city_id = c.city_id
        GROUP BY c.city_name
    """).fetchall()
    elapsed_ms = (time.time() - start) * 1000
    
    assert len(result) == 3, "Should return 3 cities"
    assert elapsed_ms < 15, f"JOIN query took {elapsed_ms:.2f}ms, expected < 15ms"


@pytest.mark.benchmark
def test_complex_aggregation_query_performance(sample_duckdb_db):
    """Benchmark complex aggregation with multiple JOINs."""
    start = time.time()
    result = sample_duckdb_db.execute("""
        SELECT t.tech_name, COUNT(DISTINCT f.job_id) as count
        FROM fact_offres f
        JOIN bridge_tech b ON f.job_id = b.job_id
        JOIN dim_tech t ON b.tech_id = t.tech_id
        GROUP BY t.tech_name
        ORDER BY count DESC
    """).fetchall()
    elapsed_ms = (time.time() - start) * 1000
    
    assert len(result) == 5, "Should return 5 technologies"
    assert elapsed_ms < 15, f"Complex aggregation took {elapsed_ms:.2f}ms, expected < 15ms"


@pytest.mark.benchmark
def test_skill_cooccurrence_query_performance(sample_duckdb_db):
    """Benchmark skill co-occurrence self-join query."""
    start = time.time()
    result = sample_duckdb_db.execute("""
        SELECT t1.tech_name as skill1, t2.tech_name as skill2, COUNT(DISTINCT b1.job_id) as co_count
        FROM bridge_tech b1
        JOIN bridge_tech b2 ON b1.job_id = b2.job_id
        JOIN dim_tech t1 ON b1.tech_id = t1.tech_id
        JOIN dim_tech t2 ON b2.tech_id = t2.tech_id
        WHERE b1.tech_id != b2.tech_id
        GROUP BY t1.tech_name, t2.tech_name
        ORDER BY co_count DESC
        LIMIT 10
    """).fetchall()
    elapsed_ms = (time.time() - start) * 1000
    
    assert len(result) <= 10, "Should return at most 10 results"
    assert elapsed_ms < 15, f"Co-occurrence query took {elapsed_ms:.2f}ms, expected < 15ms"


@pytest.mark.benchmark
def test_cte_query_performance(sample_duckdb_db):
    """Benchmark Common Table Expression (CTE) query."""
    start = time.time()
    result = sample_duckdb_db.execute("""
        WITH yearly AS (
            SELECT d.year, COUNT(*) as count
            FROM fact_offres f
            JOIN dim_date d ON f.date_id = d.date_id
            GROUP BY d.year
        )
        SELECT year, count FROM yearly ORDER BY year
    """).fetchall()
    elapsed_ms = (time.time() - start) * 1000
    
    assert len(result) == 3, "Should return 3 years"
    assert elapsed_ms < 15, f"CTE query took {elapsed_ms:.2f}ms, expected < 15ms"


@pytest.mark.benchmark
def test_filter_performance(sample_duckdb_db):
    """Benchmark query with WHERE clause filtering."""
    start = time.time()
    result = sample_duckdb_db.execute("""
        SELECT COUNT(*) as count
        FROM fact_offres f
        JOIN dim_city c ON f.city_id = c.city_id
        WHERE c.city_name = 'Casablanca'
    """).fetchone()
    elapsed_ms = (time.time() - start) * 1000
    
    assert result[0] == 2, "Casablanca should have 2 jobs"
    assert elapsed_ms < 15, f"Filtered query took {elapsed_ms:.2f}ms, expected < 15ms"


@pytest.mark.benchmark
def test_subquery_performance(sample_duckdb_db):
    """Benchmark query with subquery."""
    start = time.time()
    result = sample_duckdb_db.execute("""
        SELECT f.job_title, f.nb_tech_skills
        FROM fact_offres f
        WHERE f.job_id IN (
            SELECT job_id FROM bridge_tech
            WHERE tech_id = 1
        )
    """).fetchall()
    elapsed_ms = (time.time() - start) * 1000
    
    assert len(result) == 2, "Should return 2 jobs with React"
    assert elapsed_ms < 15, f"Subquery took {elapsed_ms:.2f}ms, expected < 15ms"
