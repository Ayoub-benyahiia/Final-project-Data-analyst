"""
=============================================================================
MARKET ROUTER
================================================================<arg_value>Market analytics endpoints: filters, pulse, overview, analysis, preview.
"""

from fastapi import APIRouter, Depends

from schemas import (
    GlobalFilterSchema,
    MarketAnalysisResponse,
    MarketOverviewResponse,
    MarketPulseResponse,
    get_global_filters,
)
from services.market_service import (
    get_filter_options,
    get_market_analysis,
    get_market_overview,
    get_market_pulse,
    get_market_pulse_preview,
)

router = APIRouter()


@router.get("/api/v1/filters/options")
def filter_options():
    """Get dynamic filter options from star schema dimensions."""
    return get_filter_options()


@router.get("/api/v1/market-pulse", response_model=MarketPulseResponse)
def market_pulse():
    """Get market pulse KPIs."""
    return get_market_pulse()


@router.get("/api/v1/market-overview", response_model=MarketOverviewResponse)
def market_overview(filters: GlobalFilterSchema = Depends(get_global_filters)):
    """Get market overview data with filters."""
    return get_market_overview(filters)


@router.get("/api/v1/market-analysis", response_model=MarketAnalysisResponse)
def market_analysis(filters: GlobalFilterSchema = Depends(get_global_filters)):
    """Get detailed market analysis with filters."""
    return get_market_analysis(filters)


@router.get("/api/v1/market-pulse-preview")
def market_pulse_preview(filters: GlobalFilterSchema = Depends(get_global_filters)):
    """Get landing page preview data."""
    return get_market_pulse_preview(filters)
