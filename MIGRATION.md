# Supabase Migration Tooling

## Purpose
The Supabase-related files in this repository are **migration and storage tooling only**. They are **NOT part of the production runtime architecture**.

## Production Runtime Architecture
- **Frontend:** React 19 + TypeScript + Vite 6
- **Backend:** FastAPI + DuckDB + Parquet
- **Data:** 13 Parquet files (10,782 job postings) stored in `backend/data/parquet/`
- **Analytics:** DuckDB in-memory OLAP engine with SQL queries over Parquet views

## Migration Files

### 1. `supabase_setup_ddl.sql`
- **Purpose:** DDL script to create PostgreSQL schema in Supabase
- **Usage:** Run in Supabase SQL Editor to set up database tables
- **Schema:** 13 tables matching the Parquet star schema (9 dims, 1 fact, 3 bridges)
- **Note:** Creates tables with proper PK/FK relationships, indexes, and Row Level Security (RLS)

### 2. `supabase_schema_extraction.sql`
- **Purpose:** Extract and document existing Supabase schema structure
- **Usage:** Run in Supabase SQL Editor to document database state
- **Note:** Useful for auditing and documenting the Supabase instance

### 3. `export_and_sync_supabase.py`
- **Purpose:** Export Parquet star schema data to Supabase PostgreSQL
- **Usage:**
  ```bash
  python export_and_sync_supabase.py --database-url "postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"
  python export_and_sync_supabase.py --verify-local
  ```
- **Function:** Reads CSV files from `projet-data-maroc-tech/data/star_schema/` and uploads to Supabase
- **Dependencies:** SQLAlchemy (for PostgreSQL connection), pandas (for data export)

## Migration Dependencies

These migration scripts require additional dependencies that are **NOT** required for normal application operation:

- **SQLAlchemy>=2.0.0** - PostgreSQL connection and data upload
- **pandas>=2.2.0** - Data export from CSV to PostgreSQL

These dependencies are included in `backend/requirements.txt` for migration tooling purposes but are not used by the production FastAPI backend.

## Environment Variables

The following environment variables are used **ONLY** by migration tooling:

- `DATABASE_URL` - PostgreSQL connection string for Supabase
- `SUPABASE_URL` - Supabase project URL (for client-side tools)
- `SUPABASE_KEY` - Supabase API key (for client-side tools)

These variables are documented in `backend/.env.example` under the "MIGRATION TOOLING ONLY" section. They are **NOT** required for normal application operation.

## Runtime vs Migration

### Runtime (Production)
- **Data Source:** Parquet files in `backend/data/parquet/`
- **Database Engine:** DuckDB in-memory connection
- **Query Language:** SQL through DuckDB
- **Performance:** Sub-15ms query latency
- **Architecture:** Zero-copy reads from Parquet files

### Migration (Storage/Backup)
- **Data Source:** CSV files in `projet-data-maroc-tech/data/star_schema/`
- **Database Engine:** Supabase PostgreSQL
- **Query Language:** SQL through SQLAlchemy
- **Purpose:** Long-term storage, backup, Power BI integration
- **Architecture:** Traditional relational database with indexes

## When to Use Migration Tooling

Use the Supabase migration tooling when:
1. You need to store data in a persistent cloud database
2. You want to integrate with Power BI using Supabase as a data source
3. You need to backup the star schema data externally
4. You want to enable multi-user concurrent writes (not needed for read-only analytics)

Do NOT use Supabase migration tooling when:
1. Running the production analytics application (uses DuckDB + Parquet)
2. Developing the FastAPI backend (uses DuckDB + Parquet)
3. Running local development environment (uses DuckDB + Parquet)

## Architecture Decision

The production architecture uses **DuckDB + Parquet** because:
- **Performance:** Sub-15ms query latency on 10,782 records
- **Simplicity:** No database server to manage
- **Portability:** Self-contained Parquet files
- **Cost:** No cloud database costs for analytics workloads
- **Flexibility:** Easy to refresh data by replacing Parquet files

Supabase is maintained as an **optional migration target** for:
- Long-term data persistence
- Power BI integration (which prefers PostgreSQL)
- Backup and archival
- Future multi-user scenarios

## Further Information

- **Runtime Architecture:** See `backend/db.py` for DuckDB connection setup
- **Data Schema:** See `DATABASE_ARCHITECTURE.md` for star schema documentation
- **Backend API:** See `backend/main.py` for FastAPI endpoints
- **Frontend:** See `techjob-analytics-react-router/` for React application
