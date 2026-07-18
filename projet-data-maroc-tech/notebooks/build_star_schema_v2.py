"""
=============================================================================
  BUILD STAR SCHEMA V2 — Marché IT au Maroc (Power BI Ready)
=============================================================================
  Input  : rekrute_clean_final.csv  (10,782 offres × 23 colonnes)
  Output : 13 tables CSV (Star Schema optimisé pour Power BI / VertiPaq)

  Architecture :
  ─────────────
  DIMENSIONS (9) :
    dim_date          → Calendrier complet (année → jour)
    dim_city          → Ville + Région
    dim_contract      → Type de contrat
    dim_education     → Niveau d'études
    dim_experience    → Label + fourchette d'années
    dim_entreprise    → Nom + Secteur + Sous-secteur
    dim_tech          → Technologies / Outils
    dim_soft_skills   → Compétences comportementales
    dim_languages     → Langues requises              ★ V2

  FAITS (1) :
    fact_offres       → Table des faits (FK + métriques)

  BRIDGES (3) :
    bridge_tech       → Many-to-Many (offre ↔ techno)
    bridge_soft_skills→ Many-to-Many (offre ↔ soft skill)
    bridge_languages  → Many-to-Many (offre ↔ langue)  ★ V2

  Auteur  : Ismail — Projet Data Maroc Tech
  Version : 2.0
  Date    : Juillet 2026
=============================================================================
"""

import pandas as pd
import numpy as np
import os
import sys

# Forcer l'encodage UTF-8 sur Windows
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────────────────────
INPUT_FILE = "rekrute_clean_final.csv"
OUTPUT_DIR = "../data/star_schema"
SEPARATOR = " | "  # Séparateur multi-valeurs dans le CSV


# ═══════════════════════════════════════════════════════════════════════════
#                         FONCTIONS MODULAIRES
# ═══════════════════════════════════════════════════════════════════════════

def load_dataset(path):
    """Charge le dataset source et effectue les pré-traitements basiques."""
    df = pd.read_csv(path)
    # Remplir le seul NaN connu (experience_label)
    df["experience_label"] = df["experience_label"].fillna("Non spécifié")
    return df


# ─── DIMENSIONS ──────────────────────────────────────────────────────────

def build_dim_date(years):
    """
    Construit une Calendar Table complète pour Power BI Time Intelligence.
    Couvre du 1er janvier de la première année au 31 décembre de la dernière.
    """
    date_range = pd.date_range(
        start=f"{min(years)}-01-01",
        end=f"{max(years)}-12-31",
        freq="D"
    )
    dim = pd.DataFrame({
        "date_id": range(1, len(date_range) + 1),
        "full_date": date_range,
        "year": date_range.year,
        "quarter": date_range.quarter,
        "quarter_label": ["T" + str(q) for q in date_range.quarter],
        "month": date_range.month,
        "month_name_fr": date_range.month.map({
            1: "Janvier", 2: "Février", 3: "Mars", 4: "Avril",
            5: "Mai", 6: "Juin", 7: "Juillet", 8: "Août",
            9: "Septembre", 10: "Octobre", 11: "Novembre", 12: "Décembre"
        }),
        "day_of_week": date_range.dayofweek,
        "day_name_fr": date_range.dayofweek.map({
            0: "Lundi", 1: "Mardi", 2: "Mercredi", 3: "Jeudi",
            4: "Vendredi", 5: "Samedi", 6: "Dimanche"
        }),
        "is_weekend": date_range.dayofweek.isin([5, 6]).astype(int),
    })
    # Mapping year → date_id (1er janvier de chaque année)
    year_map = (
        dim[dim["full_date"].dt.month.eq(1) & dim["full_date"].dt.day.eq(1)]
        .set_index("year")["date_id"]
        .to_dict()
    )
    return dim, year_map


def build_dim_city(df):
    """Construit la dimension Ville + Région (attributs uniquement)."""
    dim = (
        df[["city", "region"]]
        .drop_duplicates()
        .sort_values("city")
        .reset_index(drop=True)
    )
    dim.insert(0, "city_id", range(1, len(dim) + 1))
    mapping = dim.set_index("city")["city_id"].to_dict()
    return dim, mapping


def build_dim_contract(df):
    """Construit la dimension Type de contrat."""
    dim = (
        df[["contract_type"]]
        .drop_duplicates()
        .sort_values("contract_type")
        .reset_index(drop=True)
    )
    dim.insert(0, "contract_id", range(1, len(dim) + 1))
    mapping = dim.set_index("contract_type")["contract_id"].to_dict()
    return dim, mapping


