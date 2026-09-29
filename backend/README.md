---
title: TechJob Analytics Backend API
emoji: 🇲🇦
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.16.0
app_file: app.py
pinned: false
---

# 🇲🇦 TechJob Analytics — Backend Engine

> Vectorized DuckDB OLAP backend serving Moroccan IT market intelligence over 13 Parquet tables (10,782 job offers).

## 🚀 Overview

This repository hosts the **FastAPI + DuckDB Vectorized Backend** on Hugging Face Spaces using the **free Gradio SDK**.

- **Latency:** Sub-15ms execution on columnar Snappy Parquet.
- **Data Model:** Kimball Star Schema with 13 tables (1 Fact, 9 Dimensions, 3 Bridges).
- **Interactive API Docs:** Navigate to [`/docs`](/docs) on your space URL.

## 🔗 Main API Endpoints

- `GET /health` — System status & table check
- `GET /api/v1/market-pulse` — Macro KPIs
- `GET /api/v1/market-overview` — Historical trends & regional hubs
- `GET /api/v1/market-analysis` — Workplace modalities & sector weights
- `POST /api/v1/matcher/analyze` — Profile matching & skill ROI booster
- `GET /api/v1/skills/pairings` — Tech co-occurrence queries
- `GET /api/v1/skills/catalog` — 121 hard skills + 50 soft skills matrix
- `GET /api/v1/skills/list` — Skill autocompletion list
- `GET /api/v1/filters/options` — Star schema dimension filters

## 💻 Local Testing

```bash
pip install -r requirements.txt
python app.py
```
App runs locally on `http://localhost:7860`.
