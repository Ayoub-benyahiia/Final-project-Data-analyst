"""
=============================================================================
SKILLS ANALYTICS SERVICE
=============================================================================
Business logic for skill pairings, skills list, and skills catalog.
"""

from typing import List

from core.cache import generate_cache_key, get_from_cache, set_in_cache
from core.filters import build_where_clause
from db import db
from schemas import (
    GlobalFilterSchema,
    SkillListItem,
    SkillPairingsResponse,
    SkillsCatalogResponse,
)


def get_skill_pairings(skill: str, filters: GlobalFilterSchema) -> SkillPairingsResponse:
    """Get skill co-occurrence analysis for a target skill."""
    target = skill.strip() if skill else "React"
    where, params = build_where_clause(filters)

    cache_key = generate_cache_key("v1_skill_pairings", {"skill": target, "where": where, "params": params})
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    target_tech = db.fetchone("SELECT tech_id, tech_name FROM dim_tech WHERE LOWER(tech_name) = LOWER(?)", [target])
    if not target_tech:
        target_tech = db.fetchone("SELECT tech_id, tech_name FROM dim_tech WHERE LOWER(tech_name) LIKE ? LIMIT 1", [f"%{target.lower()}%"])
        if not target_tech:
            return {
                "selected_core_skill": target,
                "top_companion_skill": "N/A",
                "avg_skills_per_job": 0.0,
                "pairings": [],
                "pairings_by_category": [],
                "top_roles_for_stack": []
            }

    target_id, canonical_name = target_tech[0], target_tech[1]

    # Total jobs requiring target skill
    total_target_sql = f"""
        SELECT COUNT(DISTINCT f.job_id)
        FROM fact_offres f
        JOIN bridge_tech b ON f.job_id = b.job_id
        WHERE {where} AND b.tech_id = ?
    """
    total_source_row = db.fetchone(total_target_sql, params + [target_id])
    total_source = total_source_row[0] if (total_source_row and total_source_row[0]) else 1

    # Top companion skill & pairings
    pairings_sql = f"""
        SELECT dt.tech_name AS skill, dt.category, COUNT(DISTINCT b2.job_id) AS co_count
        FROM bridge_tech b1
        JOIN bridge_tech b2 ON b1.job_id = b2.job_id
        JOIN dim_tech dt ON b2.tech_id = dt.tech_id
        JOIN fact_offres f ON b1.job_id = f.job_id
        WHERE {where} AND b1.tech_id = ? AND b2.tech_id != ?
        GROUP BY dt.tech_name, dt.category
        ORDER BY co_count DESC
        LIMIT 15
    """
    pair_rows = db.execute(pairings_sql, params + [target_id, target_id])
    pairings = [{"skill": s, "category": cat or "Other", "cooccurrence_pct": round(c / total_source * 100, 1)} for s, cat, c in pair_rows]

    top_companion = pairings[0]["skill"] if pairings else "N/A"

    # Average skills per job for postings with target skill
    avg_sql = f"""
        SELECT AVG(f.nb_tech_skills)
        FROM fact_offres f
        JOIN bridge_tech b ON f.job_id = b.job_id
        WHERE {where} AND b.tech_id = ?
    """
    avg_row = db.fetchone(avg_sql, params + [target_id])
    avg_skills = float(avg_row[0]) if (avg_row and avg_row[0] is not None) else 0.0

    # Pairings by category
    cat_sql = f"""
        SELECT dt.category, COUNT(DISTINCT b2.job_id) AS count
        FROM bridge_tech b1
        JOIN bridge_tech b2 ON b1.job_id = b2.job_id
        JOIN dim_tech dt ON b2.tech_id = dt.tech_id
        JOIN fact_offres f ON b1.job_id = f.job_id
        WHERE {where} AND b1.tech_id = ? AND b2.tech_id != ?
        GROUP BY dt.category
        ORDER BY count DESC
    """
    cat_rows = db.execute(cat_sql, params + [target_id, target_id])
    pairings_by_category = [{"category": cat or "Other", "count": int(c)} for cat, c in cat_rows]

    # Top roles for this stack
    roles_sql = f"""
        SELECT f.job_title AS title, COUNT(*) AS count
        FROM fact_offres f
        JOIN bridge_tech b ON f.job_id = b.job_id
        WHERE {where} AND b.tech_id = ?
        GROUP BY f.job_title
        ORDER BY count DESC
        LIMIT 15
    """
    role_rows = db.execute(roles_sql, params + [target_id])
    top_roles_for_stack = [{"title": t, "count": int(c)} for t, c in role_rows]

    res = {
        "selected_core_skill": canonical_name,
        "top_companion_skill": top_companion,
        "avg_skills_per_job": round(avg_skills, 1),
        "pairings": pairings,
        "pairings_by_category": pairings_by_category,
        "top_roles_for_stack": top_roles_for_stack
    }
    set_in_cache(cache_key, res)
    return res


def get_skills_list() -> List[SkillListItem]:
    """Get list of all skills."""
    rows = db.query("SELECT tech_name, category FROM dim_tech WHERE tech_name IS NOT NULL ORDER BY tech_name")
    return [{"name": str(r["tech_name"]), "category": str(r.get("category") or "Other")} for r in rows]


def get_skills_catalog() -> SkillsCatalogResponse:
    """Get complete skills catalog with frequency data."""
    cache_key = "v1_skills_catalog"
    cached = get_from_cache(cache_key)
    if cached:
        return cached

    total_jobs_row = db.fetchone("SELECT COUNT(*) FROM fact_offres")
    total_jobs = int(total_jobs_row[0]) if (total_jobs_row and total_jobs_row[0]) else 1

    # Hard Skills Query
    hard_sql = """
        SELECT t.tech_name AS name, COALESCE(t.category, 'Other') AS category, COUNT(b.job_id) AS count,
               ROUND(COUNT(b.job_id) * 100.0 / ?, 2) AS percentage
        FROM dim_tech t
        JOIN bridge_tech b ON t.tech_id = b.tech_id
        GROUP BY t.tech_name, t.category
        ORDER BY count DESC
    """
    hard_rows = db.execute(hard_sql, [total_jobs])
    hard_skills = [
        {"name": r[0], "category": r[1], "count": int(r[2]), "percentage": float(r[3])}
        for r in hard_rows
    ]

    # Soft Skills Query
    soft_sql = """
        SELECT s.soft_skill_name AS name, COUNT(b.job_id) AS count,
               ROUND(COUNT(b.job_id) * 100.0 / ?, 2) AS percentage
        FROM dim_soft_skills s
        JOIN bridge_soft_skills b ON s.soft_id = b.soft_id
        GROUP BY s.soft_skill_name
        ORDER BY count DESC
    """
    soft_rows = db.execute(soft_sql, [total_jobs])
    soft_skills = [
        {"name": r[0], "count": int(r[1]), "percentage": float(r[2])}
        for r in soft_rows
    ]

    total_hard_row = db.fetchone("SELECT COUNT(*) FROM dim_tech")
    total_hard = int(total_hard_row[0]) if (total_hard_row and total_hard_row[0]) else len(hard_skills)
    total_soft_row = db.fetchone("SELECT COUNT(*) FROM dim_soft_skills")
    total_soft = int(total_soft_row[0]) if (total_soft_row and total_soft_row[0]) else len(soft_skills)

    res = {
        "total_hard_skills": total_hard,
        "total_soft_skills": total_soft,
        "hard_skills": hard_skills,
        "soft_skills": soft_skills
    }
    set_in_cache(cache_key, res)
    return res
