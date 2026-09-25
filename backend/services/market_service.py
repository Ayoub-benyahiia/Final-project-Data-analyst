"""
=============================================================================
MARKET ANALYTICS SERVICE
=============================================================================
Business logic for market pulse, overview, analysis, and filter options.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List

from core.cache import generate_cache_key, get_from_cache, set_in_cache
from core.filters import build_where_clause
from db import db
from schemas import (
    GlobalFilterSchema,
    MarketAnalysisResponse,
    MarketOverviewResponse,
    MarketPulseResponse,
)


def get_filter_options() -> Dict[str, List[str]]:
    """Get dynamic filter options from star schema dimensions."""
    cache_key = "v1_filter_options"
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    cities = [r[0] for r in db.execute("SELECT city_name FROM dim_city ORDER BY is_major_hub DESC, city_name ASC") if r[0]]
    contracts = [r[0] for r in db.execute("SELECT contract_type FROM dim_contract ORDER BY contract_id ASC") if r[0]]
    educations = [r[0] for r in db.execute("SELECT education_level FROM dim_education ORDER BY edu_id ASC") if r[0]]
    experiences = [r[0] for r in db.execute("SELECT experience_label FROM dim_experience ORDER BY exp_id ASC") if r[0]]
    hard_skills = [r[0] for r in db.execute("SELECT tech_name FROM dim_tech ORDER BY tech_name ASC") if r[0]]
    soft_skills = [r[0] for r in db.execute("SELECT soft_skill_name FROM dim_soft_skills ORDER BY soft_skill_name ASC") if r[0]]

    res = {
        "cities": cities,
        "contracts": contracts,
        "educations": educations,
        "experiences": experiences,
        "hard_skills": hard_skills,
        "soft_skills": soft_skills
    }
    set_in_cache(cache_key, res)
    return res


def get_market_pulse() -> MarketPulseResponse:
    """Get market pulse KPIs."""
    cache_key = "v1_market_pulse"
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    total_row = db.fetchone("SELECT COUNT(*) FROM fact_offres")
    total = int(total_row[0]) if total_row else 0

    comp_row = db.fetchone("SELECT COUNT(DISTINCT entreprise_id) FROM fact_offres")
    companies = int(comp_row[0]) if comp_row else 0

    cities_row = db.fetchone("SELECT COUNT(DISTINCT city_id) FROM fact_offres")
    cities = int(cities_row[0]) if cities_row else 0

    remote_row = db.fetchone("""
        SELECT ROUND(SUM(CASE WHEN allows_remote = 1 OR allows_hybrid = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)
        FROM fact_offres
    """)
    remote_pct = float(remote_row[0]) if (remote_row and remote_row[0] is not None) else 0.0

    # Calculate avg experience years from dim_experience min years
    avg_exp_row = db.fetchone("""
        SELECT ROUND(AVG(e.exp_years_min), 1)
        FROM fact_offres f
        JOIN dim_experience e ON f.exp_id = e.exp_id
        WHERE e.exp_years_min IS NOT NULL
    """)
    avg_exp = float(avg_exp_row[0]) if (avg_exp_row and avg_exp_row[0] is not None) else 0.0

    # Dynamically compute top hiring city
    top_city_row = db.fetchone("""
        SELECT c.city_name, COUNT(*) as cnt
        FROM fact_offres f
        JOIN dim_city c ON f.city_id = c.city_id
        GROUP BY c.city_name
        ORDER BY cnt DESC
        LIMIT 1
    """)
    if top_city_row and total > 0:
        top_city_pct = round(top_city_row[1] / total * 100, 1)
        top_city = f"{top_city_row[0]} ({top_city_pct}%)"
    else:
        top_city = None

    # Dynamically compute top in-demand skill
    top_skill_row = db.fetchone("""
        SELECT t.tech_name, COUNT(DISTINCT b.job_id) as cnt
        FROM bridge_tech b
        JOIN dim_tech t ON b.tech_id = t.tech_id
        GROUP BY t.tech_name
        ORDER BY cnt DESC
        LIMIT 1
    """)
    if top_skill_row and total > 0:
        top_skill_pct = round(top_skill_row[1] / total * 100, 1)
        top_skill = f"{top_skill_row[0]} ({top_skill_pct}%)"
    else:
        top_skill = None

    res = {
        "total_jobs": total,
        "total_companies": companies,
        "total_cities": cities,
        "remote_flexibility_pct": remote_pct,
        "avg_experience_years": round(avg_exp, 1),
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "top_city": top_city,
        "top_skill": top_skill
    }
    set_in_cache(cache_key, res)
    return res


def get_market_overview(filters: GlobalFilterSchema) -> MarketOverviewResponse:
    """Get market overview data with filters."""
    where, params = build_where_clause(filters)
    cache_key = generate_cache_key("v1_market_overview", {"where": where, "params": params})
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    # Contract distribution
    contracts_sql = f"""
        SELECT c.contract_type AS name, COUNT(*) AS count
        FROM fact_offres f
        JOIN dim_contract c ON f.contract_id = c.contract_id
        WHERE {where}
        GROUP BY c.contract_type
        ORDER BY count DESC
    """
    contracts_rows = db.execute(contracts_sql, params)
    total_contracts = sum(c for _, c in contracts_rows) or 1
    contract_dist = [{"name": n, "count": c, "pct": round(c / total_contracts * 100, 1)} for n, c in contracts_rows]

    # Yearly trend (Historical Market Trend 2016-2025)
    trend_sql = f"""
        SELECT d.year, COUNT(*) AS count
        FROM fact_offres f
        JOIN dim_date d ON f.date_id = d.date_id
        WHERE {where} AND d.year >= 2016
        GROUP BY d.year
        ORDER BY d.year ASC
    """
    trend_rows = db.execute(trend_sql, params)
    yearly_trend = [{"year": int(y), "count": int(c)} for y, c in trend_rows]

    # Regional hubs
    hubs_sql = f"""
        SELECT c.city_name AS city, COUNT(*) AS count
        FROM fact_offres f
        JOIN dim_city c ON f.city_id = c.city_id
        WHERE {where}
        GROUP BY c.city_name
        ORDER BY count DESC
        LIMIT 10
    """
    hubs_rows = db.query(hubs_sql, params)
    regional_hubs = [{"city": str(r["city"]), "count": int(r["count"])} for r in hubs_rows]

    # Education levels
    edu_sql = f"""
        SELECT e.education_level AS level, COUNT(*) AS count
        FROM fact_offres f
        JOIN dim_education e ON f.edu_id = e.edu_id
        WHERE {where}
        GROUP BY e.education_level
        ORDER BY count DESC
    """
    edu_rows = db.query(edu_sql, params)
    education_levels = [{"level": str(r["level"]), "count": int(r["count"])} for r in edu_rows]

    # Top technologies (Top 15)
    tech_sql = f"""
        SELECT t.tech_name AS name, t.category, COUNT(DISTINCT f.job_id) AS count
        FROM fact_offres f
        JOIN bridge_tech b ON f.job_id = b.job_id
        JOIN dim_tech t ON b.tech_id = t.tech_id
        WHERE {where}
        GROUP BY t.tech_name, t.category
        ORDER BY count DESC
        LIMIT 15
    """
    tech_rows = db.query(tech_sql, params)
    top_technologies = [{"name": str(r["name"]), "category": str(r.get("category") or "Other"), "count": int(r["count"])} for r in tech_rows]

    res = {
        "contract_distribution": contract_dist,
        "yearly_trend": yearly_trend,
        "regional_hubs": regional_hubs,
        "education_levels": education_levels,
        "top_technologies": top_technologies
    }
    set_in_cache(cache_key, res)
    return res


def get_market_analysis(filters: GlobalFilterSchema) -> MarketAnalysisResponse:
    """Get detailed market analysis with filters."""
    where, params = build_where_clause(filters)
    cache_key = generate_cache_key("v1_market_analysis", {"where": where, "params": params})
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    # Workplace Model Breakdown
    wp_sql = f"""
        SELECT
            CASE
                WHEN allows_remote = 1 OR work_mode ILIKE '%remote%' THEN 'Remote'
                WHEN allows_hybrid = 1 OR work_mode ILIKE '%hybrid%' THEN 'Hybrid'
                ELSE 'Onsite'
            END AS model,
            COUNT(*) AS count
        FROM fact_offres f
        WHERE {where}
        GROUP BY model
        ORDER BY count DESC
    """
    wp_rows = db.execute(wp_sql, params)
    total_wp = sum(c for _, c in wp_rows) or 1
    workplace_model = [{"name": n, "count": int(c), "pct": round(c / total_wp * 100, 1)} for n, c in wp_rows]

    # Industry sectors
    sectors_sql = f"""
        SELECT e.industry_sector AS sector, COUNT(*) AS count
        FROM fact_offres f
        JOIN dim_entreprise e ON f.entreprise_id = e.entreprise_id
        WHERE {where} AND e.industry_sector IS NOT NULL AND e.industry_sector != ''
        GROUP BY e.industry_sector
        ORDER BY count DESC
        LIMIT 10
    """
    sectors_rows = db.execute(sectors_sql, params)
    industry_sectors = [{"sector": s or "IT Services & Consulting", "count": int(c)} for s, c in sectors_rows]

    # City growth YoY (2024 vs 2023)
    growth_sql = f"""
        WITH yearly AS (
            SELECT c.city_name AS city, d.year, COUNT(*) AS count
            FROM fact_offres f
            JOIN dim_city c ON f.city_id = c.city_id
            JOIN dim_date d ON f.date_id = d.date_id
            WHERE {where} AND d.year IN (2023, 2024)
            GROUP BY c.city_name, d.year
        )
        SELECT city,
            MAX(CASE WHEN year = 2024 THEN count END) AS y24,
            MAX(CASE WHEN year = 2023 THEN count END) AS y23
        FROM yearly
        GROUP BY city
        ORDER BY y24 DESC NULLS LAST
        LIMIT 10
    """
    growth_rows = db.execute(growth_sql, params)
    city_growth = []
    for city, y24, y23 in growth_rows:
        y24_val = y24 or 0
        y23_val = y23 or 0
        if y23_val > 0:
            yoy = round((y24_val - y23_val) / y23_val * 100, 1)
        elif y24_val > 0:
            yoy = 100.0
        else:
            yoy = 0.0
        city_growth.append({"city": city, "yoy_pct": yoy})

    # Top companies
    comp_sql = f"""
        SELECT e.company_name AS name, COUNT(*) AS count
        FROM fact_offres f
        JOIN dim_entreprise e ON f.entreprise_id = e.entreprise_id
        WHERE {where}
        GROUP BY e.company_name
        ORDER BY count DESC
        LIMIT 15
    """
    comp_rows = db.execute(comp_sql, params)
    top_companies = [{"name": n, "count": int(c)} for n, c in comp_rows]

    # Top roles
    roles_sql = f"""
        SELECT f.job_title AS title, COUNT(*) AS count
        FROM fact_offres f
        WHERE {where}
        GROUP BY f.job_title
        ORDER BY count DESC
        LIMIT 15
    """
    roles_rows = db.execute(roles_sql, params)
    top_roles = [{"title": t, "count": int(c)} for t, c in roles_rows]

    res = {
        "workplace_model": workplace_model,
        "industry_sectors": industry_sectors,
        "city_growth_yoy": city_growth[:10],
        "top_companies": top_companies,
        "top_roles": top_roles
    }
    set_in_cache(cache_key, res)
    return res


def get_market_pulse_preview(filters: GlobalFilterSchema) -> Dict[str, Any]:
    """Get landing page preview data."""
    overview = get_market_overview(filters)
    trending_sql = """
        SELECT
            f.job_id,
            f.job_title,
            e.company_name,
            c.city_name AS city,
            f.is_junior_friendly,
            f.allows_remote
        FROM fact_offres f
        JOIN dim_entreprise e ON f.entreprise_id = e.entreprise_id
        JOIN dim_city c ON f.city_id = c.city_id
        ORDER BY f.job_id DESC
        LIMIT 5
    """
    trending = db.execute(trending_sql)
    trending_jobs = [{
        "job_id": r[0],
        "job_title": r[1],
        "company_name": r[2],
        "city": r[3],
        "is_junior_friendly": r[4],
        "allows_remote": r[5]
    } for r in trending]

    top_techs = overview.top_technologies if hasattr(overview, "top_technologies") else overview["top_technologies"]
    contracts = overview.contract_distribution if hasattr(overview, "contract_distribution") else overview["contract_distribution"]

    return {
        "top_skills": [t.dict() if hasattr(t, "dict") else t for t in top_techs[:5]],
        "contract_distribution": [c.dict() if hasattr(c, "dict") else c for c in contracts],
        "trending_jobs": trending_jobs
    }
