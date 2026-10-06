# 💳 NEOBANK — Цифровая банковская платформа

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

<p align="center">
  <b>Дипломный проект</b> · Полнофункциональная банковская платформа с кредитным скорингом<br/>
  и интерактивной аналитикой транзакций
</p>

---

## 📖 О проекте

**NEOBANK** — цифровая банковская платформа с возможностью управления личными финансами, оформления кредитов с **индивидуальной процентной ставкой** (рассчитывается автоматически на основе математической скоринговой модели) и интерактивной аналитики расходов. Платформа объединяет банковский функционал и наглядную аналитику в едином интерфейсе, делая управление финансами простым и понятным.

---

## ✨ Возможности

### 👤 Для пользователя
- 🔐 Регистрация и вход (JWT)
- 💳 Управление виртуальными картами
- ➕ Создание и перевыпуск карт
- 🔒 Блокировка и лимиты
- 💰 Пополнение и переводы
- 🏦 Кредит с **индивидуальной ставкой**
- 📅 Автоматическое списание платежей
- 📊 Аналитика: круговая диаграмма и график трат

### 👨‍💼 Для администратора
- 📈 Сводная статистика
- 👥 Управление пользователями
- 🔍 Все транзакции с фильтрацией
- 💼 Все кредиты с детализацией
- 🚫 Массовая блокировка карт
- 📊 Детальный просмотр каждого пользователя

---

## 🛠️ Стек технологий

**🎨 Frontend:** React 18 · Vite · React Router · Axios · Recharts · Framer Motion

**⚙️ Backend:** Node.js · Express · Prisma ORM · JWT · bcrypt

**🗄️ Инфраструктура:** PostgreSQL · Docker · Git · Prisma Studio

---

## 🏗️ Архитектура

```mermaid
flowchart TB
    User(("👤<br/>Пользователь"))
    Admin(("👨‍💼<br/>Администратор"))

    Client["🖥️ Клиент<br/><b>React + Vite</b><br/><i>Recharts · Axios · Router</i>"]
    Server["⚙️ Сервер<br/><b>Node.js + Express</b><br/><i>JWT · bcrypt · scoring.js</i>"]
    DB[("🗄️ PostgreSQL<br/><i>Docker</i>")]

    User -->|HTTPS| Client
    Admin -->|HTTPS| Client
    Client -->|"REST API"| Server
    Server -->|"Prisma ORM"| DB

    style User fill:#6e45e2,color:#fff,stroke:none
    style Admin fill:#6e45e2,color:#fff,stroke:none
    style Client fill:#61DAFB,color:#000,stroke:none
    style Server fill:#339933,color:#fff,stroke:none
    style DB fill:#4169E1,color:#fff,stroke:none
```

---

## 🧮 Математическая модель скоринга

Индивидуальная процентная ставка рассчитывается по методу **аддитивной свёртки критериев**.

### Формула скорингового балла

```
S = Σ (w_k × x_k),  k = 1..8
```

где:
- `S` — интегральный скоринговый балл пользователя
- `w_k` — вес k-го критерия
- `x_k` — нормализованное значение критерия (от 0 до 1)

### Критерии оценки

| № | Критерий | Вес | Влияние |
|:-:|----------|:---:|:-------:|
| 1 | Среднемесячные доходы | 1.5 | ➕ |
| 2 | Среднемесячные расходы | 0.8 | ➖ |
| 3 | Отношение расходов к доходам | 1.2 | ➖ |
| 4 | Остаток на счёте | 1.0 | ➕ |
| 5 | Количество активных карт | 0.5 | ➕ |
| 6 | Срок пользования платформой | 0.7 | ➕ |
| 7 | Количество погашенных кредитов | 1.0 | ➕ |
| 8 | Наличие просрочек | 1.3 | ➖ |

### Формула расчёта ставки

```
r = 5 + (1 − S / 8) × 20
```

📌 **Диапазон ставок:** от **5%** (надёжные заёмщики) до **25%** (высокий риск).

---

## 🚀 Быстрый старт

### Требования
- Node.js **18+**
- PostgreSQL **15+** (или Docker)
- npm / yarn

### 1️⃣ Клонирование

```bash
git clone https://github.com/ВАШ_НИК/neobank.git
cd neobank
```

