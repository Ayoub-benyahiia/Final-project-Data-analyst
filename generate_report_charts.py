"""
=============================================================================
  ACADEMIC THESIS GRAPHICS GENERATOR — TechJob Analytics (Morocco)
=============================================================================
  Connects DuckDB directly to vectorized Parquet star schema tables.
  Generates 5 publication-ready, 300 DPI figures using Seaborn & Matplotlib
  for PFE thesis, defense slide deck, and academic publication.
=============================================================================
"""

import os
import sys
import duckdb
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Force UTF-8 stdout on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ─────────────────────────────────────────────────────────────────────────────
# 1. PATHS & DIRECTORY SETUP
# ─────────────────────────────────────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PARQUET_DIR = os.path.join(PROJECT_ROOT, "projet-data-maroc-tech", "data", "parquet").replace("\\", "/")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "generated_charts")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# 2. DUCKDB VECTORIZED VIEW REGISTRATION
# ─────────────────────────────────────────────────────────────────────────────
con = duckdb.connect(database=":memory:", read_only=False)
tables = [
    "fact_offres", "bridge_tech", "bridge_soft_skills", "bridge_languages",
    "dim_tech", "dim_experience", "dim_city", "dim_contract",
    "dim_education", "dim_entreprise", "dim_date", "dim_soft_skills", "dim_languages"
]

for table in tables:
    parquet_path = f"{PARQUET_DIR}/{table}.parquet"
    if os.path.exists(parquet_path):
        con.execute(f"CREATE OR REPLACE VIEW {table} AS SELECT * FROM read_parquet('{parquet_path}')")

print(f"[DuckDB] Registered views over Parquet from: {PARQUET_DIR}")

# ─────────────────────────────────────────────────────────────────────────────
# 3. SEABORN & MATPLOTLIB GLOBAL STYLING
# ─────────────────────────────────────────────────────────────────────────────
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Helvetica']
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 1.2
sns.set_theme(style="whitegrid", palette="deep")

PRIMARY_BLUE = "#2563eb"
SECONDARY_SKY = "#0ea5e9"
ACCENT_CYAN = "#38bdf8"
DARK_NAVY = "#1e293b"
EMERALD_GREEN = "#10b981"
ROSE_RED = "#f43f5e"
AMBER_GOLD = "#f59e0b"

# ─────────────────────────────────────────────────────────────────────────────
# CHART 1: TOP 15 IN-DEMAND TECHNOLOGIES (Horizontal Bar Plot)
# ─────────────────────────────────────────────────────────────────────────────
def generate_chart_1():
    query = """
        SELECT 
            t.tech_name,
            t.category,
            COUNT(DISTINCT b.job_id) AS demand_count,
            ROUND(COUNT(DISTINCT b.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS market_share_pct
        FROM bridge_tech b
        JOIN dim_tech t ON b.tech_id = t.tech_id
        GROUP BY t.tech_name, t.category
        ORDER BY demand_count DESC
        LIMIT 15
    """
    df = con.execute(query).df()
    
    fig, ax = plt.subplots(figsize=(12, 7.5), dpi=300)
    
    # Gradient colors based on demand
    colors = [PRIMARY_BLUE if i < 3 else SECONDARY_SKY if i < 8 else "#64748b" for i in range(len(df))]
    bars = ax.barh(df['tech_name'], df['demand_count'], color=colors, height=0.68, edgecolor='none')
    
    ax.invert_yaxis()
    ax.set_title("Top 15 In-Demand Technologies in the Moroccan IT Market", fontsize=15, fontweight='bold', pad=18, color=DARK_NAVY)
    ax.set_xlabel("Number of Job Postings Requiring Technology (Total = 10,782)", fontsize=11, fontweight='semibold', labelpad=10, color=DARK_NAVY)
    ax.set_ylabel("", fontsize=11)
    
    # Value annotations on bars
    for bar, pct, count in zip(bars, df['market_share_pct'], df['demand_count']):
        width = bar.get_width()
        ax.text(width + 45, bar.get_y() + bar.get_height() / 2, f"{count:,} ({pct}%)",
                ha='left', va='center', fontsize=9.5, fontweight='bold', color='#334155')
        
    ax.set_xlim(0, max(df['demand_count']) * 1.15)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    
    output_path = os.path.join(OUTPUT_DIR, "01_tech_demand.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved: {output_path}")

