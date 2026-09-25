"""
=============================================================================
FILTER BUILDER HELPER
=============================================================================
Centralized filter parsing and SQL WHERE clause construction.
"""

from typing import Any, Dict, List, Optional, Tuple, Union

from schemas import GlobalFilterSchema


def extract_filter_params(filters: Optional[Union[GlobalFilterSchema, Dict[str, Any]]] = None) -> Tuple:
    """Extract filter parameters from GlobalFilterSchema or dict."""
    if filters is None:
        return [], [], [], [], [], []
    if isinstance(filters, GlobalFilterSchema):
        return (
            filters.cities or [],
            filters.contracts or [],
            filters.education or [],
            filters.experience or [],
            filters.technologies or [],
            filters.soft_skills or []
        )
    if isinstance(filters, dict):
        return (
            filters.get("cities", []),
            filters.get("contracts", []),
            filters.get("education", []),
            filters.get("experience", []),
            filters.get("technologies", []) or filters.get("hard_skills", []),
            filters.get("soft_skills", [])
        )
    return [], [], [], [], [], []


def build_where_clause(filters: Optional[GlobalFilterSchema] = None) -> Tuple[str, List]:
    """
    Build SQL WHERE clause and parameters from GlobalFilterSchema.

    Returns:
        Tuple of (where_sql, params_list)
    """
    cities, contracts, education, experience, technologies, soft_skills = extract_filter_params(filters)
    conditions = ["1=1"]
    params = []

    if cities:
        valid_cities = [c for c in cities if c and c != "All"]
        if valid_cities:
            placeholders = ",".join(["?"] * len(valid_cities))
            conditions.append(f"f.city_id IN (SELECT city_id FROM dim_city WHERE city_name IN ({placeholders}))")
            params.extend(valid_cities)

    if contracts:
        valid_contracts = [c for c in contracts if c and c != "All"]
        if valid_contracts:
            placeholders = ",".join(["?"] * len(valid_contracts))
            conditions.append(f"f.contract_id IN (SELECT contract_id FROM dim_contract WHERE contract_type IN ({placeholders}))")
            params.extend(valid_contracts)

    if education:
        valid_edu = [e for e in education if e and e != "All"]
        if valid_edu:
            placeholders = ",".join(["?"] * len(valid_edu))
            conditions.append(f"f.edu_id IN (SELECT edu_id FROM dim_education WHERE education_level IN ({placeholders}))")
            params.extend(valid_edu)

    if experience:
        valid_exp = [x for x in experience if x and x != "All"]
        if valid_exp:
            placeholders = ",".join(["?"] * len(valid_exp))
            conditions.append(f"f.exp_id IN (SELECT exp_id FROM dim_experience WHERE tier IN ({placeholders}) OR experience_label IN ({placeholders}))")
            params.extend(valid_exp)
            params.extend(valid_exp)

    if technologies:
        valid_techs = [t for t in technologies if t and t != "All"]
        if valid_techs:
            placeholders = ",".join(["?"] * len(valid_techs))
            conditions.append(f"f.job_id IN (SELECT job_id FROM bridge_tech bt JOIN dim_tech dt ON bt.tech_id = dt.tech_id WHERE dt.tech_name IN ({placeholders}))")
            params.extend(valid_techs)

    if soft_skills:
        valid_softs = [s for s in soft_skills if s and s != "All"]
        if valid_softs:
            placeholders = ",".join(["?"] * len(valid_softs))
            conditions.append(f"f.job_id IN (SELECT job_id FROM bridge_soft_skills bs JOIN dim_soft_skills ds ON bs.soft_id = ds.soft_id WHERE ds.soft_skill_name IN ({placeholders}))")
            params.extend(valid_softs)

    where_sql = " AND ".join(conditions)
    return where_sql, params
