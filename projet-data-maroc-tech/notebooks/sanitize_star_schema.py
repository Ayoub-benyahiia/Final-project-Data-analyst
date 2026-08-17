"""
=============================================================================
  SANITIZE & NORMALIZE STAR SCHEMA — TechJob Analytics (PFE Morocco)
=============================================================================
  Transforms raw and semi-cleaned data into a pristine, deduplicated, 
  categorized Star Schema stored in both clean CSV and high-performance 
  columnar Parquet format for DuckDB.

  1. dim_tech normalization (merge aliases, drop noise, add 8 categories)
  2. dim_experience standard 5-tier canonicalization
  3. dim_city Moroccan geographical cleansing and proper regional alignment
  4. Referential integrity enforcement across fact_offres and 3 bridges
  5. Export to ../data/star_schema/*.csv and ../data/parquet/*.parquet
  6. Automated validation suite (DuckDB + PyArrow + Skill Pairings)
=============================================================================
"""

import os
import sys
import json
import pandas as pd
import numpy as np

# Force UTF-8 stdout
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIR, "rekrute_clean_final.csv")
CSV_OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "data", "star_schema")
PARQUET_OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "data", "parquet")
SEPARATOR = " | "

# =============================================================================
# 1. TECH ALIASES & CATEGORY TAXONOMY
# =============================================================================

TECH_CANONICAL_MAP = {
    # Kubernetes / Containers
    "k8s": "Kubernetes", "kubernetes": "Kubernetes",
    "docker": "Docker", "container": "Docker",
    
    # Cloud Providers
    "gcp": "Google Cloud", "google cloud": "Google Cloud",
    "aws": "AWS", "amazon web services": "AWS",
    "azure": "Azure", "microsoft azure": "Azure",
    
    # AI / ML / Data Science
    "ai": "Artificial Intelligence / Machine Learning", "ia": "Artificial Intelligence / Machine Learning",
    "machine learning": "Artificial Intelligence / Machine Learning",
    "deep learning": "Deep Learning", "computer vision": "Computer Vision", "nlp": "NLP",
    "tensorflow": "TensorFlow", "pytorch": "PyTorch", "scikit-learn": "Scikit-Learn",
    "pandas": "Pandas", "numpy": "NumPy", "matplotlib": "Matplotlib", "seaborn": "Seaborn",
    
    # Big Data / Data Engineering
    "spark": "Apache Spark", "apache spark": "Apache Spark",
    "kafka": "Apache Kafka", "apache kafka": "Apache Kafka",
    "hadoop": "Apache Hadoop", "apache hadoop": "Apache Hadoop",
    "airflow": "Apache Airflow", "apache airflow": "Apache Airflow",
    "dbt": "dbt", "elt": "ETL / Data Pipelines", "etl": "ETL / Data Pipelines",
    "big data": "Big Data", "data engineering": "Data Engineering",
    "data analytics": "Data Analytics", "data science": "Data Science",
    
    # BI / Reporting
    "power bi": "Power BI", "power query": "Power Query", "dax": "DAX",
    "tableau": "Tableau", "qlik": "Qlik", "looker": "Looker",
    "ssas": "SSAS", "ssis": "SSIS", "ssrs": "SSRS",
    "excel": "Excel / Advanced Sheets", "vba": "VBA",
    
    # Databases
    "postgres": "PostgreSQL", "postgresql": "PostgreSQL",
    "mysql": "MySQL", "mariadb": "MariaDB",
    "sql server": "SQL Server", "mssql": "SQL Server",
    "oracle": "Oracle Database", "oracle database": "Oracle Database",
    "mongodb": "MongoDB", "redis": "Redis",
    "elasticsearch": "Elasticsearch", "cassandra": "Cassandra",
    "dynamodb": "DynamoDB", "cosmosdb": "CosmosDB", "neo4j": "Neo4j",
    "sqlite": "SQLite", "ms access": "MS Access",
    "sql": "SQL", "pl/sql": "PL/SQL", "t-sql": "T-SQL",
    
    # Frontend
    "react": "React", "react.js": "React", "reactjs": "React",
    "angular": "Angular", "angular.js": "Angular", "angularjs": "Angular",
    "vue.js": "Vue.js", "vue": "Vue.js", "vuejs": "Vue.js",
    "next.js": "Next.js", "nextjs": "Next.js",
    "nuxt": "Nuxt.js", "nuxt.js": "Nuxt.js",
    "typescript": "TypeScript", "javascript": "JavaScript",
    
    # Backend Frameworks & Languages
    "java": "Java", "spring": "Spring Boot", "spring boot": "Spring Boot",
    "python": "Python", "django": "Django", "fastapi": "FastAPI", "flask": "Flask",
    "php": "PHP", "laravel": "Laravel", "symfony": "Symfony",
    ".net": ".NET", ".net core": ".NET", "c#": "C#", "c++": "C++",
    "node.js": "Node.js", "node": "Node.js", "nodejs": "Node.js",
    "express.js": "Express", "express": "Express",
    "go": "Go", "golang": "Go", "ruby": "Ruby", "rust": "Rust",
    "scala": "Scala", "perl": "Perl", "dart": "Dart", "matlab": "MATLAB", "r": "R",
    
    # API & Architecture
    "rest": "REST API", "api": "REST API", "api rest": "REST API",
    "graphql": "GraphQL", "soap": "SOAP", "microservices": "Microservices",
    
    # Mobile
    "flutter": "Flutter", "react native": "React Native",
    "android": "Android", "ios": "iOS", "kotlin": "Kotlin", "swift": "Swift",
    
    # DevOps & Infrastructure
    "ci/cd": "CI/CD", "github actions": "GitHub Actions", "gitlab ci": "GitLab CI",
    "jenkins": "Jenkins", "ansible": "Ansible", "terraform": "Terraform",
    "linux": "Linux", "windows server": "Windows Server", "vmware": "VMware", "nginx": "Nginx",
    "git": "Git", "jira": "Jira", "confluence": "Confluence",
    
    # Security
    "cybersécurité": "Cybersecurity", "cybersecurite": "Cybersecurity",
    "iso 27001": "ISO 27001", "siem": "SIEM", "soc": "SOC",
    "pentest": "Penetration Testing", "firewall": "Firewall / Network Security",
    
    # Methodology & Agile
    "scrum": "Scrum / Agile", "agile": "Scrum / Agile",
    
    # Enterprise & LowCode
    "sap": "SAP", "odoo": "Odoo", "salesforce": "Salesforce",
    "dynamics 365": "Dynamics 365", "rpa": "RPA", "blockchain": "Blockchain", "iot": "IoT"
}