# ─────────────────────────────────────────────────────────────────────────────
# CHART 2: REACT SKILL PAIRINGS & CO-OCCURRENCE (Horizontal Stacked / Bar)
# ─────────────────────────────────────────────────────────────────────────────
def generate_chart_2():
    query = """
        WITH react_jobs AS (
            SELECT DISTINCT b.job_id
            FROM bridge_tech b
            JOIN dim_tech t ON b.tech_id = t.tech_id
            WHERE LOWER(t.tech_name) = 'react'
        ),
        total_react AS (
            SELECT COUNT(*) AS total FROM react_jobs
        )
        SELECT 
            t.tech_name,
            t.category,
            COUNT(DISTINCT b.job_id) AS co_occurrence_count,
            ROUND(COUNT(DISTINCT b.job_id) * 100.0 / (SELECT total FROM total_react), 1) AS pairing_rate_pct
        FROM bridge_tech b
        JOIN dim_tech t ON b.tech_id = t.tech_id
        WHERE b.job_id IN (SELECT job_id FROM react_jobs)
          AND LOWER(t.tech_name) != 'react'
        GROUP BY t.tech_name, t.category
        ORDER BY co_occurrence_count DESC
        LIMIT 10
    """
    df = con.execute(query).df()
    
    fig, ax = plt.subplots(figsize=(11, 6.5), dpi=300)
    
    palette = sns.color_palette("Blues_r", n_colors=len(df))
    bars = ax.barh(df['tech_name'], df['pairing_rate_pct'], color=palette, height=0.65)
    
    ax.invert_yaxis()
    ax.set_title("Companion Technologies Bundled with React (Moroccan IT Postings)", fontsize=14, fontweight='bold', pad=16, color=DARK_NAVY)
    ax.set_xlabel("Co-occurrence / Pairing Rate (%) in React Job Postings", fontsize=11, fontweight='semibold', labelpad=10, color=DARK_NAVY)
    
    for bar, count in zip(bars, df['co_occurrence_count']):
        width = bar.get_width()
        ax.text(width + 0.8, bar.get_y() + bar.get_height() / 2, f"{width:.1f}% ({count} jobs)",
                ha='left', va='center', fontsize=9.5, fontweight='bold', color='#1e293b')
        
    ax.set_xlim(0, max(df['pairing_rate_pct']) * 1.18)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    
    output_path = os.path.join(OUTPUT_DIR, "02_skill_pairings_react.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved: {output_path}")

# ─────────────────────────────────────────────────────────────────────────────
# CHART 3: SENIORITY & JUNIOR ACCESSIBILITY (5-Tier Breakdown)
# ─────────────────────────────────────────────────────────────────────────────
def generate_chart_3():
    query = """
        SELECT 
            e.experience_label,
            e.tier,
            COUNT(f.job_id) AS total_jobs,
            ROUND(COUNT(f.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS pct
        FROM fact_offres f
        JOIN dim_experience e ON f.exp_id = e.exp_id
        GROUP BY e.exp_id, e.experience_label, e.tier
        ORDER BY e.exp_id
    """
    df = con.execute(query).df()
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6), dpi=300, gridspec_kw={'width_ratios': [1.3, 1]})
    
    # 1. Bar Chart with Junior vs Senior highlighting
    colors = [EMERALD_GREEN if 'Débutant' in lbl or 'Junior' in lbl else '#64748b' for lbl in df['experience_label']]
    bars = ax1.bar(df['experience_label'], df['total_jobs'], color=colors, width=0.55, edgecolor='none')
    
    ax1.set_title("Moroccan IT Postings by Experience Tier", fontsize=13, fontweight='bold', color=DARK_NAVY, pad=12)
    ax1.set_ylabel("Number of Offers", fontsize=10, fontweight='semibold')
    ax1.set_xticklabels(df['experience_label'], rotation=20, ha='right', fontsize=9.5)
    
    for bar, pct in zip(bars, df['pct']):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width() / 2, height + 70, f"{int(height):,}\n({pct}%)",
                 ha='center', va='bottom', fontsize=9, fontweight='bold', color='#1e293b')
        
    ax1.set_ylim(0, max(df['total_jobs']) * 1.22)
    ax1.spines['top'].set_visible(False)
    ax1.spines['right'].set_visible(False)
    
    # 2. Donut Chart for Junior Index
    junior_total = df[df['experience_label'].str.contains('Débutant|Junior', regex=True)]['total_jobs'].sum()
    senior_total = 10782 - junior_total
    junior_pct = (junior_total / 10782) * 100
    
    donut_labels = [f'Junior Accessible\n(0-3 Yrs): {junior_pct:.1f}%', f'Mid & Senior Roles\n(3+ Yrs): {100-junior_pct:.1f}%']
    donut_colors = [EMERALD_GREEN, '#cbd5e1']
    
    wedges, texts, autotexts = ax2.pie(
        [junior_total, senior_total],
        labels=donut_labels,
        colors=donut_colors,
        autopct='%1.1f%%',
        startangle=140,
        pctdistance=0.75,
        wedgeprops=dict(width=0.42, edgecolor='white', linewidth=2)
    )
    for at in autotexts:
        at.set_color('#0f172a')
        at.set_fontweight('bold')
    for t in texts:
        t.set_fontsize(10)
        t.set_fontweight('semibold')
        
    ax2.set_title("Junior Accessibility Index (31.5%)", fontsize=13, fontweight='bold', color=DARK_NAVY, pad=12)
    
    plt.tight_layout()
    output_path = os.path.join(OUTPUT_DIR, "03_seniority_distribution.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved: {output_path}")