def build_dim_education(df):
    """Construit la dimension Niveau d'études."""
    dim = (
        df[["education_level"]]
        .drop_duplicates()
        .reset_index(drop=True)
    )
    dim.insert(0, "edu_id", range(1, len(dim) + 1))
    mapping = dim.set_index("education_level")["edu_id"].to_dict()
    return dim, mapping


def build_dim_experience(df):
    """
    Construit la dimension Expérience.
    Utilise une clé composite (label + min + max) car le même label
    peut avoir des fourchettes différentes.
    """
    dim = (
        df[["experience_label", "exp_years_min", "exp_years_max"]]
        .drop_duplicates()
        .sort_values(["exp_years_min", "exp_years_max"])
        .reset_index(drop=True)
    )
    dim.insert(0, "exp_id", range(1, len(dim) + 1))

    # Clé composite pour le mapping
    def _make_key(row):
        return f"{row['experience_label']}|{row['exp_years_min']}|{row['exp_years_max']}"

    dim["_key"] = dim.apply(_make_key, axis=1)
    mapping = dim.set_index("_key")["exp_id"].to_dict()
    dim = dim.drop(columns=["_key"])
    return dim, mapping


def build_dim_entreprise(df):
    """
    Construit la dimension Entreprise.
    Conserve la granularité (company_name + sector + subsector) comme clé
    composite pour ne pas perdre d'information.
    """
    dim = (
        df[["company_name", "industry_sector", "industry_subsector"]]
        .drop_duplicates()
        .sort_values("company_name")
        .reset_index(drop=True)
    )
    dim.insert(0, "entreprise_id", range(1, len(dim) + 1))

    def _make_key(row):
        return f"{row['company_name']}|{row['industry_sector']}|{row['industry_subsector']}"

    dim["_key"] = dim.apply(_make_key, axis=1)
    mapping = dim.set_index("_key")["entreprise_id"].to_dict()
    dim = dim.drop(columns=["_key"])
    return dim, mapping


def build_dim_from_multivalue(series, id_col, name_col, separator=SEPARATOR,
                              exclude=None):
    """
    Construit une dimension à partir d'une colonne multi-valuée (split par séparateur).
    Utilisée pour dim_tech, dim_soft_skills, dim_languages.

    Args:
        series: La colonne pandas (ex: df["tech_stack"])
        id_col: Nom de la colonne PK (ex: "tech_id")
        name_col: Nom de la colonne valeur (ex: "tech_name")
        separator: Séparateur (défaut " | ")
        exclude: Set de valeurs à exclure (ex: {"Non spécifié"})

    Returns:
        dim: DataFrame de la dimension
        mapping: dict {valeur → id}
    """
    if exclude is None:
        exclude = set()

    all_values = (
        series
        .dropna()
        .str.split(separator, regex=False)
        .explode()
        .str.strip()
        .unique()
    )
    # Filtrer les valeurs vides et les exclusions
    all_values = sorted([v for v in all_values if v and v not in exclude])

    dim = pd.DataFrame({
        id_col: range(1, len(all_values) + 1),
        name_col: all_values
    })
    mapping = dim.set_index(name_col)[id_col].to_dict()
    return dim, mapping


# ─── BRIDGES ─────────────────────────────────────────────────────────────

def build_bridge(df, source_col, value_map, fk_col, separator=SEPARATOR,
                 exclude=None):
    """
    Construit une Bridge Table (Many-to-Many) à partir d'une colonne multi-valuée.

    Args:
        df: Le DataFrame source
        source_col: Nom de la colonne à exploser (ex: "tech_stack")
        value_map: dict {valeur → id} issu de la dimension
        fk_col: Nom de la colonne FK (ex: "tech_id")
        separator: Séparateur
        exclude: Set de valeurs à exclure

    Returns:
        DataFrame avec colonnes [job_id, fk_col]
    """
    if exclude is None:
        exclude = set()

    rows = []
    for idx, row in df.iterrows():
        cell = row[source_col]
        if pd.notna(cell) and str(cell).strip():
            values = [v.strip() for v in str(cell).split(separator)]
            values = [v for v in values if v]  # Supprimer les valeurs vides
            job_id = idx + 1  # Integer 1-based
            for val in values:
                if val in value_map and val not in exclude:
                    rows.append({"job_id": job_id, fk_col: value_map[val]})
    return pd.DataFrame(rows)


# ─── FACT TABLE ──────────────────────────────────────────────────────────