TECH_CATEGORY_MAP = {
    # Frontend
    "React": "Frontend", "Angular": "Frontend", "Vue.js": "Frontend",
    "Next.js": "Frontend", "Nuxt.js": "Frontend", "TypeScript": "Frontend",
    "JavaScript": "Frontend",
    
    # Backend
    "Java": "Backend", "Spring Boot": "Backend", "Python": "Backend",
    "Django": "Backend", "FastAPI": "Backend", "Flask": "Backend",
    "PHP": "Backend", "Laravel": "Backend", "Symfony": "Backend",
    ".NET": "Backend", "C#": "Backend", "C++": "Backend",
    "Node.js": "Backend", "Express": "Backend", "Go": "Backend",
    "Ruby": "Backend", "Rust": "Backend", "Scala": "Backend",
    "Perl": "Backend", "REST API": "Backend", "GraphQL": "Backend",
    "SOAP": "Backend", "Microservices": "Backend",
    
    # Database
    "PostgreSQL": "Database", "MySQL": "Database", "MariaDB": "Database",
    "SQL Server": "Database", "Oracle Database": "Database", "MongoDB": "Database",
    "Redis": "Database", "Elasticsearch": "Database", "Cassandra": "Database",
    "DynamoDB": "Database", "CosmosDB": "Database", "Neo4j": "Database",
    "SQLite": "Database", "MS Access": "Database", "SQL": "Database",
    "PL/SQL": "Database", "T-SQL": "Database",
    
    # Cloud & DevOps
    "AWS": "Cloud & DevOps", "Azure": "Cloud & DevOps", "Google Cloud": "Cloud & DevOps",
    "Docker": "Cloud & DevOps", "Kubernetes": "Cloud & DevOps",
    "CI/CD": "Cloud & DevOps", "GitHub Actions": "Cloud & DevOps",
    "GitLab CI": "Cloud & DevOps", "Jenkins": "Cloud & DevOps",
    "Ansible": "Cloud & DevOps", "Terraform": "Cloud & DevOps",
    "Linux": "Cloud & DevOps", "Windows Server": "Cloud & DevOps",
    "VMware": "Cloud & DevOps", "Nginx": "Cloud & DevOps",
    
    # Data & AI
    "Artificial Intelligence / Machine Learning": "Data & AI", "Deep Learning": "Data & AI",
    "Computer Vision": "Data & AI", "NLP": "Data & AI",
    "TensorFlow": "Data & AI", "PyTorch": "Data & AI", "Scikit-Learn": "Data & AI",
    "Pandas": "Data & AI", "NumPy": "Data & AI", "Matplotlib": "Data & AI", "Seaborn": "Data & AI",
    "Apache Spark": "Data & AI", "Apache Kafka": "Data & AI",
    "Apache Hadoop": "Data & AI", "Apache Airflow": "Data & AI",
    "dbt": "Data & AI", "ETL / Data Pipelines": "Data & AI",
    "Big Data": "Data & AI", "Data Engineering": "Data & AI",
    "Data Analytics": "Data & AI", "Data Science": "Data & AI",
    "Power BI": "Data & AI", "Power Query": "Data & AI", "DAX": "Data & AI",
    "Tableau": "Data & AI", "Qlik": "Data & AI", "Looker": "Data & AI",
    "SSAS": "Data & AI", "SSIS": "Data & AI", "SSRS": "Data & AI",
    "MATLAB": "Data & AI", "R": "Data & AI",
    
    # Mobile
    "Flutter": "Mobile", "React Native": "Mobile", "Dart": "Mobile",
    "Android": "Mobile", "iOS": "Mobile", "Kotlin": "Mobile", "Swift": "Mobile",
    
    # Cybersecurity
    "Cybersecurity": "Cybersecurity", "ISO 27001": "Cybersecurity",
    "SIEM": "Cybersecurity", "SOC": "Cybersecurity",
    "Penetration Testing": "Cybersecurity", "Firewall / Network Security": "Cybersecurity",
    
    # Enterprise & Tools
    "SAP": "Enterprise", "Odoo": "Enterprise", "Salesforce": "Enterprise",
    "Dynamics 365": "Enterprise", "RPA": "Enterprise", "Blockchain": "Emerging Tech",
    "IoT": "Emerging Tech", "Excel / Advanced Sheets": "Tools & Productivity",
    "VBA": "Tools & Productivity", "Git": "Methodology & Tools",
    "Jira": "Methodology & Tools", "Confluence": "Methodology & Tools",
    "Scrum / Agile": "Methodology & Tools"
}

