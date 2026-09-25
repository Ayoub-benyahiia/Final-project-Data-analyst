"""
=============================================================================
SKILLS ROUTER
=========================================================================
Skills analytics endpoints: pairings, list, catalog.
"""

from typing import List

from fastapi import APIRouter, Depends, Query

from schemas import (
    GlobalFilterSchema,
    SkillListItem,
    SkillPairingsResponse,
    SkillsCatalogResponse,
    get_global_filters,
)
from services.skills_service import (
    get_skill_pairings,
    get_skills_catalog,
    get_skills_list,
)

router = APIRouter()


@router.get("/api/v1/skills/pairings", response_model=SkillPairingsResponse)
def skill_pairings(
    skill: str = Query(default="React", max_length=100, description="Target skill name (max 100 chars)"),
    filters: GlobalFilterSchema = Depends(get_global_filters)
):
    """Get skill co-occurrence analysis for a target skill."""
    return get_skill_pairings(skill, filters)


@router.get("/api/v1/skills/list", response_model=List[SkillListItem])
def skills_list():
    """Get list of all skills."""
    return get_skills_list()


@router.get("/api/v1/skills/catalog", response_model=SkillsCatalogResponse)
def skills_catalog():
    """Get complete skills catalog with frequency data."""
    return get_skills_catalog()
