-- ============================================================
-- crop_progress database — Neon PostgreSQL
-- ============================================================

-- Neon uses UTC by default, no need to set time_zone
-- SSL is handled by Neon automatically
-- No need for SET SQL_MODE or charset directives

-- --------------------------------------------------------
-- ENUM Types (must be created before tables in PostgreSQL)
-- --------------------------------------------------------

-- CREATE TYPE computed_status_enum AS ENUM ('Active', 'At Risk', 'Completed');
-- CREATE TYPE current_stage_enum   AS ENUM ('Planted', 'Growing', 'Ready', 'Harvested');

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    user_id      SERIAL PRIMARY KEY,
    username     VARCHAR(255) UNIQUE,
    email        VARCHAR(255) UNIQUE,
    password     VARCHAR(255),
    users_role   VARCHAR(255),
    phone_number BIGINT UNIQUE  -- changed from INT: phone numbers exceed INT range
);

-- --------------------------------------------------------
-- Table: field_management
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS field_management (
    field_id           SERIAL PRIMARY KEY,
    field_name         VARCHAR(255),
    field_location     VARCHAR(255),
    crop_type          VARCHAR(255),
    planting_date      TIMESTAMP,
    insights           TEXT,                             -- upgraded from VARCHAR(255): insights can be long
    status_description VARCHAR(255),
    user_id            INT REFERENCES users(user_id) ON DELETE CASCADE,
    harvesting_date    TIMESTAMP,
    last_updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    computed_status    computed_status_enum DEFAULT 'Active',
    current_stage      current_stage_enum   DEFAULT 'Planted'
);

-- Auto-update last_updated_at on row change (replaces MariaDB's ON UPDATE CURRENT_TIMESTAMP)
CREATE OR REPLACE FUNCTION update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_field_management_updated
BEFORE UPDATE ON field_management
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_at();

-- --------------------------------------------------------
-- Seed Data
-- --------------------------------------------------------

INSERT INTO users (user_id, username, email, password, users_role, phone_number)
VALUES (1, 'Chris Leo', 'chris@gmail.com', '$2b$12$ThumnTEAF8DHVTUH3JI0YOrrO7xjdI7OpvhjbSR14sqJENoodIA0y', 'admin', 123456789)
ON CONFLICT DO NOTHING;

INSERT INTO field_management (
    field_id, field_name, field_location, crop_type, planting_date,
    insights, status_description, user_id, harvesting_date,
    last_updated_at, computed_status, current_stage
) VALUES (
    1, 'Lower Farm Block A', 'Nairobi North', 'Maize', '2026-03-01 00:00:00',
    'Harvesting complete, yield was above average.',
    'Initial planting successful',
    1, '2026-04-15 00:00:00', '2026-04-19 14:29:36',
    'Completed', 'Harvested'
)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------
-- Sync sequences after manual ID inserts
-- --------------------------------------------------------

SELECT setval('users_user_id_seq',             (SELECT MAX(user_id)  FROM users));
SELECT setval('field_management_field_id_seq', (SELECT MAX(field_id) FROM field_management));