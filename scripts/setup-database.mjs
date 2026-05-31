import fs from 'fs';
import path from 'path';
import pg from 'pg';

const envPath = path.join(process.cwd(), '.env');
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const caPath = path.join(process.cwd(), 'ca.pem');
const ssl =
  env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'true' && fs.existsSync(caPath)
    ? {
        ca: fs.readFileSync(caPath).toString(),
        rejectUnauthorized: true,
      }
    : { rejectUnauthorized: false };

const dropStatements = [
  'DROP TABLE IF EXISTS landmark_categories CASCADE',
  'DROP TABLE IF EXISTS landmarks CASCADE',
  'DROP TABLE IF EXISTS legal_statuses CASCADE',
  'DROP TABLE IF EXISTS purposes CASCADE',
  'DROP TABLE IF EXISTS architects CASCADE',
  'DROP TABLE IF EXISTS styles CASCADE',
  'DROP TABLE IF EXISTS categories CASCADE',
  'DROP TABLE IF EXISTS eras CASCADE',
];

const createStatements = [
  `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`,
  `CREATE TABLE eras (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE
  )`,
  `CREATE TABLE styles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
  )`,
  `CREATE TABLE architects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
  )`,
  `CREATE TABLE purposes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
  )`,
  `CREATE TABLE legal_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
  )`,
  `CREATE TABLE landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  )`,
  `CREATE TABLE landmark_categories (
    landmark_id UUID NOT NULL REFERENCES landmarks(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (landmark_id, category_id)
  )`,
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runStatement(statement) {
  const client = new pg.Client({
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    ssl,
    connectionTimeoutMillis: 30000,
  });

  await client.connect();
  try {
    await client.query(statement);
    console.log('OK:', statement.split('\n')[0]);
  } finally {
    await client.end();
  }
}

async function runWithRetry(statement) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await runStatement(statement);
      return;
    } catch (error) {
      lastError = error;
      console.warn(`Retry ${attempt}/3:`, error.message);
      await sleep(2000);
    }
  }

  throw lastError;
}

console.log('Dropping old tables...');
for (const statement of dropStatements) {
  await runWithRetry(statement);
  await sleep(300);
}

console.log('Creating tables...');
for (const statement of createStatements) {
  await runWithRetry(statement);
  await sleep(300);
}

console.log('Database setup completed (tables only, no views/functions/triggers)');

const seedStatements = [
  `INSERT INTO eras (name, sort_order) VALUES
    ('XVII век', 1), ('XVIII век', 2), ('XIX век', 3), ('XX век', 4)`,
  `INSERT INTO categories (name, slug) VALUES
    ('Деревянное зодчество', 'wooden'),
    ('Культовые', 'religious'),
    ('Гражданские', 'civil'),
    ('Торговля', 'trade')`,
  `INSERT INTO styles (name) VALUES
    ('Московское барокко'), ('Русское барокко'), ('Классицизм')`,
  `INSERT INTO architects (name) VALUES ('Г. Миндер')`,
  `INSERT INTO purposes (name) VALUES
    ('Музей'), ('Культовое'), ('Купеческое'), ('Торговля')`,
  `INSERT INTO legal_statuses (name) VALUES
    ('Федеральный ОКН'), ('Региональный ОКН')`,
  `INSERT INTO landmarks (
    id, title, subtitle, short_description, full_description,
    year_of_construction, address, image_url,
    era_id, style_id, architect_id, purpose_id, legal_status_id
  ) VALUES
    (
      'a1111111-1111-4111-8111-111111111111',
      'Гостиные дворы',
      'Бывшие Русский и Немецкий гостиные дворы',
      'Один из старейших торговых комплексов города на набережной Северной Двины.',
      'Гостиные дворы — уникальный памятник московского барокко XVII века, построенный по указу Петра I. Комплекс долгое время был центром торговли и купеческой жизни Архангельска. Сегодня здесь размещается музей, сохранивший атмосферу исторического торгового двора.',
      '1684 г.',
      'Набережная СД, 85',
      'https://placehold.co/800x600?text=Gostinye+Dvory',
      1, 1, 1, 1, 1
    ),
    (
      'b2222222-2222-4222-8222-222222222222',
      'Свято-Троицкий Антониево-Сийский монастырь',
      'Действующий монастырь',
      'Один из крупнейших монастырских комплексов Русского Севера XVIII века.',
      'Антониево-Сийский монастырь был основан в XVI веке и получил значительное каменное строительство в XVIII веке. Архитектурный ансамбль сочетает традиции русского барокко и монастырской планировки. Монастырь сохраняет культовое назначение и является важным духовным центром региона.',
      'XVIII в.',
      'Архангельская область, с. Холмогоры',
      'https://placehold.co/800x600?text=Antonievo-Siysky',
      2, 2, NULL, 2, 1
    ),
    (
      'c3333333-3333-4333-8333-333333333333',
      'Особняк Е.К. Плотниковой',
      'Гражданская архитектура XIX века',
      'Каменный особняк купеческой семьи в стиле классицизма.',
      'Особняк Е.К. Плотниковой отражает купеческую культуру Архангельска XIX века. Здание выполнено в строгих формах классицизма с характерной для города каменной кладкой. Памятник демонстрирует эволюцию городской застройки от торговых дворов к частным городским резиденциям.',
      'XIX в.',
      'г. Архангельск, ул. Садовая',
      'https://placehold.co/800x600?text=Plotnikova+Mansion',
      3, 3, NULL, 3, 2
    )`,
  `INSERT INTO landmark_categories (landmark_id, category_id) VALUES
    ('a1111111-1111-4111-8111-111111111111', 3),
    ('a1111111-1111-4111-8111-111111111111', 4),
    ('b2222222-2222-4222-8222-222222222222', 2),
    ('c3333333-3333-4333-8333-333333333333', 3)`,
];

console.log('Seeding reference data...');
for (const statement of seedStatements) {
  await runWithRetry(statement);
  await sleep(300);
}

console.log('Database is ready. Start server with npm run start:dev');
