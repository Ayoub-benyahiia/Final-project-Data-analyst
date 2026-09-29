"""
=============================================================================
TechJob Analytics — Production FastAPI Backend Engine
=============================================================================
Vectorized in-process DuckDB OLAP Engine executing queries over 13 normalized
Parquet tables with sub-15ms execution time and parameterized caching.
=============================================================================
"""

import logging
import os
from contextlib import asynccontextmanager
from typing import List, Optional

import sentry_sdk
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from starlette.exceptions import HTTPException as StarletteHTTPException

from routers.health import router as health_router
from routers.market import router as market_router
from routers.matcher import router as matcher_router
from routers.skills import router as skills_router

# Configure logging with configurable log level
log_level = getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper(), logging.INFO)
logging.basicConfig(
    level=log_level,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# =============================================================================
# SENTRY ERROR TRACKING & PERFORMANCE MONITORING INITIALIZATION
# =============================================================================
SENTRY_DSN = os.getenv("SENTRY_DSN")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

def _safe_float(val: Optional[str], default: float) -> float:
    """Safely parse float from environment variable."""
    if val is None:
        return default
    try:
        parsed = float(val)
        return max(0.0, min(1.0, parsed))
    except (ValueError, TypeError):
        logger.warning(f"Invalid float value '{val}' for sample rate, using default {default}")
        return default

if SENTRY_DSN:
    logger.info(f"Sentry enabled for environment: {ENVIRONMENT}")
    traces_default = 0.1 if ENVIRONMENT == "production" else 1.0
    profiles_default = 0.1 if ENVIRONMENT == "production" else 1.0
    traces_rate = _safe_float(os.getenv("SENTRY_TRACES_SAMPLE_RATE"), traces_default)
    profiles_rate = _safe_float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE"), profiles_default)
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        environment=ENVIRONMENT,
        integrations=[
            FastApiIntegration(),
            StarletteIntegration(),
        ],
        traces_sample_rate=traces_rate,
        profiles_sample_rate=profiles_rate,
        release="3.0.0",
        send_default_pii=False,
        before_send_transaction=lambda event, hint: None if os.getenv("ENVIRONMENT") in ["development", "test"] else event,
    )
else:
    logger.info("Sentry disabled (no SENTRY_DSN configured)")

# =============================================================================
# LIFESPAN CONTEXT MANAGER
# =============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"TechJob Analytics API starting up in {ENVIRONMENT} mode")
    logger.info(f"FastAPI version: {app.version}")
    yield
    logger.info("TechJob Analytics API shutting down")

# =============================================================================
# FASTAPI APPLICATION SETUP
# =============================================================================
app = FastAPI(
    title="TechJob Analytics Backend Engine",
    description="Vectorized DuckDB OLAP backend serving Moroccan IT market intelligence over 13 Parquet tables.",
    version="3.0.0",
    lifespan=lifespan
)

# =============================================================================
# CORS MIDDLEWARE
# =============================================================================
def _parse_origins(env_val: Optional[str]) -> List[str]:
    """Parse comma-separated origins, stripping whitespace and empty entries."""
    if not env_val:
        return []
    return [origin.strip() for origin in env_val.split(",") if origin.strip()]

# Check ALLOWED_ORIGINS first, fallback to CORS_ORIGINS
raw_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("CORS_ORIGINS")

if raw_origins == "*":
    allowed_origins = ["*"]
    allow_credentials = False
    logger.info("CORS set to wildcard (*), allow_credentials=False")
elif raw_origins:
    allowed_origins = _parse_origins(raw_origins)
    allow_credentials = True
    logger.info(f"CORS configured for origins: {allowed_origins}")
else:
    # Public analytical API default: allow all origins for seamless frontend integration
    allowed_origins = ["*"]
    allow_credentials = False
    logger.info("CORS defaulting to wildcard (*) for frontend accessibility")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=allow_credentials,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# =============================================================================
# GLOBAL EXCEPTION HANDLER
# =============================================================================
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Safely handle unexpected exceptions without leaking internals to clients."""
    if isinstance(exc, StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=getattr(exc, "headers", None)
        )
    logger.error(
        "Unhandled server error on %s %s: %s",
        request.method,
        request.url.path,
        exc,
        exc_info=True
    )
    if os.getenv("SENTRY_DSN"):
        sentry_sdk.capture_exception(exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )

app.add_exception_handler(Exception, unhandled_exception_handler)

# =============================================================================
# SECURITY HEADERS MIDDLEWARE
# =============================================================================
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    try:
        response = await call_next(request)
    except Exception as exc:
        response = await unhandled_exception_handler(request, exc)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"
    return response

# =============================================================================
# ROUTER REGISTRATION
# =============================================================================
app.include_router(health_router)
app.include_router(market_router)
app.include_router(skills_router)
app.include_router(matcher_router)