# ─────────────────────────────────────────────────────────────────────────────
# CHART 4: GEOGRAPHIC REGIONAL HUBS (Horizontal Bar with Shares)
# ─────────────────────────────────────────────────────────────────────────────
def generate_chart_4():
    query = """
        SELECT 
            c.city_name,
            c.region,
            COUNT(f.job_id) AS total_jobs,
            ROUND(COUNT(f.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS market_share_pct
        FROM fact_offres f
        JOIN dim_city c ON f.city_id = c.city_id
        GROUP BY c.city_name, c.region
        ORDER BY total_jobs DESC
        LIMIT 8
    """
    df = con.execute(query).df()
    
    fig, ax = plt.subplots(figsize=(11, 6), dpi=300)
    
    colors = [PRIMARY_BLUE if i == 0 else SECONDARY_SKY if i == 1 else "#94a3b8" for i in range(len(df))]
    bars = ax.barh(df['city_name'], df['total_jobs'], color=colors, height=0.62)
    
    ax.invert_yaxis()
    ax.set_title("Geographic Concentration of IT Jobs Across Moroccan Cities", fontsize=14, fontweight='bold', pad=16, color=DARK_NAVY)
    ax.set_xlabel("Number of Job Postings", fontsize=11, fontweight='semibold', labelpad=10, color=DARK_NAVY)
    
    for bar, pct, region in zip(bars, df['market_share_pct'], df['region']):
        width = bar.get_width()
        ax.text(width + 70, bar.get_y() + bar.get_height() / 2, f"{int(width):,} ({pct}%) — {region}",
                ha='left', va='center', fontsize=9, fontweight='semibold', color='#334155')
        
    ax.set_xlim(0, max(df['total_jobs']) * 1.35)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    
    output_path = os.path.join(OUTPUT_DIR, "04_regional_hubs.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved: {output_path}")

# ─────────────────────────────────────────────────────────────────────────────
# CHART 5: CONTRACT TYPES DISTRIBUTION
# ─────────────────────────────────────────────────────────────────────────────
def generate_chart_5():
    query = """
        SELECT 
            ct.contract_type,
            COUNT(f.job_id) AS total_jobs,
            ROUND(COUNT(f.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS share_pct
        FROM fact_offres f
        JOIN dim_contract ct ON f.contract_id = ct.contract_id
        GROUP BY ct.contract_type
        ORDER BY total_jobs DESC
    """
    df = con.execute(query).df()
    
    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=300)
    
    colors = [PRIMARY_BLUE, SECONDARY_SKY, EMERALD_GREEN, AMBER_GOLD, '#94a3b8'][:len(df)]
    bars = ax.bar(df['contract_type'], df['total_jobs'], color=colors, width=0.5)
    
    ax.set_title("Distribution of IT Employment Contract Types in Morocco", fontsize=14, fontweight='bold', pad=16, color=DARK_NAVY)
    ax.set_ylabel("Total Postings", fontsize=11, fontweight='semibold')
    
    for bar, pct in zip(bars, df['share_pct']):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width() / 2, height + 80, f"{int(height):,}\n({pct}%)",
                ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#1e293b')
        
    ax.set_ylim(0, max(df['total_jobs']) * 1.2)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    plt.tight_layout()
    
    output_path = os.path.join(OUTPUT_DIR, "05_contract_types.png")
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"[OK] Saved: {output_path}")

if __name__ == "__main__":
    print("=" * 70)
    print("  GENERATING PUBLICATION-READY 300 DPI SEABORN CHARTS")
    print("=" * 70)
    generate_chart_1()
    generate_chart_2()
    generate_chart_3()
    generate_chart_4()
    generate_chart_5()
    print("=" * 70)
    print(f"All 5 thesis figures successfully generated in: {OUTPUT_DIR}")
    print("=" * 70)
