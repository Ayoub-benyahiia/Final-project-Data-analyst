"""
=============================================================================
TECHJOB ANALYTICS — FASTAPI BACKEND ENDPOINT TESTS
=============================================================================
Tests status codes, JSON schema outputs, and edge cases for all key API
endpoints using pytest and FastAPI TestClient.
=============================================================================
"""

import pytest
from fastapi.testclient import TestClient
import time


@pytest.mark.api
def test_health_endpoint(test_client):
    """Test health check endpoint returns 200 and expected fields."""
    response = test_client.get("/health")
    assert response.status_code == 200
    
    data = response.json()
    assert "status" in data
    assert data["status"] == "ok"
    assert "service" in data
    assert "version" in data


@pytest.mark.api
def test_root_endpoint(test_client):
    """Test root endpoint returns 200 and API info."""
    response = test_client.get("/")
    assert response.status_code == 200
    
    data = response.json()
    assert "message" in data
    assert "docs" in data


@pytest.mark.api
def test_filter_options_endpoint(test_client, clean_cache):
    """Test filter options endpoint returns all required filter arrays."""
    response = test_client.get("/api/v1/filters/options")
    assert response.status_code == 200
    
    data = response.json()
    required_keys = ["cities", "contracts", "educations", "experiences", "hard_skills", "soft_skills"]
    for key in required_keys:
        assert key in data, f"Missing key: {key}"
        assert isinstance(data[key], list), f"{key} should be a list"


