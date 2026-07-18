#!/usr/bin/env python3
"""
FastAPI Backend with 2-Layer Caching Strategy
Layer 1: TTL-based caching with cachetools
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from cachetools import TTLCache
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import hashlib
import json

app = FastAPI(title="TechJob Analytics API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# LAYER 1: PARAMETERIZED BACKEND CACHING
# ============================================================================
# TTL Cache: 10 minutes (600 seconds)
# Cache keys dynamically incorporate all query parameters

cache = TTLCache(maxsize=1000, ttl=600)

def generate_cache_key(endpoint: str, params: Dict[str, Any]) -> str:
    """
    Generate dynamic cache key based on endpoint and all query parameters.
    This ensures different filter combinations have different cache entries.
    """
    # Sort params for consistent key generation
    sorted_params = json.dumps(params, sort_keys=True)
    key_string = f"{endpoint}:{sorted_params}"
    return hashlib.md5(key_string.encode()).hexdigest()

# ============================================================================
# DATA MODELS
# ============================================================================

class FilterParams(BaseModel):
    city: Optional[str] = "All"
    experience: Optional[str] = "All"
    contract: Optional[str] = "All"
    education: Optional[str] = "All"
    tech: Optional[str] = "All"
    remote_only: Optional[bool] = False

# ============================================================================
# MOCK DATA (In production, this would come from a database)
# ============================================================================

GROWTH_DATA = [
    {"year": "2016", "Casablanca": 1520, "Rabat": 780, "Tangier": 120, "Marrakech": 90},
    {"year": "2017", "Casablanca": 1640, "Rabat": 850, "Tangier": 150, "Marrakech": 110},
    {"year": "2018", "Casablanca": 1840, "Rabat": 980, "Tangier": 190, "Marrakech": 140},
    {"year": "2019", "Casablanca": 1960, "Rabat": 1060, "Tangier": 220, "Marrakech": 160},
    {"year": "2020", "Casablanca": 2110, "Rabat": 1150, "Tangier": 240, "Marrakech": 180},
    {"year": "2021", "Casablanca": 2290, "Rabat": 1280, "Tangier": 290, "Marrakech": 220},
    {"year": "2022", "Casablanca": 2480, "Rabat": 1420, "Tangier": 350, "Marrakech": 260},
    {"year": "2023", "Casablanca": 2650, "Rabat": 1570, "Tangier": 410, "Marrakech": 310},
    {"year": "2024", "Casablanca": 2890, "Rabat": 1750, "Tangier": 480, "Marrakech": 380},
    {"year": "2025", "Casablanca": 3060, "Rabat": 1930, "Tangier": 540, "Marrakech": 440},
    {"year": "2026", "Casablanca": 3240, "Rabat": 2120, "Tangier": 610, "Marrakech": 512},
]

TECH_RADAR_DATA = [
    {"name": "TypeScript / React", "growth": 38.4, "volume": 2450, "avgSalary": 28000, "experienceLevel": "Mid"},
    {"name": "Java / Spring Boot", "growth": 12.2, "volume": 2120, "avgSalary": 26000, "experienceLevel": "Senior"},
    {"name": "Python / Django / FastAPI", "growth": 42.1, "volume": 1680, "avgSalary": 30000, "experienceLevel": "Mid"},
    {"name": "PHP / Laravel", "growth": -4.5, "volume": 1210, "avgSalary": 16000, "experienceLevel": "Junior"},
    {"name": "DevOps / Kubernetes", "growth": 48.6, "volume": 1540, "avgSalary": 38000, "experienceLevel": "Lead"},
    {"name": "C# / .NET Core", "growth": 8.3, "volume": 1120, "avgSalary": 24000, "experienceLevel": "Senior"},
    {"name": "SQL / dbt / Snowflake", "growth": 52.3, "volume": 980, "avgSalary": 32000, "experienceLevel": "Mid"},
    {"name": "Node.js / Express", "growth": 22.1, "volume": 1820, "avgSalary": 23000, "experienceLevel": "Mid"},
]

COMPANIES_DATA = [
    {"id": 1, "name": "Sofrecom Maroc", "segment": "INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE", "baseOpenPositions": 819, "topTechs": ["Java", "React", "Angular"], "city": "Rabat", "tags": ["Recherche de nouveauté", "Autonomie", "Implication", "Ambition", "Réflexion"]},
    {"id": 2, "name": "Alten Maroc", "segment": "ASSISTANAT DE DIRECTION / SERVICES GÉNÉRAUX - SECTEUR INFORMATIQUE", "baseOpenPositions": 716, "topTechs": ["Java", "React", "C#"], "city": "Rabat", "tags": ["Assistanat de direction", "Autonomie", "Implication", "Réflexion", "Ambition"]},
    {"id": 3, "name": "Atos", "segment": "GESTION PROJET / ETUDES / R&D - INFORMATIQUE / ELECTRONIQUE - SECTEUR INFORMATIQUE", "baseOpenPositions": 504, "topTechs": ["Java", "React", "Python"], "city": "Casablanca", "tags": ["Gestion de projet", "Implication", "Recherche de nouveauté", "Ambition", "Réflexion"]},
    {"id": 4, "name": "Capgemini Maroc", "segment": "INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE", "baseOpenPositions": 210, "topTechs": ["Angular", "Spring", "Azure"], "city": "Casablanca", "tags": ["Autonomie", "Rigueur", "Communication", "Esprit d'équipe"]},
    {"id": 5, "name": "DXC Technology", "segment": "INFORMATIQUE / ELECTRONIQUE - INTERNET / MULTIMÉDIA - SECTEUR INFORMATIQUE", "baseOpenPositions": 134, "topTechs": ["Java", ".NET", "Linux"], "city": "Rabat", "tags": ["Leadership", "Gestion de projet", "Adaptabilité"]},
]

# ============================================================================
# CACHED ENDPOINTS
# ============================================================================

@app.get("/api/growth-data")
async def get_growth_data(
    city: Optional[str] = Query("All"),
    tech: Optional[str] = Query("All"),
    experience: Optional[str] = Query("All")
):
    """
    Heavy aggregation endpoint with caching.
    Cache key includes all query parameters for dynamic behavior.
    """
    params = {"city": city, "tech": tech, "experience": experience}
    cache_key = generate_cache_key("growth_data", params)
    
    # Check cache
    if cache_key in cache:
        print(f"[CACHE HIT] growth_data with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] growth_data with params: {params}")
    
    # Simulate heavy processing/filtering
    filtered_data = GROWTH_DATA.copy()
    
    # Apply filters (in production, this would be a database query)
    if city != "All":
        # Filter logic would go here
        pass
    
    result = {"data": filtered_data, "filters": params}
    cache[cache_key] = result
    return result

@app.get("/api/tech-radar")
async def get_tech_radar(
    city: Optional[str] = Query("All"),
    experience: Optional[str] = Query("All"),
    tech: Optional[str] = Query("All")
):
    """
    Tech radar endpoint with caching.
    Different tech/city combinations generate different cache keys.
    """
    params = {"city": city, "experience": experience, "tech": tech}
    cache_key = generate_cache_key("tech_radar", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] tech_radar with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] tech_radar with params: {params}")
    
    # Simulate filtering based on tech parameter
    filtered_data = TECH_RADAR_DATA.copy()
    if tech != "All" and tech:
        filtered_data = [item for item in filtered_data if tech.lower() in item["name"].lower()]
    
    result = {"data": filtered_data, "filters": params}
    cache[cache_key] = result
    return result

@app.get("/api/companies")
async def get_companies(
    city: Optional[str] = Query("All"),
    tech: Optional[str] = Query("All"),
    remote_only: Optional[bool] = Query(False)
):
    """
    Companies endpoint with caching.
    Cache key dynamically includes city, tech, and remote_only parameters.
    """
    params = {"city": city, "tech": tech, "remote_only": remote_only}
    cache_key = generate_cache_key("companies", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] companies with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] companies with params: {params}")
    
    filtered_data = COMPANIES_DATA.copy()
    
    # Apply city filter
    if city != "All" and city:
        filtered_data = [item for item in filtered_data if item["city"] == city]
    
    # Apply tech filter
    if tech != "All" and tech:
        filtered_data = [item for item in filtered_data if any(tech.lower() in t.lower() for t in item["topTechs"])]
    
    result = {"data": filtered_data, "filters": params}
    cache[cache_key] = result
    return result

@app.get("/api/market-metrics")
async def get_market_metrics(
    city: Optional[str] = Query("All"),
    tech: Optional[str] = Query("All"),
    experience: Optional[str] = Query("All")
):
    """
    Market KPIs endpoint with caching.
    Heavy aggregation endpoint that benefits from caching.
    """
    params = {"city": city, "tech": tech, "experience": experience}
    cache_key = generate_cache_key("market_metrics", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] market_metrics with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] market_metrics with params: {params}")
    
    # Simulate heavy aggregation
    result = {
        "data": {
            "totalJobs": 10782,
            "avgSalary": 24500,
            "topCities": ["Casablanca", "Rabat", "Tangier"],
            "topTechs": ["Java", "React", "Python"],
            "growthRate": 12.5
        },
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/top-skills")
async def get_top_skills(
    city: Optional[str] = Query("All"),
    experience: Optional[str] = Query("All")
):
    """
    Top skills endpoint with caching.
    """
    params = {"city": city, "experience": experience}
    cache_key = generate_cache_key("top_skills", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] top_skills with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] top_skills with params: {params}")
    
    result = {
        "data": [
            {"skill": "Java", "count": 2391},
            {"skill": "SQL", "count": 2195},
            {"skill": "React", "count": 1845},
            {"skill": "Python", "count": 1680},
            {"skill": "Angular", "count": 1420}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/dashboard-kpis")
async def get_dashboard_kpis(
    city: Optional[str] = Query("All"),
    tech: Optional[str] = Query("All"),
    experience: Optional[str] = Query("All"),
    contract: Optional[str] = Query("All")
):
    """
    Dashboard KPIs endpoint with caching.
    Most complex endpoint with multiple filter parameters.
    """
    params = {"city": city, "tech": tech, "experience": experience, "contract": contract}
    cache_key = generate_cache_key("dashboard_kpis", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] dashboard_kpis with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] dashboard_kpis with params: {params}")
    
    result = {
        "data": {
            "totalOffers": 10782,
            "newThisWeek": 142,
            "avgSalary": 24500,
            "remotePercentage": 21.5,
            "topCompanies": ["Sofrecom Maroc", "Alten Maroc", "Atos"]
        },
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/health")
async def health_check():
    """Health check endpoint (no caching)"""
    return {"status": "healthy", "cache_size": len(cache)}

# ============================================================================
# ADDITIONAL ENDPOINTS TO MATCH FRONTEND API CALLS
# ============================================================================

@app.get("/api/kpis")
async def get_kpis(
    contract: Optional[str] = Query("All"),
    city: Optional[str] = Query("All"),
    tech: Optional[str] = Query("All")
):
    params = {"contract": contract, "city": city, "tech": tech}
    cache_key = generate_cache_key("kpis", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] kpis with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] kpis with params: {params}")
    result = {
        "totalOffers": 10782,
        "newThisWeek": 142,
        "avgSalary": 24500,
        "remotePercentage": 21.5,
        "topCompanies": ["Sofrecom Maroc", "Alten Maroc", "Atos"]
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/trends")
async def get_analytics_trends(
    contract: Optional[str] = Query("All"),
    city: Optional[str] = Query("All")
):
    params = {"contract": contract, "city": city}
    cache_key = generate_cache_key("analytics_trends", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_trends with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_trends with params: {params}")
    result = {"data": GROWTH_DATA, "filters": params}
    cache[cache_key] = result
    return result

@app.get("/api/analytics/companies")
async def get_analytics_companies(
    contract: Optional[str] = Query("All"),
    city: Optional[str] = Query("All"),
    search: Optional[str] = Query(None),
    remote_only: Optional[bool] = Query(False)
):
    params = {"contract": contract, "city": city, "search": search, "remote_only": remote_only}
    cache_key = generate_cache_key("analytics_companies", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_companies with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_companies with params: {params}")
    
    # Filter companies based on search and remote_only parameters
    filtered_companies = COMPANIES_DATA.copy()
    
    # Apply search filter (company name or tech stack)
    if search:
        search_lower = search.lower()
        filtered_companies = [
            company for company in filtered_companies
            if search_lower in company.get("name", "").lower() 
            or any(search_lower in tech.lower() for tech in company.get("tech_stack", []))
        ]
    
    # Apply remote_only filter
    if remote_only:
        filtered_companies = [
            company for company in filtered_companies
            if company.get("remote", False) or any(
                mode.lower() in ["remote", "télétravail", "hybride"] 
                for mode in company.get("work_modes", [])
            )
        ]
    
    result = {"data": filtered_companies, "filters": params}
    cache[cache_key] = result
    return result

@app.get("/api/analytics/skills")
async def get_analytics_skills(
    contract: Optional[str] = Query("All"),
    city: Optional[str] = Query("All")
):
    params = {"contract": contract, "city": city}
    cache_key = generate_cache_key("analytics_skills", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_skills with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_skills with params: {params}")
    result = {
        "data": [
            {"skill": "Java", "count": 2391},
            {"skill": "SQL", "count": 2195},
            {"skill": "React", "count": 1845},
            {"skill": "Python", "count": 1680},
            {"skill": "Angular", "count": 1420}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/contracts")
async def get_analytics_contracts(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_contracts", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_contracts with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_contracts with params: {params}")
    result = {
        "data": [
            {"name": "CDI", "value": 89.9, "offers": 9690},
            {"name": "CDD", "value": 4.1, "offers": 442},
            {"name": "Freelance", "value": 3.2, "offers": 345},
            {"name": "Stage", "value": 2.8, "offers": 305}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/cities")
async def get_analytics_cities(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_cities", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_cities with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_cities with params: {params}")
    result = {
        "data": [
            {"name": "Casablanca", "count": 5507, "percentage": 53.6},
            {"name": "Rabat", "count": 2674, "percentage": 26.0},
            {"name": "Fès", "count": 480, "percentage": 4.7},
            {"name": "Salé", "count": 458, "percentage": 4.5},
            {"name": "Ben Guerir", "count": 227, "percentage": 2.2}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/soft-skills")
async def get_analytics_soft_skills(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_soft_skills", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_soft_skills with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_soft_skills with params: {params}")
    result = {
        "data": [
            {"skill": "Autonomie", "count": 8542},
            {"skill": "Communication", "count": 7821},
            {"skill": "Esprit d'équipe", "count": 7543},
            {"skill": "Rigueur", "count": 6987},
            {"skill": "Adaptabilité", "count": 6543}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/career-insights")
async def get_analytics_career_insights(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_career_insights", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_career_insights with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_career_insights with params: {params}")
    result = {
        "data": {
            "avgExperience": "3-5 years",
            "topGrowthTech": "DevOps (+48.6%)",
            "remoteTrend": "Growing",
            "salaryTrend": "Stable"
        },
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/summary-kpis")
async def get_analytics_summary_kpis(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_summary_kpis", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_summary_kpis with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_summary_kpis with params: {params}")
    result = {
        "data": {
            "totalJobs": 10782,
            "activeCompanies": 852,
            "avgSalary": 24500,
            "remoteRate": 21.5
        },
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/trends/yearly")
async def get_analytics_trends_yearly(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_trends_yearly", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_trends_yearly with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_trends_yearly with params: {params}")
    result = {"data": GROWTH_DATA, "filters": params}
    cache[cache_key] = result
    return result

@app.get("/api/analytics/work-mode")
async def get_analytics_work_mode(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_work_mode", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_work_mode with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_work_mode with params: {params}")
    result = {
        "data": [
            {"mode": "Télétravail", "percentage": 21.5},
            {"mode": "Hybride", "percentage": 35.2},
            {"mode": "Présentiel", "percentage": 43.3}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/sectors")
async def get_analytics_sectors(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_sectors", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_sectors with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_sectors with params: {params}")
    result = {
        "data": [
            {"sector": "Informatique", "count": 5420},
            {"sector": "Finance", "count": 1234},
            {"sector": "Télécoms", "count": 987},
            {"sector": "Industrie", "count": 654},
            {"sector": "Services", "count": 543}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/yoy-by-city")
async def get_analytics_yoy_by_city(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_yoy_by_city", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_yoy_by_city with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_yoy_by_city with params: {params}")
    result = {
        "data": [
            {"city": "Casablanca", "yoyGrowth": 12.5},
            {"city": "Rabat", "yoyGrowth": 15.2},
            {"city": "Tanger", "yoyGrowth": 18.7},
            {"city": "Marrakech", "yoyGrowth": 14.3}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/job-titles")
async def get_analytics_job_titles(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_job_titles", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_job_titles with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_job_titles with params: {params}")
    result = {
        "data": [
            {"title": "Développeur Full Stack", "count": 1234},
            {"title": "Ingénieur DevOps", "count": 876},
            {"title": "Data Scientist", "count": 654},
            {"title": "Architecte Solution", "count": 432},
            {"title": "Product Owner", "count": 321}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/geo-map")
async def get_analytics_geo_map(
    contract: Optional[str] = Query("All")
):
    params = {"contract": contract}
    cache_key = generate_cache_key("analytics_geo_map", params)
    
    if cache_key in cache:
        print(f"[CACHE HIT] analytics_geo_map with params: {params}")
        return cache[cache_key]
    
    print(f"[CACHE MISS] analytics_geo_map with params: {params}")
    result = {
        "data": [
            {"city": "Casablanca", "lat": 33.5731, "lng": -7.5898, "count": 5507},
            {"city": "Rabat", "lat": 34.0209, "lng": -6.8416, "count": 2674},
            {"city": "Tanger", "lat": 35.7595, "lng": -5.8340, "count": 120},
            {"city": "Marrakech", "lat": 31.6295, "lng": -7.9811, "count": 67}
        ],
        "filters": params
    }
    cache[cache_key] = result
    return result

@app.get("/api/analytics/system-status")
async def get_analytics_system_status():
    """System status endpoint (no caching)"""
    return {
        "status": "operational",
        "cache_size": len(cache),
        "uptime": "2h 34m",
        "last_sync": "2026-07-15T18:00:00Z"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
