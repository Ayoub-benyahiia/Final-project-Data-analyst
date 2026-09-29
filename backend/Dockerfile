# =============================================================================
# TECHJOB ANALYTICS — FASTAPI BACKEND DOCKERFILE
# =============================================================================
FROM python:3.11-slim

WORKDIR /app

# Install build essentials if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Parquet data (production runtime data)
COPY data/parquet /app/data/parquet

# Copy backend application code
COPY . /app

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Koyeb injects PORT env var automatically (default 8000)
ENV PORT=8000
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Run uvicorn server with exec for clean signal handling
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