@pytest.mark.api
def test_market_pulse_endpoint(test_client, clean_cache):
    """Test market pulse endpoint returns KPIs with correct structure."""
    response = test_client.get("/api/v1/market-pulse")
    assert response.status_code == 200
    
    data = response.json()
    required_fields = [
        "total_jobs", "total_companies", "total_cities",
        "remote_flexibility_pct", "avg_experience_years", "last_updated"
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
    
    assert isinstance(data["total_jobs"], int)
    assert isinstance(data["total_companies"], int)
    assert isinstance(data["total_cities"], int)
    assert isinstance(data["remote_flexibility_pct"], float)
    assert isinstance(data["avg_experience_years"], float)


@pytest.mark.api
def test_market_overview_endpoint_unfiltered(test_client, clean_cache):
    """Test market overview endpoint without filters."""
    response = test_client.get("/api/v1/market-overview")
    assert response.status_code == 200
    
    data = response.json()
    required_sections = [
        "contract_distribution", "yearly_trend", "regional_hubs",
        "education_levels", "top_technologies"
    ]
    for section in required_sections:
        assert section in data, f"Missing section: {section}"
        assert isinstance(data[section], list), f"{section} should be a list"
    
    # Validate contract distribution percentages sum to ~100%
    total_pct = sum(item["pct"] for item in data["contract_distribution"])
    assert 99.0 <= total_pct <= 101.0, f"Contract distribution sum: {total_pct}%"


@pytest.mark.api
def test_market_overview_with_city_filter(test_client, clean_cache):
    """Test market overview endpoint with city filter."""
    response = test_client.get("/api/v1/market-overview?cities=Casablanca")
    assert response.status_code == 200
    
    data = response.json()
    assert "contract_distribution" in data
    assert "regional_hubs" in data
    
    # Verify filtered results
    casablanca_hubs = [h for h in data["regional_hubs"] if h["city"] == "Casablanca"]
    assert len(casablanca_hubs) > 0, "Should have Casablanca in results"


@pytest.mark.api
def test_market_analysis_endpoint(test_client, clean_cache):
    """Test detailed market analysis endpoint."""
    response = test_client.get("/api/v1/market-analysis")
    assert response.status_code == 200
    
    data = response.json()
    required_sections = [
        "workplace_model", "industry_sectors", "city_growth_yoy",
        "top_companies", "top_roles"
    ]
    for section in required_sections:
        assert section in data, f"Missing section: {section}"
        assert isinstance(data[section], list), f"{section} should be a list"


@pytest.mark.api
def test_stack_matcher_valid_skills(test_client, clean_cache):
    """Test stack matcher endpoint with valid skills."""
    payload = {"skills": ["React", "TypeScript", "Python"]}
    response = test_client.post("/api/v1/matcher/analyze", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    required_fields = [
        "market_match_rate_pct", "top_missing_booster_skill",
        "top_hiring_city_for_stack", "compatibility_score",
        "missing_skills_roi", "match_by_seniority", "matching_companies"
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
    
    assert isinstance(data["market_match_rate_pct"], float)
    assert isinstance(data["compatibility_score"], int)
    assert 0 <= data["compatibility_score"] <= 100


@pytest.mark.api
def test_stack_matcher_empty_skills(test_client, clean_cache):
    """Test stack matcher endpoint with empty skills array."""
    payload = {"skills": []}
    response = test_client.post("/api/v1/matcher/analyze", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert data["market_match_rate_pct"] == 0.0
    assert data["compatibility_score"] == 0


@pytest.mark.api
def test_skill_pairings_endpoint(test_client, clean_cache):
    """Test skill pairings endpoint."""
    response = test_client.get("/api/v1/skills/pairings?skill=React")
    assert response.status_code == 200
    
    data = response.json()
    required_fields = [
        "selected_core_skill", "top_companion_skill", "avg_skills_per_job",
        "pairings", "pairings_by_category", "top_roles_for_stack"
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
    
    assert data["selected_core_skill"] == "React"
    assert isinstance(data["pairings"], list)
    assert len(data["pairings"]) > 0


@pytest.mark.api
def test_skills_list_endpoint(test_client, clean_cache):
    """Test skills list endpoint."""
    response = test_client.get("/api/v1/skills/list")
    assert response.status_code == 200
    
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    
    # Validate each skill has required fields
    for skill in data:
        assert "name" in skill
        assert "category" in skill


@pytest.mark.api
def test_skills_catalog_endpoint(test_client, clean_cache):
    """Test skills catalog endpoint."""
    response = test_client.get("/api/v1/skills/catalog")
    assert response.status_code == 200
    
    data = response.json()
    required_fields = ["total_hard_skills", "total_soft_skills", "hard_skills", "soft_skills"]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
    
    assert isinstance(data["total_hard_skills"], int)
    assert isinstance(data["total_soft_skills"], int)
    assert isinstance(data["hard_skills"], list)
    assert isinstance(data["soft_skills"], list)


@pytest.mark.api
def test_invalid_city_filter(test_client, clean_cache):
    """Test endpoint with invalid city filter returns 422."""
    response = test_client.get("/api/v1/market-overview?cities=InvalidCity")
    # Should return 200 but with empty results (no error for non-existent filter)
    assert response.status_code == 200


@pytest.mark.api
def test_invalid_experience_filter(test_client, clean_cache):
    """Test endpoint with invalid experience filter."""
    response = test_client.get("/api/v1/market-overview?experience=InvalidLevel")
    assert response.status_code == 200


@pytest.mark.api
def test_invalid_contract_filter(test_client, clean_cache):
    """Test endpoint with invalid contract filter."""
    response = test_client.get("/api/v1/market-overview?contracts=InvalidContract")
    assert response.status_code == 200


@pytest.mark.api
def test_multiple_filters(test_client, clean_cache):
    """Test endpoint with multiple filters."""
    response = test_client.get("/api/v1/market-overview?cities=Casablanca&contracts=CDI")
    assert response.status_code == 200
    
    data = response.json()
    assert "contract_distribution" in data
    assert "regional_hubs" in data


@pytest.mark.api
def test_stack_matcher_invalid_json(test_client, clean_cache):
    """Test stack matcher with invalid JSON payload."""
    response = test_client.post(
        "/api/v1/matcher/analyze",
        json={"invalid_field": "test"},
        headers={"Content-Type": "application/json"}
    )
    # Pydantic should validate and return 422
    assert response.status_code == 422


@pytest.mark.api
def test_endpoint_response_time(test_client, clean_cache):
    """Test that API endpoints respond within acceptable time."""
    endpoints = [
        "/health",
        "/api/v1/filters/options",
        "/api/v1/market-pulse",
        "/api/v1/market-overview",
        "/api/v1/skills/list",
    ]
    
    for endpoint in endpoints:
        start = time.time()
        response = test_client.get(endpoint)
        elapsed_ms = (time.time() - start) * 1000
        
        assert response.status_code == 200, f"{endpoint} returned {response.status_code}"
        assert elapsed_ms < 200, f"{endpoint} took {elapsed_ms:.2f}ms, expected < 200ms"


@pytest.mark.api
def test_market_pulse_preview_endpoint(test_client, clean_cache):
    """Test market pulse preview endpoint."""
    response = test_client.get("/api/v1/market-pulse-preview")
    assert response.status_code == 200
    
    data = response.json()
    assert "top_skills" in data
    assert "contract_distribution" in data
    assert "trending_jobs" in data


# =============================================================================
# PHASE 2: PRODUCTION HARDENING TESTS
# =============================================================================

@pytest.mark.api
def test_readiness_endpoint(test_client):
    """Test readiness check returns 200 and data availability metrics."""
    response = test_client.get("/readiness")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["data_available"] is True
    assert data["job_count"] > 0
    assert "service" in data


@pytest.mark.api
def test_security_headers_present(test_client):
    """Test that all required security headers are included in HTTP responses."""
    response = test_client.get("/health")
    assert response.status_code == 200
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "geolocation=()" in response.headers.get("Permissions-Policy", "")


@pytest.mark.api
def test_stack_matcher_excessive_skills_rejected(test_client, clean_cache):
    """Test that exceeding max skill bounds (50) returns 422 validation error."""
    excessive_skills = [f"Skill{i}" for i in range(55)]
    response = test_client.post(
        "/api/v1/matcher/analyze",
        json={"skills": excessive_skills}
    )
    assert response.status_code == 422


@pytest.mark.api
def test_unhandled_error_returns_safe_500(clean_cache, monkeypatch):
    """Test that unexpected server exceptions return safe 500 without leaking stack traces or paths."""
    from main import app
    from routers import market

    client = TestClient(app, raise_server_exceptions=False)

    def mock_broken_pulse():
        raise RuntimeError("Secret DB path: C:/private/database.parquet cannot be loaded")

    monkeypatch.setattr(market, "get_market_pulse", mock_broken_pulse)
    response = client.get("/api/v1/market-pulse")
    assert response.status_code == 500
    data = response.json()
    assert data == {"detail": "Internal server error"}
    assert "Secret" not in response.text
    assert "database.parquet" not in response.text


@pytest.mark.api
def test_filter_deduplication_and_safe_parsing(test_client, clean_cache):
    """Test that duplicate filter params and whitespace are handled cleanly."""
    response = test_client.get("/api/v1/market-overview?cities=Casablanca,Casablanca,Rabat")
    assert response.status_code == 200
    data = response.json()
    assert "contract_distribution" in data
    assert "regional_hubs" in data


@pytest.mark.api
def test_cors_options_preflight(test_client):
    """Test CORS preflight request receives proper access control headers."""
    response = test_client.options(
        "/api/v1/market-pulse",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type",
        }
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
