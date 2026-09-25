-- ============================================================================
-- SUPABASE POSTGRESQL MIGRATION DDL (NOT RUNTIME ARCHITECTURE)
-- ============================================================================
-- Purpose: Create PostgreSQL schema for Supabase migration/storage
-- Usage: Run in Supabase SQL Editor to set up database for data export
-- Note: This is NOT part of the production runtime architecture
-- Runtime: DuckDB + Parquet (see backend/db.py)
-- Migration Tooling: See MIGRATION.md in repository root
-- ============================================================================

-- 1. DROP EXISTING TABLES (REVERSE DEPENDENCY ORDER)
DROP TABLE IF EXISTS bridge_languages CASCADE;
DROP TABLE IF EXISTS bridge_soft_skills CASCADE;
DROP TABLE IF EXISTS bridge_tech CASCADE;
DROP TABLE IF EXISTS fact_offres CASCADE;
DROP TABLE IF EXISTS dim_languages CASCADE;
DROP TABLE IF EXISTS dim_soft_skills CASCADE;
DROP TABLE IF EXISTS dim_tech CASCADE;
DROP TABLE IF EXISTS dim_entreprise CASCADE;
DROP TABLE IF EXISTS dim_experience CASCADE;
DROP TABLE IF EXISTS dim_education CASCADE;
DROP TABLE IF EXISTS dim_contract CASCADE;
DROP TABLE IF EXISTS dim_city CASCADE;
DROP TABLE IF EXISTS dim_date CASCADE;

-- 2. DIMENSION TABLES
-- ----------------------------------------------------------------------------

CREATE TABLE dim_date (
    date_id BIGINT PRIMARY KEY,
    year INT NOT NULL,
    decade VARCHAR(20),
    is_recent SMALLINT DEFAULT 1
);

CREATE TABLE dim_city (
    city_id BIGINT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL UNIQUE,
    region VARCHAR(100),
    is_major_hub SMALLINT DEFAULT 0
);

CREATE TABLE dim_contract (
    contract_id BIGINT PRIMARY KEY,
    contract_type VARCHAR(50) NOT NULL UNIQUE,
    is_permanent SMALLINT DEFAULT 0,
    is_internship SMALLINT DEFAULT 0
);

CREATE TABLE dim_education (
    edu_id BIGINT PRIMARY KEY,
    education_level VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dim_experience (
    exp_id BIGINT PRIMARY KEY,
    experience_label VARCHAR(100) NOT NULL UNIQUE,
    exp_years_min NUMERIC(4,1),
    exp_years_max NUMERIC(4,1),
    tier VARCHAR(50)
);

CREATE TABLE dim_entreprise (
    entreprise_id BIGINT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry_sector VARCHAR(255)
);

CREATE TABLE dim_tech (
    tech_id BIGINT PRIMARY KEY,
    tech_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100)
);

CREATE TABLE dim_soft_skills (
    soft_id BIGINT PRIMARY KEY,
    soft_skill_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE dim_languages (
    language_id BIGINT PRIMARY KEY,
    language_name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. CENTRAL FACT TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE fact_offres (
    job_id BIGINT PRIMARY KEY,
    date_id BIGINT NOT NULL REFERENCES dim_date(date_id),
    city_id BIGINT NOT NULL REFERENCES dim_city(city_id),
    contract_id BIGINT NOT NULL REFERENCES dim_contract(contract_id),
    edu_id BIGINT NOT NULL REFERENCES dim_education(edu_id),
    exp_id BIGINT NOT NULL REFERENCES dim_experience(exp_id),
    entreprise_id BIGINT NOT NULL REFERENCES dim_entreprise(entreprise_id),
    job_title VARCHAR(500) NOT NULL,
    job_id_original VARCHAR(100),
    job_function VARCHAR(255),
    work_mode VARCHAR(100),
    allows_remote SMALLINT DEFAULT 0,
    allows_hybrid SMALLINT DEFAULT 0,
    uses_agile SMALLINT DEFAULT 0,
    is_junior_friendly SMALLINT DEFAULT 0,
    nb_tech_skills INT DEFAULT 0,
    nb_soft_skills INT DEFAULT 0,
    nb_languages INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MANY-TO-MANY BRIDGE TABLES
-- ----------------------------------------------------------------------------

CREATE TABLE bridge_tech (
    job_id BIGINT NOT NULL REFERENCES fact_offres(job_id) ON DELETE CASCADE,
    tech_id BIGINT NOT NULL REFERENCES dim_tech(tech_id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, tech_id)
);

CREATE TABLE bridge_soft_skills (
    job_id BIGINT NOT NULL REFERENCES fact_offres(job_id) ON DELETE CASCADE,
    soft_id BIGINT NOT NULL REFERENCES dim_soft_skills(soft_id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, soft_id)
);

CREATE TABLE bridge_languages (
    job_id BIGINT NOT NULL REFERENCES fact_offres(job_id) ON DELETE CASCADE,
    language_id BIGINT NOT NULL REFERENCES dim_languages(language_id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, language_id)
);

-- 5. HIGH-PERFORMANCE INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX idx_fact_city ON fact_offres(city_id);
CREATE INDEX idx_fact_contract ON fact_offres(contract_id);
CREATE INDEX idx_fact_exp ON fact_offres(exp_id);
CREATE INDEX idx_fact_edu ON fact_offres(edu_id);
CREATE INDEX idx_fact_entreprise ON fact_offres(entreprise_id);
CREATE INDEX idx_fact_date ON fact_offres(date_id);
CREATE INDEX idx_bridge_tech_tech ON bridge_tech(tech_id);
CREATE INDEX idx_bridge_tech_job ON bridge_tech(job_id);
CREATE INDEX idx_bridge_soft_soft ON bridge_soft_skills(soft_id);
CREATE INDEX idx_bridge_lang_lang ON bridge_languages(language_id);

-- 6. ROW LEVEL SECURITY (RLS) FOR PUBLIC READ ACCESS
-- ----------------------------------------------------------------------------

ALTER TABLE dim_date ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_city ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_contract ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_entreprise ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_tech ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_soft_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_offres ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_tech ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_soft_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to dim_date" ON dim_date FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_city" ON dim_city FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_contract" ON dim_contract FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_education" ON dim_education FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_experience" ON dim_experience FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_entreprise" ON dim_entreprise FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_tech" ON dim_tech FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_soft_skills" ON dim_soft_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to dim_languages" ON dim_languages FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to fact_offres" ON fact_offres FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to bridge_tech" ON bridge_tech FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to bridge_soft_skills" ON bridge_soft_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to bridge_languages" ON bridge_languages FOR SELECT USING (true);