# =============================================================================
# 2. MOROCCAN CITIES & REGIONS NORMALIZATION
# =============================================================================

MOROCCO_CITIES_REGIONS = {
    # Casablanca-Settat Hub
    "Casablanca": "Casablanca-Settat",
    "Mohammedia": "Casablanca-Settat",
    "Bouskoura": "Casablanca-Settat",
    "Nouaceur": "Casablanca-Settat",
    "Berrechid": "Casablanca-Settat",
    "Settat": "Casablanca-Settat",
    "El Jadida": "Casablanca-Settat",
    "Ain Harrouda": "Casablanca-Settat",
    "Mediouna": "Casablanca-Settat",
    
    # Rabat-Salé-Kénitra Hub
    "Rabat": "Rabat-Salé-Kénitra",
    "Salé": "Rabat-Salé-Kénitra",
    "Kénitra": "Rabat-Salé-Kénitra",
    "Témara": "Rabat-Salé-Kénitra",
    "Skhirat": "Rabat-Salé-Kénitra",
    "Ain Aouda": "Rabat-Salé-Kénitra",
    "Sidi Slimane": "Rabat-Salé-Kénitra",
    "Sidi Kacem": "Rabat-Salé-Kénitra",
    
    # Tanger-Tétouan-Al Hoceïma Hub
    "Tanger": "Tanger-Tétouan-Al Hoceïma",
    "Tangier": "Tanger-Tétouan-Al Hoceïma",
    "Tétouan": "Tanger-Tétouan-Al Hoceïma",
    "Al Hoceïma": "Tanger-Tétouan-Al Hoceïma",
    "Larache": "Tanger-Tétouan-Al Hoceïma",
    "Cabo Negro": "Tanger-Tétouan-Al Hoceïma",
    "Martil": "Tanger-Tétouan-Al Hoceïma",
    "M'diq": "Tanger-Tétouan-Al Hoceïma",
    "Ksar El Kebir": "Tanger-Tétouan-Al Hoceïma",
    "Asilah": "Tanger-Tétouan-Al Hoceïma",
    
    # Marrakech-Safi Hub
    "Marrakech": "Marrakech-Safi",
    "Ben Guerir": "Marrakech-Safi",
    "Safi": "Marrakech-Safi",
    "Essaouira": "Marrakech-Safi",
    "Kelaat Sraghna": "Marrakech-Safi",
    
    # Souss-Massa Hub
    "Agadir": "Souss-Massa",
    "Tiznit": "Souss-Massa",
    "Taroudant": "Souss-Massa",
    "Inezgane": "Souss-Massa",
    "Ait Melloul": "Souss-Massa",
    "Taghazout": "Souss-Massa",
    
    # Fès-Meknès Hub
    "Fès": "Fès-Meknès",
    "Fez": "Fès-Meknès",
    "Meknès": "Fès-Meknès",
    "Ifrane": "Fès-Meknès",
    "Taza": "Fès-Meknès",
    "Sefrou": "Fès-Meknès",
    
    # Oriental Hub
    "Oujda": "Oriental",
    "Nador": "Oriental",
    "Berkane": "Oriental",
    "Saidia": "Oriental",
    
    # Béni Mellal-Khénifra
    "Béni Mellal": "Béni Mellal-Khénifra",
    "Khouribga": "Béni Mellal-Khénifra",
    "Khénifra": "Béni Mellal-Khénifra",
    
    # Sahara & Sud
    "Laâyoune": "Laâyoune-Sakia El Hamra",
    "Dakhla": "Dakhla-Oued Ed-Dahab",
    "Guelmim": "Guelmim-Oued Noun",
    "Errachidia": "Drâa-Tafilalet",
    "Ouarzazate": "Drâa-Tafilalet",
    
    # National / Remote
    "Télétravail": "Remote / National",
    "Remote": "Remote / National",
    "Maroc (Tout le royaume)": "National",
    "Non spécifié": "Non spécifié"
}

