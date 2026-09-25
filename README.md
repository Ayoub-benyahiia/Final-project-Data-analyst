# 🇲🇦 TechJob Analytics — Moroccan IT Job Market Intelligence Platform

> **Projet de Fin d’Études (PFE) — Master / Diplôme d'Ingénieur d'État en Ingénierie des Données & Systèmes Décisionnels**  
> **Auteur :** Ismail — Projet Data Maroc Tech  
> **Statut :** Production-Ready · Stable · Vectorized OLAP & Decoupled Architecture  
> **Source de Données :** 10,782 Offres d'Emploi IT Normalisées au Maroc (2016–2026)

---

## 📋 Table des Matières

1. [Introduction & Contexte](#1-introduction--contexte)
2. [Objectifs du Projet](#2-objectifs-du-projet)
3. [Architecture Globale du Système](#3-architecture-globale-du-système)
4. [Pipeline de Données (ETL & Star Schema)](#4-pipeline-de-données-etl--star-schema)
5. [Dictionnaire des Données & Schéma en Étoile](#5-dictionnaire-des-données--schéma-en-étoile)
6. [Moteur Décisionnel OLAP (DuckDB Vectorisé)](#6-moteur-décisionnel-olap-duckdb-vectorisé)
7. [API Backend (FastAPI & Pydantic V2)](#7-api-backend-fastapi--pydantic-v2)
8. [Interface Utilisateur (React 19 & Recharts)](#8-interface-utilisateur-react-19--recharts)
9. [Fonctionnalités & Modules Décisionnels](#9-fonctionnalités--modules-décisionnels)
10. [Guide d'Installation & Démarrage Local](#10-guide-dinstallation--démarrage-local)
11. [Déploiement Docker & Cloud (Render / Vercel)](#11-déploiement-docker--cloud-render--vercel)
12. [Validation des Données & Tests Automatisés](#12-validation-des-données--tests-automatisés)
13. [Limitations & Perspectives](#13-limitations--perspectives)

---

## 1. Introduction & Contexte

Le marché de l'emploi technologique au Maroc connaît une croissance exponentielle tirée par l'offshoring, la transition numérique des institutions bancaires et l'émergence d'écosystèmes startups. Cependant, les recruteurs, les candidats et les établissements universitaires manquent d'une source centralisée et quantitative permettant d'analyser en temps réel les compétences recherchées, l'évolution salariale et la répartition géographique des opportunités.

**TechJob Analytics** résout cette asymétrie d'information grâce à un pipeline de données de bout en bout qui extrait, nettoie, modélise et restitue l'intelligence du marché IT marocain.

---

## 2. Objectifs du Projet

1. **Agrégation & Nettoyage :** Traiter et dédupliquer plus de 10,700 annonces d'emploi issues des plateformes majeures de recrutement marocaines (*ReKrute*, *Emploi.ma*).
2. **Modélisation Décisionnelle :** Structurer un schéma en étoile (Star Schema) conforme aux standards décisionnels (Kimball) avec 13 tables normalisées (1 table de faits, 9 dimensions, 3 tables de pont N:M).
3. **Moteur Analytique Haute Performance :** Fournir des temps de réponse sous les **15 ms** grâce au moteur OLAP vectorisé **DuckDB** interrogeant directement des fichiers compressés en format columnar **Parquet**.
4. **Restitution Interactive :** Concevoir une interface Web moderne en **React 19**, dotée de filtres multi-dimensionnels synchronisés, d'un calculateur de ROI de compétences (*Stack Matcher*) et d'un explorateur de co-occurrences technologiques (*Skill Pairings*).

---

## 3. Architecture Globale du Système

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Client Browser (Frontend)                         │
│        React 19 + TypeScript + Vite 6 + Tailwind CSS + Recharts         │
│  (Landing Page, Market Overview, Detailed Analysis, Stack Matcher,      │
│            Skill Pairings Explorer, Skills Catalog Matrix)              │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Requêtes REST JSON (<15ms)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Moteur Backend API (FastAPI)                         │
│            (Port 8000 · Uvicorn · Modèles Pydantic V2)                  │
│  ├── In-Memory TTL Cache (Invalidation & Hachage MD5 sur 600s)          │
│  ├── Dynamic SQL Filter Builder (Multi-critères dimensionnels)          │
│  └── Middlewares de Sécurité (CORS dynamique, Headers HTTP durcis)      │
└──────────────────┬──────────────────────────────────┬───────────────────┘
                   │ Moteur Principal                 │ Synchronisation
                   ▼                                  ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│       Moteur In-Process DuckDB       │  │     Supabase PostgreSQL       │
│  - 13 Vues Parquet Vectorisées       │  │  - Schéma relationnel DDL     │
│  - Agrégations & CTEs sous 15ms      │  │  - Index B-Tree & RLS         │
│  - Zero-Copy columnar reads          │  │  - export_and_sync_supabase.py│
└──────────────────┬───────────────────┘  └───────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                Pipeline ETL & Ingénierie des Données                    │
│  - Scraping & Text Mining: Python (BeautifulSoup, Regex, Pandas)        │
│  - Structuration Star Schema: notebooks/build_star_schema_v2.py         │
│  - Stockage Vectoriel: 13 fichiers Snappy Parquet (10,782 faits)        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Pipeline de Données (ETL & Star Schema)

Le pipeline d'ingénierie des données est articulé en 3 étapes majeures :

1. **Extraction & Scraping (`notebooks/scrap.ipynb`) :** Récupération brute des annonces d'emploi avec métadonnées (titre, entreprise, localisation, type de contrat, descriptif du poste, compétences requises).
2. **Nettoyage & Text Mining (`notebooks/01_eda.ipynb`) :** 
   - Normalisation des intitulés de postes et des entreprises.
   - Extraction structurée des technologies (121 compétences hard), compétences comportementales (50 soft skills) et langues (6 langues).
   - Traitement des valeurs manquantes et calcul des indicateurs booléens (`allows_remote`, `allows_hybrid`, `is_junior_friendly`).
3. **Génération du Schéma en Étoile (`notebooks/build_star_schema_v2.py`) :** 
   - Création de surrogate keys entières.
   - Exportation des 13 tables aux formats **CSV** et **Parquet** compressé Snappy.

---

## 5. Dictionnaire des Données & Schéma en Étoile

Le système repose sur **13 tables relationnelles** garantissant 100% d'intégrité référentielle (0 orphelin) :

```
                        ┌──────────────┐
                        │   dim_date   │
                        └──────┬───────┘
                               │
 ┌────────────────┐     ┌──────▼───────┐     ┌────────────────┐
 │    dim_city    ├────►│              │◄────┤  dim_contract  │
 └────────────────┘     │              │     └────────────────┘
                        │ fact_offres  │
 ┌────────────────┐     │ (10,782 rows)│     ┌────────────────┐
 │ dim_education  ├────►│              │◄────┤ dim_experience │
 └────────────────┘     └──────▲───────┘     └────────────────┘
                               │
                        ┌──────┴───────┐
                        │dim_entreprise│
                        └──────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │ (1:N)                 │ (1:N)                 │ (1:N)
┌──────▼──────┐         ┌──────▼────────────┐   ┌──────▼───────────┐
│ bridge_tech │         │bridge_soft_skills │   │ bridge_languages │
└──────┬──────┘         └──────┬────────────┘   └──────┬───────────┘
       │ (N:1)                 │ (N:1)                 │ (N:1)
┌──────▼──────┐         ┌──────▼────────────┐   ┌──────▼───────────┐
│  dim_tech   │         │  dim_soft_skills  │   │  dim_languages   │
└─────────────┘         └───────────────────┘   └──────────────────┘
```

### Table des Faits : `fact_offres` (10,782 lignes)
* `job_id` (PK), `date_id` (FK), `city_id` (FK), `contract_id` (FK), `edu_id` (FK), `exp_id` (FK), `entreprise_id` (FK).
* Attributs métier : `job_title`, `work_mode`, `allows_remote`, `allows_hybrid`, `uses_agile`, `is_junior_friendly`, `nb_tech_skills`, `nb_soft_skills`, `nb_languages`.

### Tables de Pont (Many-to-Many) :
* `bridge_tech` (36,308 lignes) : Association Offre ↔ Technologie.
* `bridge_soft_skills` (77,458 lignes) : Association Offre ↔ Compétence comportementale.
* `bridge_languages` (7,484 lignes) : Association Offre ↔ Langue.

---

## 6. Moteur Décisionnel OLAP (DuckDB Vectorisé)

Plutôt que d'exécuter des requêtes lentes sur un SGBD transactionnel traditionnel ou d'importer l'intégralité des données en mémoire vive dans Pandas, l'application utilise **DuckDB** en mode *in-process*.

* **Zero-Copy Parquet Scanning :** DuckDB lit directement les colonnes requises dans les fichiers `.parquet` sans désérialisation inutile.
* **CTEs & Concurrency :** Les calculs d'appariement de stacks utilisent des *Common Table Expressions (CTEs)* isolées assurant la sécurité lors d'accès concurrents.
* **Latence constatée :** **3 à 15 ms** pour les requêtes d'agrégation multi-dimensionnelles avec jointures sur 134,000 enregistrements relationnels.

---

## 7. API Backend (FastAPI & Pydantic V2)

Le backend FastAPI (`New_design/backend/`) expose 9 points de terminaison analytiques rigoureusement typés :

| Point de Terminaison | Méthode | Description Métier | Latence |
| :--- | :---: | :--- | :---: |
| `/health` | GET | Vérification d'état et de connectivité | < 1 ms |
| `/api/v1/filters/options` | GET | Extraction des options dynamiques du Star Schema | ~6 ms |
| `/api/v1/market-pulse` | GET | KPIs macro (Volume, Entreprises, Villes, Télétravail %, Expérience) | ~4 ms |
| `/api/v1/market-overview` | GET | Distribution des contrats, tendance historique, hubs régionaux, technologies | ~12 ms |
| `/api/v1/market-analysis` | GET | Répartition télétravail/hybride, secteurs économiques, croissance YoY, top rôles | ~11 ms |
| `/api/v1/matcher/analyze` | POST | Appariement de stack candidat, score de compatibilité, ROI des compétences manquantes | ~14 ms |
| `/api/v1/skills/pairings` | GET | Analyse de co-occurrence de compétences (Self-Join sur bridge_tech) | ~10 ms |
| `/api/v1/skills/list` | GET | Répertoire des 121 technologies avec domaines | ~3 ms |
| `/api/v1/skills/catalog` | GET | Matrice de fréquence complète (121 hard skills + 50 soft skills) | ~8 ms |

---

## 8. Interface Utilisateur (React 19 & Recharts)

L'application frontend (`New_design/src/`) est développée avec **React 19** et **TypeScript** sous **Vite 6** :

* **Système de Design Neo-Tech :** Thème clair/sombre avec persistance `localStorage`, cartes à effet de verre (*GlassCard*), badges et typographie optimisée.
* **Gestion d'État Serveur :** **TanStack React Query v5** avec mise en cache paramétrée (5 minutes TTL) et clés de requêtes synchronisées aux filtres.
* **Visualisations Interactives :** Recharts v3 (RadarCharts, AreaCharts, BarCharts empilés et horizontaux, PieCharts et RadialBarCharts).
* **Code Splitting :** Découpage en chunks asynchrones via `React.lazy()` et `Suspense` pour un temps de chargement initial ultra-rapide.

---

## 9. Fonctionnalités & Modules Décisionnels

### 1. Page d'Accueil (Landing Page)
Hero section interactive, métriques globales en direct (10,782 offres), preuve sociale des entreprises marocaines, présentation des cas d'usage par persona (Candidats, Recruteurs, Écoles) et FAQ.

### 2. Vue d'Ensemble du Marché (Market Overview)
* 5 Cartes KPI en temps réel (Total Postes, Entreprises, Villes, Flexibilité %, Expérience Moyenne).
* Répartition des contrats (CDI, CDD, Freelance, Stage).
* Tendance historique du volume d'offres (2016–2026).
* Classement des hubs régionaux et des diplômes exigés.

### 3. Analyse Détaillée (Detailed Analysis)
* Décomposition des modalités de travail (Télétravail, Hybride, Sur site).
* Poids des secteurs d'activité économique.
* Croissance relative des recrutements par ville (YoY %).
* Profils et intitulés de postes les plus sollicités.

### 4. Stack Matcher & ROI Booster (Appariement de Profil)
* Sélection interactive des compétences maîtrisées par le candidat avec présets par métier.
* Calcul en temps réel du taux de couverture du marché marocain et jauge de compatibilité (/100).
* Recommandation des compétences à fort retour sur investissement (*ROI Booster Skill*) pour débloquer de nouvelles offres.

### 5. Explorateur de Co-occurrences (Skill Pairings)
* Sélection d'une technologie pivot (ex: React, Java, Python).
* Identification des outils compagnons fréquemment exigés conjointement dans les offres (ex: React + Spring Boot, Python + Docker).

### 6. Matrice de Fréquence des Compétences (Skills Catalog)
* Exploration comparative des **121 technologies** et des **50 compétences comportementales**.
* Filtrage par catégorie (Frontend, Backend, Cloud & DevOps, Database, Data & AI, Mobile, Testing).
* Recherche instantanée avec barres de progression proportionnelles.

---

## 10. Guide d'Installation & Démarrage Local

### Prérequis
* **Python 3.10+** (Recommandé : 3.11)
* **Node.js 18+** (Recommandé : 20+)
* **Git**

### 1. Cloner le Dépôt
```bash
git clone https://github.com/votre-username/TechJob_SaaS_App.git
cd TechJob_SaaS_App
```

### 2. Démarrer le Backend FastAPI
```bash
cd New_design/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Le serveur API démarre sur `http://localhost:8000`. La documentation Swagger interactive est accessible sur `http://localhost:8000/docs`.*

### 3. Démarrer le Frontend React
```bash
cd ../../New_design
npm install
npm run dev
```
*L'application s'ouvre sur `http://localhost:3000` (ou `http://localhost:5173`).*

---

## 11. Déploiement Docker & Cloud (Render / Vercel)

### Déploiement avec Docker Compose
Le fichier `docker-compose.yml` orchestre le frontend et le backend avec isolation réseau :

```bash
docker-compose up --build
```
* Frontend : `http://localhost:3000` (Nginx Alpine avec routage SPA)
* Backend : `http://localhost:8000` (FastAPI + DuckDB Parquet)

### Déploiement Cloud (Production)
* **Backend (Render) :** Configuré via `render.yaml` (runtime Python 3.11, auto-détection des Parquet dans `data/parquet/`).
* **Frontend (Vercel) :** Configuré via `New_design/vercel.json` avec réécriture d'URL SPA (`/* -> /index.html`).

---

## 12. Validation des Données & Tests Automatisés

### Exécution des Tests Backend
```bash
cd New_design/backend
python test_phase1.py
```
```text
=======================================================
  TECHJOB ANALYTICS — TEST EXECUTION SUITE
=======================================================
  [PASS] test_01_filter_options_metadata
  [PASS] test_02_market_pulse_integrity
  [PASS] test_03_market_overview_unfiltered
  [PASS] test_04_market_overview_casablanca_filter
  [PASS] test_05_market_analysis_deep_dive
  [PASS] test_06_stack_matcher_valid
  [PASS] test_07_stack_matcher_empty_skills
  [PASS] test_08_skill_pairings_react
  [PASS] test_09_skills_catalog
=======================================================
  RESULTS: 9 PASSED, 0 FAILED / 9 TOTAL
=======================================================
```

### Exécution du Linting & Build Frontend
```bash
cd New_design
npm run lint
npm run build
```
*(Validation réussie avec 0 erreur TypeScript / ESLint et génération optimisée des bundles Vite).*

---

## 13. Limitations & Perspectives

* **Périmètre temporel :** Le jeu de données actuel couvre 10,782 offres (2016–2026). Une automatisation planifiée (GitHub Actions cron) permettra l'actualisation hebdomadaire.
* **Transparence salariale :** Au Maroc, une fraction d'annonces n'affiche pas les grilles salariales en clair. Les fourchettes salariales présentées sont issues d'estimations sectorielles recoupées.
* **Perspectives PFE :** Implémentation d'un modèle d'apprentissage supervisé (Gradient Boosting / Random Forest) pour la prédiction salariale selon le profil technique et la localisation.

---

## 🎓 Mentions & Remerciements

Ce projet a été conçu et soutenu dans le cadre du **Projet de Fin d’Études (PFE)**.  
*© 2026 TechJob Analytics. Fait avec passion et rigueur pour le marché technologique marocain.*
