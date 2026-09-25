"""
=============================================================================
IN-MEMORY TTL CACHE (600s TTL)
=============================================================================
Provides simple in-memory caching with TTL for query results.
"""

import hashlib
import json
import threading
import time
from typing import Any, Dict, Optional

CACHE_TTL = 600
MAX_CACHE_SIZE = 1000
query_cache: Dict[str, Dict[str, Any]] = {}
_cache_lock = threading.Lock()


def generate_cache_key(prefix: str, params: Dict[str, Any]) -> str:
    """Generate a unique cache key from prefix and parameters."""
    serialized = json.dumps(params, sort_keys=True, default=str)
    hashed = hashlib.md5(serialized.encode('utf-8')).hexdigest()
    return f"{prefix}:{hashed}"


def get_from_cache(cache_key: str) -> Optional[Any]:
    """Retrieve data from cache if it exists and hasn't expired."""
    with _cache_lock:
        if cache_key in query_cache:
            entry = query_cache[cache_key]
            if time.time() - entry["timestamp"] < CACHE_TTL:
                return entry["data"]
            else:
                del query_cache[cache_key]
        return None


def set_in_cache(cache_key: str, data: Any):
    """Store data in cache with current timestamp, evicting expired or oldest items if at capacity."""
    now = time.time()
    with _cache_lock:
        # If cache exceeds limit, purge expired items
        if len(query_cache) >= MAX_CACHE_SIZE:
            expired_keys = [k for k, v in query_cache.items() if now - v["timestamp"] >= CACHE_TTL]
            for k in expired_keys:
                del query_cache[k]

            # If still over capacity, evict the oldest 10% of entries
            if len(query_cache) >= MAX_CACHE_SIZE:
                sorted_by_age = sorted(query_cache.items(), key=lambda item: item[1]["timestamp"])
                evict_count = max(1, len(query_cache) // 10)
                for k, _ in sorted_by_age[:evict_count]:
                    del query_cache[k]

        query_cache[cache_key] = {
            "timestamp": now,
            "data": data
        }


def clear_cache():
    """Clear all cached data."""
    with _cache_lock:
        query_cache.clear()