def build_fact_offres(df, year_map, city_map, contract_map, edu_map,
                      exp_map, ent_map):
    """
    Construit la table des faits avec clés étrangères Integer,
    attributs dégénérés, et métriques pré-calculées.
    """
    # Clés composites temporaires pour le mapping
    exp_keys = (
        df["experience_label"] + "|"
        + df["exp_years_min"].astype(str) + "|"
        + df["exp_years_max"].astype(str)
    )
    ent_keys = (
        df["company_name"] + "|"
        + df["industry_sector"] + "|"
        + df["industry_subsector"]
    )

    fact = pd.DataFrame({
        # ── Clé primaire (entier séquentiel) ──
        "job_id": range(1, len(df) + 1),

        # ── Clés étrangères (Integer = compression VertiPaq optimale) ──
        "date_id": df["year"].map(year_map).astype("Int64"),
        "city_id": df["city"].map(city_map).astype("Int64"),
        "contract_id": df["contract_type"].map(contract_map).astype("Int64"),
        "edu_id": df["education_level"].map(edu_map).astype("Int64"),
        "exp_id": exp_keys.map(exp_map).astype("Int64"),
        "entreprise_id": ent_keys.map(ent_map).astype("Int64"),

        # ── Attributs dégénérés (pas de dimension dédiée nécessaire) ──
        "job_title": df["job_title"].values,
        "job_id_original": df["job_id"].values,
        "job_function": df["job_function"].values,

        # ── Métriques / Flags ──
        "work_mode": df["work_mode"].values,
        "allows_remote": df["allows_remote"].values,
        "allows_hybrid": df["allows_hybrid"].values,
        "uses_agile": df["uses_agile"].astype(int).values,
        "has_benefits": df["has_benefits"].astype(int).values,
        "remote_friendly": df["remote_friendly"].astype(int).values,

        # ── Compteurs pré-calculés pour Power BI ──
        "nb_tech_skills": df["tech_stack"].apply(
            lambda x: len([t for t in x.split(SEPARATOR) if t.strip()])
            if pd.notna(x) and x.strip() else 0
        ).values,
        "nb_soft_skills": df["soft_skills"].apply(
            lambda x: len([s for s in x.split(SEPARATOR) if s.strip()])
            if pd.notna(x) and x.strip() else 0
        ).values,
        "nb_languages": df["languages"].apply(
            lambda x: len([l for l in x.split(SEPARATOR) if l.strip()])
            if pd.notna(x) and x.strip() and x.strip() != "Non spécifié" else 0
        ).values,
    })
    return fact


# ─── VALIDATION ──────────────────────────────────────────────────────────

def verify_integrity(fact, bridges, dims):
    """
    Vérifie l'intégrité référentielle du Star Schema.
    - 0 orphelins dans les FK
    - 0 NaN dans les clés
    - Toutes les FK de la fact table ont une correspondance dans les dimensions

    Args:
        fact: DataFrame fact_offres
        bridges: dict {"bridge_name": (bridge_df, fk_col, dim_df, dim_pk)}
        dims: dict {"dim_name": (dim_df, fk_col_in_fact)}

    Returns:
        True si tout est OK, False sinon
    """
    print("\n" + "─" * 65)
    print("  VÉRIFICATION D'INTÉGRITÉ")
    print("─" * 65)

    all_ok = True

    # 1. Vérifier les FK dans fact_offres → dimensions
    for dim_name, (dim_df, pk_col, fk_col) in dims.items():
        null_count = fact[fk_col].isna().sum()
        orphans = fact[~fact[fk_col].isin(dim_df[pk_col])][fk_col]
        orphan_count = len(orphans.dropna())

        status = "✅" if (null_count == 0 and orphan_count == 0) else "❌"
        if null_count > 0 or orphan_count > 0:
            all_ok = False
        print(f"   {status} fact_offres[{fk_col}] → {dim_name}[{pk_col}]"
              f"  | NaN: {null_count} | Orphelins: {orphan_count}")

    # 2. Vérifier les Bridge Tables
    for bridge_name, (bridge_df, fk_col, dim_df, dim_pk) in bridges.items():
        # FK vers fact
        orphan_jobs = bridge_df[~bridge_df["job_id"].isin(fact["job_id"])]
        # FK vers dimension
        orphan_dims = bridge_df[~bridge_df[fk_col].isin(dim_df[dim_pk])]
        null_count = bridge_df[[fk_col, "job_id"]].isna().sum().sum()

        status = "✅" if (len(orphan_jobs) == 0 and len(orphan_dims) == 0) else "❌"
        if len(orphan_jobs) > 0 or len(orphan_dims) > 0:
            all_ok = False
        print(f"   {status} {bridge_name}[job_id] → fact_offres"
              f"  | Orphelins job: {len(orphan_jobs)}"
              f" | Orphelins {fk_col}: {len(orphan_dims)}")

    # 3. Résumé
    if all_ok:
        print("\n   🎉 INTÉGRITÉ PARFAITE — 0 orphelins, 0 NaN dans toutes les clés")
    else:
        print("\n   ⚠️  Des problèmes d'intégrité ont été détectés !")

    return all_ok