### 2️⃣ Запуск базы данных (Docker)

```bash
docker run --name neobank-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=neobank \
  -p 5432:5432 \
  -d postgres:15
```

### 3️⃣ Настройка сервера

```bash
cd server
npm install
```

Создайте файл `.env` в папке `server`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/neobank"
JWT_SECRET="your_super_secret_key"
PORT=5000
```

Примените миграции и запустите сервер:

```bash
npx prisma migrate dev --name init
node index.js
```

🟢 Сервер: **http://localhost:5000**

### 4️⃣ Настройка клиента

```bash
cd ../client
npm install
npm run dev
```

🟢 Клиент: **http://localhost:5173**

---

## 📁 Структура проекта

```
neobank/
│
├── 📂 client/                    # React-приложение
│   ├── src/
│   │   ├── 📂 components/        # Компоненты (Card, TransferForm, ...)
│   │   ├── 📂 pages/             # Страницы (Dashboard, Credit, Admin, ...)
│   │   ├── 📄 api.js             # Настройка Axios
│   │   └── 📄 App.jsx
│   └── 📄 package.json
│
├── 📂 server/                    # Node.js-сервер
│   ├── 📂 prisma/
│   │   └── 📄 schema.prisma      # Схема БД
│   ├── 📄 scoring.js             # Модуль скоринга
│   ├── 📄 index.js               # Точка входа
│   └── 📄 package.json
│
└── 📄 README.md
```

---

## 🔌 Основные API endpoints

### 🔐 Аутентификация

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `POST` | `/api/register` | Регистрация нового пользователя |
| `POST` | `/api/login` | Вход пользователя |
| `POST` | `/api/admin/login` | Вход администратора |

### 👤 Пользователь

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/api/me` | Данные текущего пользователя |
| `GET` | `/api/cards` | Список карт пользователя |
| `POST` | `/api/deposit` | Пополнение баланса |
| `POST` | `/api/transfer` | Перевод другому пользователю |
| `PATCH` | `/api/cards/:id/settings` | Изменение лимита и блокировка |

### 🏦 Кредиты

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/api/credit/rate` | Получить индивидуальную ставку |
| `POST` | `/api/credit/apply` | Оформить кредит |
| `POST` | `/api/credit/withdraw` | Снять средства с кредита |
| `POST` | `/api/credit/repay` | Погасить кредит |

### 👨‍💼 Администратор

| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/api/admin/users` | Все пользователи |
| `GET` | `/api/admin/stats` | Сводная статистика |
| `GET` | `/api/admin/transactions` | Все транзакции |
| `GET` | `/api/admin/credits` | Все кредиты |

---

## 🔐 Безопасность

| Инструмент | Назначение |
|------------|------------|
| 🔑 **JWT** | Аутентификация и авторизация |
| 🔒 **bcrypt** | Хеширование паролей с солью |
| 🛡️ **Prisma ORM** | Защита от SQL-инъекций |
| 🔄 **SQL-транзакции** | Целостность финансовых операций |
| 👥 **Роли** | Разграничение прав доступа |

---

## 🧪 Тестирование

Проведено функциональное тестирование методом **«чёрного ящика»** — проверка по входным и выходным данным без анализа внутреннего кода.

| Функционал | Статус |
|------------|:------:|
| Регистрация и авторизация | ✅ |
| Управление картами | ✅ |
| Пополнение и переводы | ✅ |
| Оформление кредита со скорингом | ✅ |
| Автоматическое списание | ✅ |
| Аналитика и фильтрация | ✅ |
| Панель администратора | ✅ |

---

## 🗺️ Планы развития

- 🔔 Push-уведомления
- 💳 Интеграция с внешними платёжными системами
- 📱 Мобильное приложение (React Native)
- 📈 Расширенные аналитические отчёты
- 🤖 ML для улучшения скоринговой модели

---

## 👩‍💻 Автор

**Алиева Алина Саидовна** 

Специальность: `09.02.07 — Информационные системы и программирование`
Московский колледж управления, гостиничного бизнеса и информационных технологий «Царицыно»
📍 Москва, 2026

---

## 📄 Лицензия

Проект создан в учебных целях в рамках дипломной работы. 
