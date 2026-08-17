-- ============================================================================
-- SUPABASE SCHEMA EXTRACTION SCRIPT
-- Target: 'public' schema — TechJob Analytics SaaS (Morocco)
-- Run in: Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- ============================================================================
-- This script produces 4 result sets. Run them one at a time or all at once.
-- Each query is self-contained and labelled.
-- ============================================================================


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  QUERY 1 — TABLE INVENTORY + ROW COUNTS + DESCRIPTIONS                ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Returns: table_name | estimated_rows | table_description

SELECT
    t.table_name,
    COALESCE(s.n_live_tup, 0)                      AS estimated_rows,
    COALESCE(obj_description(
        (quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass
    ), '—')                                         AS table_description
FROM information_schema.tables        t
LEFT JOIN pg_stat_user_tables         s
       ON s.schemaname = t.table_schema
      AND s.relname    = t.table_name
WHERE t.table_schema = 'public'
  AND t.table_type   = 'BASE TABLE'
ORDER BY t.table_name;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  QUERY 2 — FULL COLUMN MAP (types, nullability, defaults, keys)       ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Returns: table_name | column_name | ordinal | data_type | is_nullable
--          | column_default | is_primary_key | is_foreign_key

SELECT
    c.table_name,
    c.column_name,
    c.ordinal_position                              AS ordinal,
    -- Produce a human-readable type (e.g. "varchar(100)", "integer", "text[]")
    CASE
        WHEN c.data_type = 'USER-DEFINED'   THEN c.udt_name
        WHEN c.data_type = 'ARRAY'          THEN c.udt_name
        WHEN c.character_maximum_length IS NOT NULL
            THEN c.data_type || '(' || c.character_maximum_length || ')'
        WHEN c.numeric_precision IS NOT NULL AND c.data_type = 'numeric'
            THEN 'numeric(' || c.numeric_precision || ',' || COALESCE(c.numeric_scale,0) || ')'
        ELSE c.data_type
    END                                             AS data_type,
    c.is_nullable,
    COALESCE(c.column_default, '—')                 AS column_default,

    -- PK flag -----------------------------------------------------------
    CASE WHEN pk.column_name IS NOT NULL
         THEN 'PK' ELSE '' END                     AS is_primary_key,

    -- FK flag -----------------------------------------------------------
    CASE WHEN fk.column_name IS NOT NULL
         THEN 'FK' ELSE '' END                     AS is_foreign_key

FROM information_schema.columns c

-- ── Join: Primary Key columns ──
LEFT JOIN (
    SELECT kcu.table_schema, kcu.table_name, kcu.column_name
    FROM   information_schema.table_constraints  tc
    JOIN   information_schema.key_column_usage    kcu
      ON   tc.constraint_name   = kcu.constraint_name
     AND   tc.constraint_schema = kcu.constraint_schema
    WHERE  tc.constraint_type   = 'PRIMARY KEY'
      AND  tc.table_schema      = 'public'
) pk
  ON  pk.table_schema = c.table_schema
 AND  pk.table_name   = c.table_name
 AND  pk.column_name  = c.column_name

-- ── Join: Foreign Key columns (de-duped) ──
LEFT JOIN (
    SELECT DISTINCT kcu.table_schema, kcu.table_name, kcu.column_name
    FROM   information_schema.table_constraints  tc
    JOIN   information_schema.key_column_usage    kcu
      ON   tc.constraint_name   = kcu.constraint_name
     AND   tc.constraint_schema = kcu.constraint_schema
    WHERE  tc.constraint_type   = 'FOREIGN KEY'
      AND  tc.table_schema      = 'public'
) fk
  ON  fk.table_schema = c.table_schema
 AND  fk.table_name   = c.table_name
 AND  fk.column_name  = c.column_name

WHERE c.table_schema = 'public'
ORDER BY c.table_name, c.ordinal_position;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  QUERY 3 — ALL CONSTRAINTS (PK, FK, UNIQUE, CHECK)                    ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Returns: table_name | constraint_name | constraint_type | columns

SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    STRING_AGG(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
FROM information_schema.table_constraints     tc
JOIN information_schema.key_column_usage      kcu
  ON  tc.constraint_name   = kcu.constraint_name
 AND  tc.constraint_schema = kcu.constraint_schema
WHERE tc.table_schema = 'public'
  AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'CHECK')
GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  QUERY 4 — FOREIGN KEY RELATIONSHIP MAP                               ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Returns: fk_name | source_table | source_column
--          → target_table | target_column | update_rule | delete_rule
--
-- This is the query your AI agent needs to auto-generate
-- FastAPI relationship models and JOIN logic.

SELECT
    tc.constraint_name                              AS fk_name,
    kcu.table_name                                  AS source_table,
    kcu.column_name                                 AS source_column,
    ccu.table_name                                  AS target_table,
    ccu.column_name                                 AS target_column,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints           tc
JOIN information_schema.key_column_usage             kcu
  ON  tc.constraint_name   = kcu.constraint_name
 AND  tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage      ccu
  ON  tc.constraint_name   = ccu.constraint_name
 AND  tc.constraint_schema = ccu.constraint_schema
JOIN information_schema.referential_constraints      rc
  ON  tc.constraint_name   = rc.constraint_name
 AND  tc.constraint_schema = rc.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema    = 'public'
ORDER BY kcu.table_name, kcu.column_name;


-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  QUERY 5 (BONUS) — INDEXES                                            ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- Returns: table_name | index_name | index_definition | is_unique

SELECT
    t.relname                                       AS table_name,
    i.relname                                       AS index_name,
    pg_get_indexdef(ix.indexrelid)                   AS index_definition,
    ix.indisunique                                  AS is_unique
FROM pg_index       ix
JOIN pg_class       t   ON t.oid  = ix.indrelid
JOIN pg_class       i   ON i.oid  = ix.indexrelid
JOIN pg_namespace   n   ON n.oid  = t.relnamespace
WHERE n.nspname = 'public'
ORDER BY t.relname, i.relname;