# ─── EXPORT ──────────────────────────────────────────────────────────────

def export_tables(tables, output_dir):
    """Exporte toutes les tables en CSV (UTF-8 BOM pour Excel/Power BI)."""
    os.makedirs(output_dir, exist_ok=True)

    print("\n" + "─" * 65)
    print("  EXPORT DES TABLES")
    print("─" * 65)

    for name, table in tables.items():
        path = os.path.join(output_dir, f"{name}.csv")
        table.to_csv(path, index=False, encoding="utf-8-sig")
        print(f"   📁 {name}.csv  →  {len(table):>6,} lignes × {len(table.columns)} colonnes")


def print_summary(tables, output_dir, years):
    """Affiche le résumé final du Star Schema."""
    print("\n" + "=" * 65)
    print("  ✅ STAR SCHEMA V2 — 13 TABLES GÉNÉRÉES")
    print("=" * 65)

    # Grouper par type
    dims = {k: v for k, v in tables.items() if k.startswith("dim_")}
    facts = {k: v for k, v in tables.items() if k.startswith("fact_")}
    bridges_t = {k: v for k, v in tables.items() if k.startswith("bridge_")}

    print("\n  📊 DIMENSIONS (9 tables) :")
    for name, t in sorted(dims.items()):
        print(f"     {name:<20} {len(t):>6,} lignes")

    print("\n  📋 FAITS (1 table) :")
    for name, t in facts.items():
        print(f"     {name:<20} {len(t):>6,} lignes × {len(t.columns)} colonnes")

    print("\n  🔗 BRIDGES (3 tables) :")
    for name, t in sorted(bridges_t.items()):
        print(f"     {name:<20} {len(t):>6,} lignes")

    total_rows = sum(len(t) for t in tables.values())
    print(f"\n  📂 Dossier : {os.path.abspath(output_dir)}")
    print(f"  📈 Total   : {total_rows:,} lignes dans 13 tables")

    print("\n" + "─" * 65)
    print("  🔧 RELATIONS POWER BI :")
    print("─" * 65)
    relations = [
        ("dim_date[date_id]", "fact_offres[date_id]", "1:N"),
        ("dim_city[city_id]", "fact_offres[city_id]", "1:N"),
        ("dim_contract[contract_id]", "fact_offres[contract_id]", "1:N"),
        ("dim_education[edu_id]", "fact_offres[edu_id]", "1:N"),
        ("dim_experience[exp_id]", "fact_offres[exp_id]", "1:N"),
        ("dim_entreprise[entreprise_id]", "fact_offres[entreprise_id]", "1:N"),
        ("fact_offres[job_id]", "bridge_tech[job_id]", "1:N"),
        ("dim_tech[tech_id]", "bridge_tech[tech_id]", "1:N"),
        ("fact_offres[job_id]", "bridge_soft_skills[job_id]", "1:N"),
        ("dim_soft_skills[soft_id]", "bridge_soft_skills[soft_id]", "1:N"),
        ("fact_offres[job_id]", "bridge_languages[job_id]", "1:N"),
        ("dim_languages[language_id]", "bridge_languages[language_id]", "1:N"),
    ]
    for src, dst, card in relations:
        print(f"     {src:<35} → {dst:<35} ({card})")

    print("\n  🎉 TERMINÉ !\n")


# ═══════════════════════════════════════════════════════════════════════════
#                              MAIN
# ═══════════════════════════════════════════════════════════════════════════

