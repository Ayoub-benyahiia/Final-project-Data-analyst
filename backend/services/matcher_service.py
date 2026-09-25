"""
=============================================================================
STACK MATCHER SERVICE
=============================================================================
Business logic for stack compatibility analysis and ROI recommendations.
"""


from core.cache import generate_cache_key, get_from_cache, set_in_cache
from core.filters import build_where_clause
from db import db
from schemas import GlobalFilterSchema, StackMatcherRequest, StackMatcherResponse


def analyze_stack(request: StackMatcherRequest, filters: GlobalFilterSchema) -> StackMatcherResponse:
    """Analyze skill stack compatibility and provide ROI recommendations."""
    skills = [s.strip() for s in request.skills if s.strip()]
    where, params = build_where_clause(filters)

    if not skills:
        return {
            "market_match_rate_pct": 0.0,
            "top_missing_booster_skill": {"skill": "N/A", "boost_pct": 0.0},
            "top_hiring_city_for_stack": {"city": "N/A", "count": 0},
            "compatibility_score": 0,
            "missing_skills_roi": [],
            "match_by_seniority": [],
            "matching_companies": []
        }

    cache_key = generate_cache_key("v1_stack_matcher", {"skills": sorted(skills), "where": where, "params": params})
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    # Total jobs under active filters
    total_jobs_row = db.fetchone(f"SELECT COUNT(DISTINCT f.job_id) FROM fact_offres f WHERE {where}", params)
    total_jobs = total_jobs_row[0] if (total_jobs_row and total_jobs_row[0]) else 1

    # Find matching job IDs
    lower_skills = [s.lower() for s in skills]
    tech_placeholders = ",".join(["?"] * len(lower_skills))
    tech_rows = db.execute(f"SELECT tech_id, tech_name FROM dim_tech WHERE LOWER(tech_name) IN ({tech_placeholders})", lower_skills)
    tech_ids = [r[0] for r in tech_rows]
    if not tech_ids:
        return {
            "market_match_rate_pct": 0.0,
            "top_missing_booster_skill": {"skill": "N/A", "boost_pct": 0.0},
            "top_hiring_city_for_stack": {"city": "N/A", "count": 0},
            "compatibility_score": 0,
            "missing_skills_roi": [],
            "match_by_seniority": [],
            "matching_companies": []
        }

    id_placeholders = ",".join(["?"] * len(tech_ids))

    # Vectorized match aggregation using Common Table Expression (CTE) for concurrency safety
    req_match_len = min(len(tech_ids), max(1, int(len(tech_ids) * 0.7)))
    matched_cte = f"""
        WITH _matched AS (
            SELECT f.job_id, f.entreprise_id, f.city_id, f.exp_id
            FROM fact_offres f
            JOIN bridge_tech b ON f.job_id = b.job_id
            WHERE {where} AND b.tech_id IN ({id_placeholders})
            GROUP BY f.job_id, f.entreprise_id, f.city_id, f.exp_id
            HAVING COUNT(DISTINCT b.tech_id) >= ?
        )
    """
    matched_params = params + tech_ids + [req_match_len]

    count_sql = f"{matched_cte} SELECT COUNT(*) FROM _matched"
    match_count_row = db.fetchone(count_sql, matched_params)
    match_count = int(match_count_row[0]) if (match_count_row and match_count_row[0] is not None) else 0
    match_rate = round(match_count / total_jobs * 100, 1) if total_jobs else 0.0
    compat = min(100, round(match_rate * 2.5 + len(skills) * 4))

    # Top missing booster skills
    if match_count > 0:
        missing_sql = f"""
            {matched_cte}
            SELECT dt.tech_name AS skill, dt.category, COUNT(DISTINCT bt.job_id) AS c
            FROM bridge_tech bt
            JOIN dim_tech dt ON bt.tech_id = dt.tech_id
            WHERE bt.job_id IN (SELECT job_id FROM _matched)
              AND dt.tech_id NOT IN ({id_placeholders})
            GROUP BY dt.tech_name, dt.category
            ORDER BY c DESC
            LIMIT 10
        """
        missing_rows = db.execute(missing_sql, matched_params + tech_ids)
        missing_roi = [
            {"skill": sk, "category": cat or "Other", "boost_pct": round(c / match_count * 100, 1)}
            for sk, cat, c in missing_rows
        ]
    else:
        missing_roi = []

    top_booster = missing_roi[0] if missing_roi else {"skill": "N/A", "boost_pct": 0.0}

    # Match by seniority
    if match_count > 0:
        sen_sql = f"""
            {matched_cte}
            SELECT de.tier AS seniority, COUNT(*) AS count
            FROM _matched m
            JOIN dim_experience de ON m.exp_id = de.exp_id
            GROUP BY de.tier
            ORDER BY count DESC
        """
        sen_rows = db.execute(sen_sql, matched_params)
        match_by_sen = [{"seniority": s or "Junior", "count": int(c)} for s, c in sen_rows]
    else:
        match_by_sen = []

    # Top hiring city
    if match_count > 0:
        city_sql = f"""
            {matched_cte}
            SELECT dc.city_name AS city, COUNT(*) AS count
            FROM _matched m
            JOIN dim_city dc ON m.city_id = dc.city_id
            GROUP BY dc.city_name
            ORDER BY count DESC
            LIMIT 1
        """
        top_city_row = db.fetchone(city_sql, matched_params)
        top_city_obj = {"city": top_city_row[0], "count": int(top_city_row[1])} if top_city_row else {"city": "N/A", "count": 0}
    else:
        top_city_obj = {"city": "N/A", "count": 0}

    # Matching companies
    if match_count > 0:
        comp_sql = f"""
            {matched_cte}
            SELECT de.company_name AS name, COUNT(*) AS count
            FROM _matched m
            JOIN dim_entreprise de ON m.entreprise_id = de.entreprise_id
            GROUP BY de.company_name
            ORDER BY count DESC
            LIMIT 10
        """
        comp_rows = db.execute(comp_sql, matched_params)
        matching_companies = [{"name": n, "count": int(c)} for n, c in comp_rows]
    else:
        matching_companies = []

    res = {
        "market_match_rate_pct": match_rate,
        "top_missing_booster_skill": top_booster,
        "top_hiring_city_for_stack": top_city_obj,
        "compatibility_score": compat,
        "missing_skills_roi": missing_roi,
        "match_by_seniority": match_by_sen,
        "matching_companies": matching_companies
    }
    set_in_cache(cache_key, res)
    return res
