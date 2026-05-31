-- database/init.sql
-- Только таблицы (без views/functions/triggers).
-- Запуск: npm run db:setup  или вручную в Aiven SQL console.
-- Приложение НЕ выполняет этот файл — только подключается к уже созданным таблицам.

DROP TABLE IF EXISTS landmark_categories CASCADE;
DROP TABLE IF EXISTS landmarks CASCADE;
DROP TABLE IF EXISTS legal_statuses CASCADE;
DROP TABLE IF EXISTS purposes CASCADE;
DROP TABLE IF EXISTS architects CASCADE;
DROP TABLE IF EXISTS styles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS eras CASCADE;

CREATE TABLE eras (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE styles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE architects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE purposes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE legal_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE landmarks (
    slug VARCHAR(150) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    year_of_construction VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    era_id INTEGER NOT NULL REFERENCES eras(id),
    style_id INTEGER NOT NULL REFERENCES styles(id),
    architect_id INTEGER REFERENCES architects(id),
    purpose_id INTEGER NOT NULL REFERENCES purposes(id),
    legal_status_id INTEGER NOT NULL REFERENCES legal_statuses(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE landmark_categories (
    landmark_id VARCHAR(150) NOT NULL REFERENCES landmarks(slug) ON DELETE CASCADE ON UPDATE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (landmark_id, category_id)
);