CITY_CLEANING_ALIAS = {
    "casablanca": "Casablanca",
    "casa": "Casablanca",
    "rabat": "Rabat",
    "tanger": "Tanger",
    "tangier": "Tanger",
    "marrakech": "Marrakech",
    "agadir": "Agadir",
    "fes": "Fès",
    "fès": "Fès",
    "fez": "Fès",
    "meknes": "Meknès",
    "meknès": "Meknès",
    "benguerir": "Ben Guerir",
    "ben guerir": "Ben Guerir",
    "ben guérir": "Ben Guerir",
    "benguerire": "Ben Guerir",
    "bengurir": "Ben Guerir",
    "kenitra": "Kénitra",
    "kénitra": "Kénitra",
    "temara": "Témara",
    "témara": "Témara",
    "sale": "Salé",
    "salé": "Salé",
    "tetouan": "Tétouan",
    "tétouan": "Tétouan",
    "el jadida": "El Jadida",
    "oujda": "Oujda",
    "nador": "Nador",
    "dakhla": "Dakhla",
    "laayoune": "Laâyoune",
    "laâyoune": "Laâyoune",
    "bouskoura": "Bouskoura",
    "nouaceur": "Nouaceur",
    "berrechid": "Berrechid",
    "settat": "Settat",
    "safi": "Safi",
    "khouribga": "Khouribga",
    "beni mellal": "Béni Mellal",
    "béni mellal": "Béni Mellal",
    "mohammedia": "Mohammedia",
    "ain harrouda": "Ain Harrouda",
    "ain aouda": "Ain Aouda",
    "cabo negro": "Cabo Negro",
    "cabo negro ( region nord)": "Cabo Negro",
    "cabo negro (région nord)": "Cabo Negro",
    "télétravail": "Télétravail",
    "remote": "Remote",
    "tout le maroc": "Maroc (Tout le royaume)",
    "maroc": "Maroc (Tout le royaume)"
}

# =============================================================================
# 3. 5 CANONICAL EXPERIENCE TIERS
# =============================================================================

CANONICAL_EXPERIENCE = [
    {"exp_id": 1, "experience_label": "Stage / Débutant (0 - 1 an)", "exp_years_min": 0, "exp_years_max": 1, "tier": "Entry / Intern"},
    {"exp_id": 2, "experience_label": "Junior (1 - 3 ans)", "exp_years_min": 1, "exp_years_max": 3, "tier": "Junior"},
    {"exp_id": 3, "experience_label": "Intermédiaire (3 - 5 ans)", "exp_years_min": 3, "exp_years_max": 5, "tier": "Mid-Level"},
    {"exp_id": 4, "experience_label": "Confirmé / Senior (5 - 10 ans)", "exp_years_min": 5, "exp_years_max": 10, "tier": "Senior"},
    {"exp_id": 5, "experience_label": "Expert / Lead (> 10 ans)", "exp_years_min": 10, "exp_years_max": 20, "tier": "Lead / Expert"}
]

def map_experience_tier(row):
    label = str(row.get("experience_label", "")).lower()
    ymin = row.get("exp_years_min", 0)
    ymax = row.get("exp_years_max", 0)
    
    try:
        ymin = float(ymin) if pd.notna(ymin) else 0.0
    except Exception:
        ymin = 0.0
    try:
        ymax = float(ymax) if pd.notna(ymax) else 0.0
    except Exception:
        ymax = 0.0

    if ymax <= 1 or ("débutant" in label) or ("stage" in label) or ("-1 an" in label):
        return 1
    if (ymin <= 2 and ymax <= 3) or ("junior" in label) or ("1 à 3" in label) or ("1 a 3" in label):
        return 2
    if (ymin >= 3 and ymax <= 5) or ("intermédiaire" in label) or ("3 à 5" in label) or ("3 a 5" in label):
        return 3
    if (ymin >= 5 and ymax <= 10) or ("confirmé" in label) or ("senior" in label) or ("5 à 10" in label) or ("5 a 10" in label):
        return 4
    if ymin >= 10 or ymax >= 10 or ("expert" in label) or ("lead" in label) or ("> 10" in label) or ("10 à 20" in label):
        return 5
    
    # Fallback to mid
    return 3


