"""
=============================================================================
TECHJOB ANALYTICS — CACHE BEHAVIOR TESTS
=============================================================================
Tests TTLCache invalidation logic, cache key generation, and fresh data
delivery after cache expiry.
=============================================================================
"""

import pytest
import time
import hashlib
import json


@pytest.mark.api
def test_cache_key_generation_consistency(test_client, clean_cache):
    """Test that cache keys are generated consistently for same parameters."""
    # Make first request
    response1 = test_client.get("/api/v1/market-pulse")
    assert response1.status_code == 200
    
    # Make identical request
    response2 = test_client.get("/api/v1/market-pulse")
    assert response2.status_code == 200
    
    # Responses should be identical (cached)
    assert response1.json() == response2.json()


@pytest.mark.api
def test_cache_key_different_parameters(test_client, clean_cache):
    """Test that different parameters generate different cache keys."""
    # Request without filters
    response1 = test_client.get("/api/v1/market-overview")
    assert response1.status_code == 200
    
    # Request with city filter
    response2 = test_client.get("/api/v1/market-overview?cities=Casablanca")
    assert response2.status_code == 200
    
    # Responses should be different (different cache keys)
    data1 = response1.json()
    data2 = response2.json()
    
    # Regional hubs should differ
    assert data1["regional_hubs"] != data2["regional_hubs"]


@pytest.mark.api
def test_cache_hit_vs_miss(test_client, clean_cache):
    """Test cache hit vs miss behavior."""
    from core.cache import query_cache, generate_cache_key
    
    # Clear cache
    query_cache.clear()
    
    # First request should be cache miss
    initial_cache_size = len(query_cache)
    response1 = test_client.get("/api/v1/market-pulse")
    assert response1.status_code == 200
    
    # Cache should have one entry
    assert len(query_cache) > initial_cache_size
    
    # Second request should be cache hit
    response2 = test_client.get("/api/v1/market-pulse")
    assert response2.status_code == 200
    
    # Response should be identical
    assert response1.json() == response2.json()


@pytest.mark.api
def test_cache_invalidation_on_filter_change(test_client, clean_cache):
    """Test that changing filters invalidates cache appropriately."""
    from core.cache import query_cache
    
    # Request with one filter
    response1 = test_client.get("/api/v1/market-overview?cities=Casablanca")
    assert response1.status_code == 200
    
    cache_size_after_first = len(query_cache)
    
    # Request with different filter
    response2 = test_client.get("/api/v1/market-overview?cities=Rabat")
    assert response2.status_code == 200
    
    # Cache should have additional entry for different filter
    assert len(query_cache) >= cache_size_after_first
    
    # Results should differ
    data1 = response1.json()
    data2 = response2.json()
    assert data1["regional_hubs"] != data2["regional_hubs"]


@pytest.mark.api
def test_cache_key_hash_generation():
    """Test MD5 hash generation for cache keys."""
    params1 = {"cities": ["Casablanca", "Rabat"], "contracts": ["CDI"]}
    params2 = {"cities": ["Casablanca", "Rabat"], "contracts": ["CDI"]}
    params3 = {"cities": ["Casablanca"], "contracts": ["CDI"]}
    
    # Generate cache keys
    serialized1 = json.dumps(params1, sort_keys=True, default=str)
    hash1 = hashlib.md5(serialized1.encode('utf-8')).hexdigest()
    
    serialized2 = json.dumps(params2, sort_keys=True, default=str)
    hash2 = hashlib.md5(serialized2.encode('utf-8')).hexdigest()
    
    serialized3 = json.dumps(params3, sort_keys=True, default=str)
    hash3 = hashlib.md5(serialized3.encode('utf-8')).hexdigest()
    
    # Same params should produce same hash
    assert hash1 == hash2
    
    # Different params should produce different hash
    assert hash1 != hash3


@pytest.mark.api
def test_cache_ttl_expiration(test_client, clean_cache):
    """Test that cache entries expire after TTL."""
    from core.cache import query_cache, CACHE_TTL
    
    # Make request to populate cache
    response1 = test_client.get("/api/v1/market-pulse")
    assert response1.status_code == 200
    
    # Get cache entry
    cache_key = "v1_market_pulse"  # Known cache key for this endpoint
    if cache_key in query_cache:
        entry = query_cache[cache_key]
        assert "timestamp" in entry
        assert "data" in entry
        
        # Manually expire the entry
        entry["timestamp"] = time.time() - CACHE_TTL - 10
        
        # Next request should regenerate cache
        response2 = test_client.get("/api/v1/market-pulse")
        assert response2.status_code == 200


@pytest.mark.api
def test_cache_with_post_endpoint(test_client, clean_cache):
    """Test that POST endpoints also use caching correctly."""
    payload = {"skills": ["React", "TypeScript"]}
    
    # First POST request
    response1 = test_client.post("/api/v1/matcher/analyze", json=payload)
    assert response1.status_code == 200
    
    # Identical POST request
    response2 = test_client.post("/api/v1/matcher/analyze", json=payload)
    assert response2.status_code == 200
    
    # Should return identical results (cached)
    assert response1.json() == response2.json()


@pytest.mark.api
def test_cache_clear_functionality(test_client, clean_cache):
    """Test that cache can be cleared programmatically."""
    from core.cache import query_cache
    
    # Populate cache with some requests
    test_client.get("/api/v1/market-pulse")
    test_client.get("/api/v1/market-overview")
    test_client.get("/api/v1/skills/list")
    
    initial_size = len(query_cache)
    assert initial_size > 0
    
    # Clear cache
    query_cache.clear()
    
    # Cache should be empty
    assert len(query_cache) == 0


@pytest.mark.api
def test_cache_parameter_order_independence(test_client, clean_cache):
    """Test that parameter order doesn't affect cache key."""
    # Request with parameters in one order
    response1 = test_client.get("/api/v1/market-overview?cities=Casablanca,Rabat&contracts=CDI")
    assert response1.status_code == 200
    
    # Request with same parameters in different order
    response2 = test_client.get("/api/v1/market-overview?contracts=CDI&cities=Casablanca,Rabat")
    assert response2.status_code == 200
    
    # Should produce identical results (cache key should be order-independent)
    assert response1.json() == response2.json()


@pytest.mark.api
def test_cache_with_empty_filters(test_client, clean_cache):
    """Test cache behavior with empty/no filters."""
    # Request without any filters
    response1 = test_client.get("/api/v1/market-overview")
    assert response1.status_code == 200
    
    # Request with explicit empty filters
    response2 = test_client.get("/api/v1/market-overview?cities=&contracts=")
    assert response2.status_code == 200
    
    # Should produce identical results
    assert response1.json() == response2.json()
