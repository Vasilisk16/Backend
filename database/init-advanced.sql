-- database/init-advanced.sql
-- Views, functions, triggers и seed — только для пояснительной записки / локальной БД.
-- НЕ запускать на Aiven free: приложение использует TypeORM synchronize + админку.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP VIEW IF EXISTS landmark_detail_view CASCADE;
DROP VIEW IF EXISTS landmark_card_view CASCADE;
DROP TABLE IF EXISTS landmark_audit_log CASCADE;

CREATE TABLE IF NOT EXISTS landmark_audit_log (
    id SERIAL PRIMARY KEY,
    landmark_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE VIEW landmark_card_view AS
SELECT
    l.id,
    l.title,
    l.year_of_construction,
    l.short_description,
    l.image_url,
    e.name AS era_name,
    s.name AS style_name,
    p.name AS purpose_name,
    ls.name AS legal_status_name,
    COALESCE(
        ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.id IS NOT NULL),
        ARRAY[]::VARCHAR[]
    ) AS category_names
FROM landmarks l
JOIN eras e ON e.id = l.era_id
JOIN styles s ON s.id = l.style_id
JOIN purposes p ON p.id = l.purpose_id
JOIN legal_statuses ls ON ls.id = l.legal_status_id
LEFT JOIN landmark_categories lc ON lc.landmark_id = l.id
LEFT JOIN categories c ON c.id = lc.category_id
GROUP BY
    l.id,
    l.title,
    l.year_of_construction,
    l.short_description,
    l.image_url,
    e.name,
    s.name,
    p.name,
    ls.name;

CREATE OR REPLACE VIEW landmark_detail_view AS
SELECT
    l.id,
    l.title,
    l.subtitle,
    l.short_description,
    l.full_description,
    l.year_of_construction,
    l.address,
    l.image_url,
    e.name AS era_name,
    s.name AS style_name,
    a.name AS architect_name,
    p.name AS purpose_name,
    ls.name AS legal_status_name,
    COALESCE(
        ARRAY_AGG(c.name ORDER BY c.name) FILTER (WHERE c.id IS NOT NULL),
        ARRAY[]::VARCHAR[]
    ) AS category_names,
    l.created_at,
    l.updated_at
FROM landmarks l
JOIN eras e ON e.id = l.era_id
JOIN styles s ON s.id = l.style_id
LEFT JOIN architects a ON a.id = l.architect_id
JOIN purposes p ON p.id = l.purpose_id
JOIN legal_statuses ls ON ls.id = l.legal_status_id
LEFT JOIN landmark_categories lc ON lc.landmark_id = l.id
LEFT JOIN categories c ON c.id = lc.category_id
GROUP BY
    l.id,
    l.title,
    l.subtitle,
    l.short_description,
    l.full_description,
    l.year_of_construction,
    l.address,
    l.image_url,
    e.name,
    s.name,
    a.name,
    p.name,
    ls.name,
    l.created_at,
    l.updated_at;

CREATE OR REPLACE FUNCTION get_landmarks_by_era(p_era_id INTEGER)
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    year_of_construction VARCHAR,
    short_description TEXT,
    era_name VARCHAR
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        l.id,
        l.title,
        l.year_of_construction,
        l.short_description,
        e.name
    FROM landmarks l
    JOIN eras e ON e.id = l.era_id
    WHERE l.era_id = p_era_id
    ORDER BY l.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION count_landmarks_by_category()
RETURNS TABLE (
    category_id INTEGER,
    category_name VARCHAR,
    landmarks_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        c.id,
        c.name,
        COUNT(lc.landmark_id)
    FROM categories c
    LEFT JOIN landmark_categories lc ON lc.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY c.name;
$$;

CREATE OR REPLACE FUNCTION trg_set_landmark_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_landmark_updated_at ON landmarks;
CREATE TRIGGER trg_landmark_updated_at
BEFORE UPDATE ON landmarks
FOR EACH ROW
EXECUTE FUNCTION trg_set_landmark_updated_at();

CREATE OR REPLACE FUNCTION trg_log_landmark_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO landmark_audit_log (landmark_id, action)
    VALUES (NEW.id, TG_OP);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_landmark_audit ON landmarks;
CREATE TRIGGER trg_landmark_audit
AFTER INSERT OR UPDATE ON landmarks
FOR EACH ROW
EXECUTE FUNCTION trg_log_landmark_changes();
