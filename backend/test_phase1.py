"""
=============================================================================
  TECHJOB ANALYTICS — PHASE 1 AUTOMATED TEST VALIDATION SUITE
=============================================================================
  Run Command: python test_phase1.py
=============================================================================
"""

import time
import traceback

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

PREFIX = "/api/v1"

# Module-level warm-up to eliminate cold-start IO latency when invoked via pytest
client.get(f"{PREFIX}/market-pulse")
client.get(f"{PREFIX}/market-overview")

# ---------------------------------------------------------------------------
# 1. FILTER OPTIONS & METADATA TESTS
# ---------------------------------------------------------------------------

def test_01_filter_options_metadata():
    start = time.time()
    res = client.get(f"{PREFIX}/filters/options")
    latency = (time.time() - start) * 1000

    assert res.status_code == 200, f"Status: {res.status_code}"
    assert latency < 200.0, f"Latency too high: {latency:.2f}ms"
    data = res.json()

    assert "cities" in data
    assert len(data["cities"]) == 27, f"Expected 27 cities, got {len(data['cities'])}"
    assert "Casablanca" in data["cities"]
    assert "Rabat" in data["cities"]

    assert "hard_skills" in data
    assert len(data["hard_skills"]) == 121, f"Expected 121 tech skills, got {len(data['hard_skills'])}"
    assert "React" in data["hard_skills"]
    assert "Java" in data["hard_skills"]

# ---------------------------------------------------------------------------
# 2. MARKET PULSE & DATA RECONCILIATION
# ---------------------------------------------------------------------------

def test_02_market_pulse_integrity():
    start = time.time()
    res = client.get(f"{PREFIX}/market-pulse")
    latency = (time.time() - start) * 1000

    assert res.status_code == 200
    assert latency < 200.0
    data = res.json()

    assert data["total_jobs"] == 10782, f"Expected 10782 jobs, got {data['total_jobs']}"
    assert data["total_companies"] == 2767, f"Expected 2767 companies, got {data['total_companies']}"
    assert data["total_cities"] == 27, f"Expected 27 cities, got {data['total_cities']}"
    assert "Casablanca" in data["top_city"]
    assert "Java" in data["top_skill"]

# ---------------------------------------------------------------------------
# 3. MARKET OVERVIEW & MULTI-FILTERING
# ---------------------------------------------------------------------------

def test_03_market_overview_unfiltered():
    start = time.time()
    res = client.get(f"{PREFIX}/market-overview")
    latency = (time.time() - start) * 1000

    assert res.status_code == 200
    assert latency < 200.0
    data = res.json()
    assert len(data["contract_distribution"]) > 0
    assert len(data["regional_hubs"]) > 0
    assert len(data["top_technologies"]) > 0
    total_pct = sum(item["pct"] for item in data["contract_distribution"])
    assert 99.0 <= total_pct <= 101.0, f"Contract distribution sum: {total_pct}%"

def test_04_market_overview_casablanca_filter():
    res = client.get(f"{PREFIX}/market-overview?cities=Casablanca")
    assert res.status_code == 200
    data = res.json()
    casablanca_hubs = [h for h in data["regional_hubs"] if h["city"] == "Casablanca"]
    assert len(casablanca_hubs) == 1
    assert casablanca_hubs[0]["count"] == 5944

def test_05_market_analysis_deep_dive():
    start = time.time()
    res = client.get(f"{PREFIX}/market-analysis")
    latency = (time.time() - start) * 1000

    assert res.status_code == 200
    assert latency < 200.0
    data = res.json()
    assert len(data["workplace_model"]) > 0
    assert len(data["top_companies"]) > 0
    assert len(data["top_roles"]) > 0

# ---------------------------------------------------------------------------
# 4. CANDIDATE STACK MATCHER
# ---------------------------------------------------------------------------

def test_06_stack_matcher_valid():
    payload = {
        "skills": ["React", "TypeScript", "Node.js", "SQL"],
        "city": "Casablanca",
        "junior_only": False
    }
    start = time.time()
    res = client.post(f"{PREFIX}/matcher/analyze", json=payload)
    latency = (time.time() - start) * 1000

    assert res.status_code == 200
    assert latency < 200.0
    data = res.json()

    assert "market_match_rate_pct" in data
    assert data["market_match_rate_pct"] > 0
    assert "compatibility_score" in data
    assert len(data["missing_skills_roi"]) >= 1

def test_07_stack_matcher_empty_skills():
    payload = {"skills": [], "junior_only": False}
    res = client.post(f"{PREFIX}/matcher/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["market_match_rate_pct"] == 0.0

# ---------------------------------------------------------------------------
# 5. SKILL PAIRINGS CO-OCCURRENCE
# ---------------------------------------------------------------------------

def test_08_skill_pairings_react():
    start = time.time()
    res = client.get(f"{PREFIX}/skills/pairings?skill=React")
    latency = (time.time() - start) * 1000

    assert res.status_code == 200
    assert latency < 200.0
    data = res.json()
    assert data["selected_core_skill"] == "React"
    assert len(data["pairings"]) >= 5
    paired_names = [p["skill"] for p in data["pairings"]]
    assert any(tech in paired_names for tech in ["JavaScript", "TypeScript", "Node.js", "Spring Boot", "HTML / CSS", "SQL"])

# ---------------------------------------------------------------------------
# 6. SKILLS CATALOG
# ---------------------------------------------------------------------------

def test_09_skills_catalog():
    start = time.time()
    res = client.get(f"{PREFIX}/skills/catalog")
    latency = (time.time() - start) * 1000

    assert res.status_code == 200
    assert latency < 200.0
    data = res.json()
    assert data["total_hard_skills"] == 121
    assert data["total_soft_skills"] == 50
    assert len(data["hard_skills"]) == 121
    assert len(data["soft_skills"]) == 50

# ---------------------------------------------------------------------------
# MAIN EXECUTION RUNNER
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Warm up queries
    client.get(f"{PREFIX}/market-pulse")
    client.get(f"{PREFIX}/market-overview")

    tests = [
        test_01_filter_options_metadata,
        test_02_market_pulse_integrity,
        test_03_market_overview_unfiltered,
        test_04_market_overview_casablanca_filter,
        test_05_market_analysis_deep_dive,
        test_06_stack_matcher_valid,
        test_07_stack_matcher_empty_skills,
        test_08_skill_pairings_react,
        test_09_skills_catalog,
    ]
    print("\n=======================================================")
    print("  TECHJOB ANALYTICS — PHASE 1 TEST EXECUTION SUITE")
    print(f"  API Prefix: {PREFIX}")
    print("=======================================================")
    passed = 0
    failed = 0
    for t in tests:
        name = t.__name__
        try:
            t()
            print(f"  [PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {name}: {e}")
            traceback.print_exc()
            failed += 1
    print("=======================================================")
    print(f"  RESULTS: {passed} PASSED, {failed} FAILED / {len(tests)} TOTAL")
    print("=======================================================\n")