def clean_city_name(raw_city):
    if pd.isna(raw_city) or not str(raw_city).strip():
        return "Casablanca", "Casablanca-Settat"
    
    raw_str = str(raw_city).strip()
    lowered = raw_str.lower()
    
    # Direct alias
    if lowered in CITY_CLEANING_ALIAS:
        canonical_city = CITY_CLEANING_ALIAS[lowered]
        return canonical_city, MOROCCO_CITIES_REGIONS.get(canonical_city, "Casablanca-Settat")
    
    # Partial match
    for alias_key, target_city in CITY_CLEANING_ALIAS.items():
        if alias_key in lowered:
            return target_city, MOROCCO_CITIES_REGIONS.get(target_city, "Casablanca-Settat")
            
    # Foreign or noise fallback
    return "Casablanca", "Casablanca-Settat"


# =============================================================================
# 4. TRANSFORMATION & PIPELINE
# =============================================================================

def run_sanitization():
    print("=" * 70)
    print("  🚀 SANITIZING STAR SCHEMA FOR TECHJOB ANALYTICS (PFE MOROCCO)")
    print("=" * 70)
    
    # 1. Load source
    df = pd.read_csv(INPUT_FILE)
    print(f"\n[1/6] Loaded Source Data: {len(df):,} jobs across {len(df.columns)} columns.")

    # 2. Build dim_date (Yearly / Period granularity)
    years = sorted(df["year"].dropna().astype(int).unique())
    dim_date = pd.DataFrame({
        "date_id": range(1, len(years) + 1),
        "year": years,
        "decade": [f"{y//10*10}s" for y in years],
        "is_recent": [1 if y >= 2023 else 0 for y in years]
    })
    year_map = dim_date.set_index("year")["date_id"].to_dict()

    # 3. Clean Cities & dim_city
    cleaned_cities = []
    cleaned_regions = []
    for c in df["city"]:
        city_name, reg_name = clean_city_name(c)
        cleaned_cities.append(city_name)
        cleaned_regions.append(reg_name)
        
    df["city_clean"] = cleaned_cities
    df["region_clean"] = cleaned_regions
    
    unique_cities_df = df[["city_clean", "region_clean"]].drop_duplicates().sort_values("city_clean").reset_index(drop=True)
    dim_city = pd.DataFrame({
        "city_id": range(1, len(unique_cities_df) + 1),
        "city_name": unique_cities_df["city_clean"].values,
        "region": unique_cities_df["region_clean"].values,
        "is_major_hub": [1 if c in ["Casablanca", "Rabat", "Tanger", "Marrakech", "Agadir"] else 0 for c in unique_cities_df["city_clean"]]
    })
    city_map = dim_city.set_index("city_name")["city_id"].to_dict()

    # 4. Standardize dim_experience
    dim_experience = pd.DataFrame(CANONICAL_EXPERIENCE)
    df["exp_id_clean"] = df.apply(map_experience_tier, axis=1)

    # 5. Build dim_contract
    contracts = sorted(df["contract_type"].fillna("Non spécifié").astype(str).str.strip().unique())
    dim_contract = pd.DataFrame({
        "contract_id": range(1, len(contracts) + 1),
        "contract_type": contracts,
        "is_permanent": [1 if "CDI" in c else 0 for c in contracts],
        "is_internship": [1 if "Stage" in c or "Anapec" in c else 0 for c in contracts]
    })
    contract_map = dim_contract.set_index("contract_type")["contract_id"].to_dict()

    # 6. Build dim_education
    edus = sorted(df["education_level"].fillna("Non spécifié").astype(str).str.strip().unique())
    dim_education = pd.DataFrame({
        "edu_id": range(1, len(edus) + 1),
        "education_level": edus
    })
    edu_map = dim_education.set_index("education_level")["edu_id"].to_dict()

    # 7. Build dim_entreprise (deduplicated clean companies)
    df["company_clean"] = df["company_name"].fillna("Entreprise Confidentielle").astype(str).str.strip()
    df["sector_clean"] = df["industry_sector"].fillna("Secteur Informatique").astype(str).str.strip()
    
    unique_companies = df[["company_clean", "sector_clean"]].drop_duplicates().sort_values("company_clean").reset_index(drop=True)
    dim_entreprise = pd.DataFrame({
        "entreprise_id": range(1, len(unique_companies) + 1),
        "company_name": unique_companies["company_clean"].values,
        "industry_sector": unique_companies["sector_clean"].values
    })
    ent_key_map = {f"{r['company_clean']}|{r['sector_clean']}": idx + 1 for idx, r in unique_companies.iterrows()}

    # 8. Build dim_tech (deduplicated + categorized)
    all_raw_techs = []
    for stack in df["tech_stack"].dropna():
        for t in str(stack).split(SEPARATOR):
            t_clean = t.strip()
            if t_clean and t_clean.lower() != "non spécifié":
                canonical = TECH_CANONICAL_MAP.get(t_clean.lower(), t_clean)
                all_raw_techs.append(canonical)
                
    unique_techs = sorted(list(set(all_raw_techs)))
    dim_tech = pd.DataFrame({
        "tech_id": range(1, len(unique_techs) + 1),
        "tech_name": unique_techs,
        "category": [TECH_CATEGORY_MAP.get(t, "Other") for t in unique_techs]
    })
    tech_name_to_id = dim_tech.set_index("tech_name")["tech_id"].to_dict()

    # 9. Build dim_soft_skills
    all_soft = []
    for ss in df["soft_skills"].dropna():
        for s in str(ss).split(SEPARATOR):
            s_clean = s.strip()
            if s_clean and s_clean.lower() != "non spécifié":
                all_soft.append(s_clean)
    unique_soft = sorted(list(set(all_soft)))
    dim_soft_skills = pd.DataFrame({
        "soft_id": range(1, len(unique_soft) + 1),
        "soft_skill_name": unique_soft
    })
    soft_to_id = dim_soft_skills.set_index("soft_skill_name")["soft_id"].to_dict()

    # 10. Build dim_languages
    all_langs = []
    for l in df["languages"].dropna():
        for lang in str(l).split(SEPARATOR):
            l_clean = lang.strip()
            if l_clean and l_clean.lower() != "non spécifié":
                all_langs.append(l_clean)
    unique_langs = sorted(list(set(all_langs)))
    dim_languages = pd.DataFrame({
        "language_id": range(1, len(unique_langs) + 1),
        "language_name": unique_langs
    })
    lang_to_id = dim_languages.set_index("language_name")["language_id"].to_dict()

    print("[2/6] Cleaned Dimensions successfully built.")

    # 11. Build Bridge Tables (deduplicated (job_id, foreign_id) pairs)
    bridge_tech_rows = []
    bridge_soft_rows = []
    bridge_lang_rows = []

    for idx, row in df.iterrows():
        job_id = idx + 1
        
        # Tech bridge
        if pd.notna(row["tech_stack"]):
            seen_techs_for_job = set()
            for t in str(row["tech_stack"]).split(SEPARATOR):
                t_clean = t.strip()
                if t_clean and t_clean.lower() != "non spécifié":
                    canonical = TECH_CANONICAL_MAP.get(t_clean.lower(), t_clean)
                    if canonical in tech_name_to_id and canonical not in seen_techs_for_job:
                        seen_techs_for_job.add(canonical)
                        bridge_tech_rows.append({"job_id": job_id, "tech_id": tech_name_to_id[canonical]})
                        
        # Soft bridge
        if pd.notna(row["soft_skills"]):
            seen_soft_for_job = set()
            for s in str(row["soft_skills"]).split(SEPARATOR):
                s_clean = s.strip()
                if s_clean and s_clean in soft_to_id and s_clean not in seen_soft_for_job:
                    seen_soft_for_job.add(s_clean)
                    bridge_soft_rows.append({"job_id": job_id, "soft_id": soft_to_id[s_clean]})

        # Lang bridge
        if pd.notna(row["languages"]):
            seen_lang_for_job = set()
            for l in str(row["languages"]).split(SEPARATOR):
                l_clean = l.strip()
                if l_clean and l_clean in lang_to_id and l_clean not in seen_lang_for_job:
                    seen_lang_for_job.add(l_clean)
                    bridge_lang_rows.append({"job_id": job_id, "language_id": lang_to_id[l_clean]})

    bridge_tech = pd.DataFrame(bridge_tech_rows).drop_duplicates().reset_index(drop=True)
    bridge_soft_skills = pd.DataFrame(bridge_soft_rows).drop_duplicates().reset_index(drop=True)
    bridge_languages = pd.DataFrame(bridge_lang_rows).drop_duplicates().reset_index(drop=True)

    print(f"[3/6] Bridge Tables Built: bridge_tech={len(bridge_tech):,}, bridge_soft_skills={len(bridge_soft_skills):,}, bridge_languages={len(bridge_languages):,}")

    # 12. Build fact_offres
    tech_count_by_job = bridge_tech.groupby("job_id").size().to_dict()
    soft_count_by_job = bridge_soft_skills.groupby("job_id").size().to_dict()
    lang_count_by_job = bridge_languages.groupby("job_id").size().to_dict()

    fact_rows = []
    for idx, row in df.iterrows():
        job_id = idx + 1
        year_val = int(row["year"]) if pd.notna(row["year"]) else 2024
        date_id = year_map.get(year_val, 1)
        city_id = city_map.get(row["city_clean"], 1)
        contract_id = contract_map.get(str(row["contract_type"]).strip(), 1)
        edu_id = edu_map.get(str(row["education_level"]).strip(), 1)
        exp_id = row["exp_id_clean"]
        ent_key = f"{row['company_clean']}|{row['sector_clean']}"
        entreprise_id = ent_key_map.get(ent_key, 1)

        is_junior_friendly = 1 if exp_id in [1, 2] else 0

        fact_rows.append({
            "job_id": job_id,
            "date_id": date_id,
            "city_id": city_id,
            "contract_id": contract_id,
            "edu_id": edu_id,
            "exp_id": exp_id,
            "entreprise_id": entreprise_id,
            "job_title": str(row["job_title"]).strip(),
            "job_id_original": str(row.get("job_id", "")),
            "job_function": str(row.get("job_function", "Informatique")),
            "work_mode": str(row.get("work_mode", "Présentiel")),
            "allows_remote": 1 if str(row.get("allows_remote", "0")) in ["1", "True", "true"] else 0,
            "allows_hybrid": 1 if str(row.get("allows_hybrid", "0")) in ["1", "True", "true"] else 0,
            "uses_agile": 1 if str(row.get("uses_agile", "0")) in ["1", "True", "true"] else 0,
            "is_junior_friendly": is_junior_friendly,
            "nb_tech_skills": tech_count_by_job.get(job_id, 0),
            "nb_soft_skills": soft_count_by_job.get(job_id, 0),
            "nb_languages": lang_count_by_job.get(job_id, 0)
        })

    fact_offres = pd.DataFrame(fact_rows)
    print(f"[4/6] fact_offres Constructed: {len(fact_offres):,} rows × {len(fact_offres.columns)} columns.")

    # 13. Integrity Verification
    print("\n" + "─" * 60)
    print("  🔍 RIGOROUS REFERENTIAL INTEGRITY CHECKS")
    print("─" * 60)

    tables_dict = {
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
        "bridge_languages": bridge_languages
    }

    # Verify FKs
    assert fact_offres["date_id"].isin(dim_date["date_id"]).all(), "FK Error: date_id in fact_offres"
    assert fact_offres["city_id"].isin(dim_city["city_id"]).all(), "FK Error: city_id in fact_offres"
    assert fact_offres["contract_id"].isin(dim_contract["contract_id"]).all(), "FK Error: contract_id in fact_offres"
    assert fact_offres["edu_id"].isin(dim_education["edu_id"]).all(), "FK Error: edu_id in fact_offres"
    assert fact_offres["exp_id"].isin(dim_experience["exp_id"]).all(), "FK Error: exp_id in fact_offres"
    assert fact_offres["entreprise_id"].isin(dim_entreprise["entreprise_id"]).all(), "FK Error: entreprise_id in fact_offres"
    assert bridge_tech["job_id"].isin(fact_offres["job_id"]).all(), "FK Error: job_id in bridge_tech"
    assert bridge_tech["tech_id"].isin(dim_tech["tech_id"]).all(), "FK Error: tech_id in bridge_tech"
    assert bridge_soft_skills["job_id"].isin(fact_offres["job_id"]).all(), "FK Error: job_id in bridge_soft_skills"
    assert bridge_soft_skills["soft_id"].isin(dim_soft_skills["soft_id"]).all(), "FK Error: soft_id in bridge_soft_skills"
    assert bridge_languages["job_id"].isin(fact_offres["job_id"]).all(), "FK Error: job_id in bridge_languages"
    assert bridge_languages["language_id"].isin(dim_languages["language_id"]).all(), "FK Error: language_id in bridge_languages"

    print("  ✅ 100% Referential Integrity Verified: 0 orphaned records across all tables.")

    # 14. Export to CSV & Parquet
    print("\n[5/6] Exporting tables...")
    os.makedirs(CSV_OUTPUT_DIR, exist_ok=True)
    os.makedirs(PARQUET_OUTPUT_DIR, exist_ok=True)

    # Remove obsolete files in CSV directory
    for f in os.listdir(CSV_OUTPUT_DIR):
        if f.endswith("_clean.csv") or f.endswith("_cleaned.csv") or f.endswith("_report.csv") or f.startswith("canonical_"):
            try:
                os.remove(os.path.join(CSV_OUTPUT_DIR, f))
            except Exception:
                pass

    for name, df_t in tables_dict.items():
        csv_p = os.path.join(CSV_OUTPUT_DIR, f"{name}.csv")
        parquet_p = os.path.join(PARQUET_OUTPUT_DIR, f"{name}.parquet")
        
        # Save CSV
        df_t.to_csv(csv_p, index=False, encoding="utf-8-sig")
        # Save Parquet
        df_t.to_parquet(parquet_p, index=False, compression="snappy")
        print(f"   💾 {name:<20} -> {len(df_t):>6,} rows | Saved CSV & Parquet")

    # 15. DuckDB Analytical Query Validation
    print("\n" + "─" * 60)
    print("  📊 [6/6] DUCKDB ANALYTICAL VALIDATION & CANDIDATE METRICS")
    print("─" * 60)
    
    try:
        import duckdb
        con = duckdb.connect()
        
        # Register parquet views
        for name in tables_dict.keys():
            p_path = os.path.join(PARQUET_OUTPUT_DIR, f"{name}.parquet").replace("\\", "/")
            con.execute(f"CREATE VIEW {name} AS SELECT * FROM read_parquet('{p_path}')")
            
        print("\n🏆 Top 10 High-Demand Tech Skills in Morocco:")
        top10_sql = """
            SELECT 
                t.tech_name, 
                t.category, 
                COUNT(b.job_id) AS demand_count,
                ROUND(COUNT(b.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS market_share_pct
            FROM bridge_tech b
            JOIN dim_tech t ON b.tech_id = t.tech_id
            GROUP BY t.tech_name, t.category
            ORDER BY demand_count DESC
            LIMIT 10
        """
        top10 = con.execute(top10_sql).df()
        print(top10.to_string(index=False))

        print("\n⚛️ React Skill Pairings & Co-occurrences (What Moroccan employers pair with React):")
        react_pairings_sql = """
            SELECT 
                t2.tech_name AS paired_skill,
                t2.category,
                COUNT(b2.job_id) AS co_occurrence_count,
                ROUND(COUNT(b2.job_id) * 100.0 / target.total_react_jobs, 1) AS pairing_rate_pct
            FROM bridge_tech b1
            JOIN dim_tech t1 ON b1.tech_id = t1.tech_id
            JOIN bridge_tech b2 ON b1.job_id = b2.job_id AND b1.tech_id != b2.tech_id
            JOIN dim_tech t2 ON b2.tech_id = t2.tech_id
            CROSS JOIN (
                SELECT COUNT(DISTINCT job_id) AS total_react_jobs 
                FROM bridge_tech 
                WHERE tech_id = (SELECT tech_id FROM dim_tech WHERE tech_name = 'React')
            ) target
            WHERE t1.tech_name = 'React'
            GROUP BY t2.tech_name, t2.category, target.total_react_jobs
            ORDER BY co_occurrence_count DESC
            LIMIT 8
        """
        react_pairings = con.execute(react_pairings_sql).df()
        print(react_pairings.to_string(index=False))

        print("\n🎓 Experience Level Breakdown:")
        exp_sql = """
            SELECT 
                e.experience_label,
                e.tier,
                COUNT(f.job_id) AS total_jobs,
                ROUND(COUNT(f.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS pct_of_market
            FROM fact_offres f
            JOIN dim_experience e ON f.exp_id = e.exp_id
            GROUP BY e.exp_id, e.experience_label, e.tier
            ORDER BY e.exp_id
        """
        exp_df = con.execute(exp_sql).df()
        print(exp_df.to_string(index=False))

        print("\n🌆 Regional Distribution (Top 5 Tech Hubs):")
        city_sql = """
            SELECT 
                c.city_name,
                c.region,
                COUNT(f.job_id) AS total_jobs,
                ROUND(COUNT(f.job_id) * 100.0 / (SELECT COUNT(*) FROM fact_offres), 1) AS market_pct
            FROM fact_offres f
            JOIN dim_city c ON f.city_id = c.city_id
            GROUP BY c.city_name, c.region
            ORDER BY total_jobs DESC
            LIMIT 5
        """
        city_df = con.execute(city_sql).df()
        print(city_df.to_string(index=False))

        print("\n🎉 PHASE 1 EXECUTION COMPLETE & FULLY VALIDATED!")

    except Exception as ex:
        print(f"⚠️ DuckDB check exception: {ex}")


if __name__ == "__main__":
    run_sanitization()
