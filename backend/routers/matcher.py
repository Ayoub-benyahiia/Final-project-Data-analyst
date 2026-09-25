"""
=============================================================================
MATCHER ROUTER
=========================================================================
Stack matcher endpoint for skill compatibility analysis.
"""

from fastapi import APIRouter, Body, Depends

from schemas import (
    GlobalFilterSchema,
    StackMatcherRequest,
    StackMatcherResponse,
    get_global_filters,
)
from services.matcher_service import analyze_stack

router = APIRouter()


@router.post("/api/v1/matcher/analyze", response_model=StackMatcherResponse)
def stack_matcher(
    request: StackMatcherRequest = Body(...),
    filters: GlobalFilterSchema = Depends(get_global_filters)
):
    """Analyze skill stack compatibility and provide ROI recommendations."""
    return analyze_stack(request, filters)