def main():
    print("=" * 65)
    print("  STAR SCHEMA V2 — Marché IT au Maroc")
    print("  13 Tables • Integer IDs • UTF-8 BOM • 0 NaN")
    print("=" * 65)

    # ── 0. Chargement ────────────────────────────────────────────────────
    df = load_dataset(INPUT_FILE)
    print(f"\n✅ Dataset chargé : {df.shape[0]:,} lignes × {df.shape[1]} colonnes")

    years = sorted(df["year"].unique())

    # ── 1. Dimensions ────────────────────────────────────────────────────
    print("\n── Construction des Dimensions ──")

    print("   [1/9]  dim_date ...")
    dim_date, year_map = build_dim_date(years)
    print(f"          → {len(dim_date):,} jours ({min(years)}–{max(years)})")

    print("   [2/9]  dim_city ...")
    dim_city, city_map = build_dim_city(df)
    print(f"          → {len(dim_city)} villes")

    print("   [3/9]  dim_contract ...")
    dim_contract, contract_map = build_dim_contract(df)
    print(f"          → {len(dim_contract)} types")

    print("   [4/9]  dim_education ...")
    dim_education, edu_map = build_dim_education(df)
    print(f"          → {len(dim_education)} niveaux")

    print("   [5/9]  dim_experience ...")
    dim_experience, exp_map = build_dim_experience(df)
    print(f"          → {len(dim_experience)} niveaux")

    print("   [6/9]  dim_entreprise ...")
    dim_entreprise, ent_map = build_dim_entreprise(df)
    print(f"          → {len(dim_entreprise):,} entreprises")

    print("   [7/9]  dim_tech ...")
    dim_tech, tech_map = build_dim_from_multivalue(
        df["tech_stack"], "tech_id", "tech_name"
    )
    print(f"          → {len(dim_tech)} technologies")

    print("   [8/9]  dim_soft_skills ...")
    dim_soft_skills, soft_map = build_dim_from_multivalue(
        df["soft_skills"], "soft_id", "soft_skill_name"
    )
    print(f"          → {len(dim_soft_skills)} soft skills")

    print("   [9/9]  dim_languages ...")
    dim_languages, lang_map = build_dim_from_multivalue(
        df["languages"], "language_id", "language_name",
        exclude={"Non spécifié"}
    )
    print(f"          → {len(dim_languages)} langues")

    # ── 2. Bridge Tables ─────────────────────────────────────────────────
    print("\n── Construction des Bridges ──")

    print("   [1/3]  bridge_tech ...")
    bridge_tech = build_bridge(df, "tech_stack", tech_map, "tech_id")
    print(f"          → {len(bridge_tech):,} lignes")

    print("   [2/3]  bridge_soft_skills ...")
    bridge_soft_skills = build_bridge(df, "soft_skills", soft_map, "soft_id")
    print(f"          → {len(bridge_soft_skills):,} lignes")

    print("   [3/3]  bridge_languages ...")
    bridge_languages = build_bridge(
        df, "languages", lang_map, "language_id",
        exclude={"Non spécifié"}
    )
    print(f"          → {len(bridge_languages):,} lignes")

    # ── 3. Fact Table ────────────────────────────────────────────────────
    print("\n── Construction de la Table des Faits ──")
    fact_offres = build_fact_offres(
        df, year_map, city_map, contract_map, edu_map, exp_map, ent_map
    )
    print(f"   fact_offres → {len(fact_offres):,} lignes × {len(fact_offres.columns)} colonnes")

    # ── 4. Intégrité ─────────────────────────────────────────────────────
    verify_integrity(
        fact=fact_offres,
        bridges={
            "bridge_tech": (bridge_tech, "tech_id", dim_tech, "tech_id"),
            "bridge_soft_skills": (bridge_soft_skills, "soft_id", dim_soft_skills, "soft_id"),
            "bridge_languages": (bridge_languages, "language_id", dim_languages, "language_id"),
        },
        dims={
            "dim_date": (dim_date, "date_id", "date_id"),
            "dim_city": (dim_city, "city_id", "city_id"),
            "dim_contract": (dim_contract, "contract_id", "contract_id"),
            "dim_education": (dim_education, "edu_id", "edu_id"),
            "dim_experience": (dim_experience, "exp_id", "exp_id"),
            "dim_entreprise": (dim_entreprise, "entreprise_id", "entreprise_id"),
        }
    )

    # ── 5. Export ────────────────────────────────────────────────────────
    all_tables = {
        "dim_date": dim_date,
        "dim_city": dim_city,
        "dim_contract": dim_contract,
        "dim_education": dim_education,
        "dim_experience": dim_experience,
        "dim_entreprise": dim_entreprise,
        "dim_tech": dim_tech,
        "dim_soft_skills": dim_soft_skills,
        "dim_languages": dim_languages,
        "fact_offres": fact_offres,
        "bridge_tech": bridge_tech,
        "bridge_soft_skills": bridge_soft_skills,
        "bridge_languages": bridge_languages,
    }

    export_tables(all_tables, OUTPUT_DIR)

    # ── 6. Résumé ────────────────────────────────────────────────────────
    print_summary(all_tables, OUTPUT_DIR, years)


if __name__ == "__main__":
    main()
