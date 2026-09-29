---
title: TechJob Analytics API
emoji: 📊
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# TechJob Analytics — Backend API

Vectorized DuckDB OLAP backend serving Moroccan IT market intelligence over 13 Parquet tables.

## Endpoints

- `GET /health` — Health check
- `GET /api/v1/market-pulse` — Market KPIs
- `GET /api/v1/market-overview` — Market charts data
- `GET /api/v1/market-analysis` — Detailed analysis
- `POST /api/v1/matcher/analyze` — Stack Matcher
- `GET /api/v1/skills/pairings` — Skill co-occurrences
- `GET /api/v1/skills/catalog` — Full skills matrix
- `GET /docs` — Swagger interactive docs
