"""
=============================================================================
HEALTH ROUTER
=============================================================================
Health check and root endpoints.
"""

import logging
import os

import sentry_sdk
from fastapi import APIRouter, HTTPException

from db import db

router = APIRouter()

SENTRY_DSN = os.getenv("SENTRY_DSN")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
logger = logging.getLogger(__name__)


@router.get("/health")
def health_check():
    """Health check endpoint - verifies API is running."""
    return {"status": "ok", "service": "TechJob Analytics API", "version": "3.0.0"}


@router.get("/readiness")
def readiness_check():
    """Readiness check endpoint - verifies Parquet data is available."""
    try:
        # Use thread-safe query_value through DatabaseManager lock
        job_count = db.query_value("SELECT COUNT(*) FROM fact_offres")
        job_count = int(job_count) if job_count is not None else 0

        if job_count == 0:
            logger.warning("Readiness check: database returned 0 jobs")
            raise HTTPException(
                status_code=503,
                detail="Analytical database has no job records available"
            )

        return {
            "status": "ready",
            "service": "TechJob Analytics API",
            "version": "3.0.0",
            "data_available": True,
            "job_count": job_count
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Readiness check failed: %s", e, exc_info=True)
        raise HTTPException(
            status_code=503,
            detail="Analytical database is not ready"
        )


@router.get("/")
def root_check():
    """Root endpoint with docs link."""
    return {"message": "TechJob Analytics API is online", "docs": "/docs"}


@router.get("/api/v1/sentry-debug")
def sentry_debug():
    """
    Debug endpoint to trigger a test error for Sentry event capture verification.
    Only active in debug/test mode when ENVIRONMENT=development or test.
    Disabled in production.
    """
    # Check environment at request time for better testability
    current_env = os.getenv("ENVIRONMENT", "development")
    if current_env not in ["development", "test"]:
        logger.warning(f"Sentry debug endpoint accessed in {current_env} mode - denied")
        raise HTTPException(status_code=403, detail="Sentry debug endpoint only available in development/test mode")

    # Trigger a test error to verify Sentry event capture
    try:
        raise Exception("Sentry debug test error - this is a deliberate exception for monitoring verification")
    except Exception as e:
        if os.getenv("SENTRY_DSN"):
            sentry_sdk.capture_exception(e)
            logger.info("Sentry debug error captured and sent")
            return {
                "status": "Test error captured and sent to Sentry",
                "environment": current_env,
                "sentry_enabled": True
            }
        else:
            logger.info("Sentry debug error thrown but Sentry not configured")
            return {
                "status": "Test error thrown but Sentry not configured (no SENTRY_DSN)",
                "environment": current_env,
                "sentry_enabled": False
            }
