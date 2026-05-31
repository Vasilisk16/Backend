# Архангельск — наследие (Backend)

NestJS API для каталога достопримечательностей Архангельской области.

## Стек

- NestJS 11
- TypeORM + PostgreSQL (Aiven)
- Swagger (`/api/docs`)
- nestjs-dj-admin (`/admin`)

## Быстрый старт

1. Скопируйте `example.env` в `.env` и заполните переменные.
2. Скачайте CA-сертификат из панели Aiven (Overview → CA Certificate) и сохраните как `ca.pem` в корне проекта.
3. Установите зависимости (автоматически применится patch для `nestjs-dj-admin`):

```bash
npm install
npm run build
npm run start:prod
```

Для разработки:

```bash
npm run start:dev
```

API: `http://localhost:3000/api`  
Swagger: `http://localhost:3000/api/docs`  
Админка: `http://localhost:3000/admin`

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| POSTGRES_HOST | Хост Aiven PostgreSQL |
| POSTGRES_PORT | Порт |
| POSTGRES_USER | Пользователь |
| POSTGRES_PASSWORD | Пароль |
| POSTGRES_DATABASE | Имя БД |
| ADMIN_EMAIL | Логин админки |
| ADMIN_PASSWORD | Пароль админки |
| PORT | Порт сервера (по умолчанию 3000) |

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api` | Health-check |
| GET | `/api/landmarks` | Список объектов (`eraId`, `categoryId`, `search`, `page`, `limit`) |
| GET | `/api/landmarks/:id` | Детальная страница |
| GET | `/api/eras` | Справочник эпох |
| GET | `/api/categories` | Справочник категорий |

## SQL-скрипт для курсовой

Полный DDL (таблицы, views, functions, triggers, seed) находится в [`database/init.sql`](database/init.sql).

Запуск в Aiven через psql или DBeaver:

```bash
psql "postgres://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" -f database/init.sql
```

## Деплой на Render

1. Подключите репозиторий к Render.
2. Используйте [`render.yaml`](render.yaml) или создайте Web Service вручную.
3. Добавьте env-переменные в Dashboard.
4. Убедитесь, что `ca.pem` лежит в корне репозитория.

## Тесты

```bash
npm run test
npm run test:cov
```
