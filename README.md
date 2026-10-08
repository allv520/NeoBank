# 💳 NEOBANK — Цифровая банковская платформа

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/scikit--learn-1.9-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="scikit-learn"/>
</p>

<p align="center">
  <b>Дипломный проект</b> · Полнофункциональная банковская платформа с <b>ML-скорингом</b><br/>
  и интерактивной аналитикой транзакций
</p>

---

## 📖 О проекте

**NEOBANK** — цифровая банковская платформа с возможностью управления личными финансами, оформления кредитов с **индивидуальной процентной ставкой** и интерактивной аналитики расходов.

**Ключевая особенность:** индивидуальная ставка рассчитывается **двумя способами** — классической аддитивной свёрткой и **ML-моделью**, обученной на данных. Система автоматически переключается между ними (fallback).

---

## 📸 Скриншоты

### 🏠 Главная страница

<img src="docs/screenshots/landing.jpg" alt="Главная страница" width="100%"/>

---

### 👤 Личный кабинет

<img src="docs/screenshots/dashboard.jpg" alt="Личный кабинет" width="100%"/>

---

### 📊 Аналитика транзакций

<img src="docs/screenshots/analytics.jpg" alt="Аналитика транзакций" width="100%"/>

---

### 💳 Управление картами

<img src="docs/screenshots/cards.jpg" alt="Управление картами" width="100%"/>

---

### 🏦 Кредиты со скорингом

<img src="docs/screenshots/credit.jpg" alt="Кредиты со скорингом" width="100%"/>

---

### 👨‍💼 Панель администратора

<img src="docs/screenshots/admin.jpg" alt="Панель администратора" width="100%"/>

---

## ✨ Возможности

### 👤 Для пользователя
- 🔐 Регистрация и вход (JWT + bcrypt)
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

---

## 🛠️ Стек технологий

**🎨 Frontend:** React 18 · Vite · React Router · Axios · Recharts · Framer Motion

**⚙️ Backend:** Node.js · Express · Prisma ORM · JWT · bcrypt

**🐍 ML-модуль:** Python 3.14 · scikit-learn · pandas · numpy · joblib · FastAPI · Uvicorn

**🗄️ Инфраструктура:** PostgreSQL · Docker · Git

---

## 🏗️ Архитектура

### Общая схема

```
┌──────────────────────────────────────────────────────┐
│              👤 Пользователь / 👨‍💼 Админ             │
└───────────────────────┬──────────────────────────────┘
                        │ HTTPS
                        ▼
┌──────────────────────────────────────────────────────┐
│                🖥️ React Client (:5173)               │
│         React · Vite · Recharts · Axios              │
└───────────────────────┬──────────────────────────────┘
                        │ REST API
                        ▼
┌──────────────────────────────────────────────────────┐
│              ⚙️ Node.js Server (:5000)               │
│         Express · JWT · bcrypt · Prisma              │
│                                                      │
│         scoring-service.js (гибридный скоринг)       │
│              │                                       │
│        ┌─────┴──────┐                                │
│        ▼            ▼                                │
│   🐍 ML-Service   📐 Fallback                       │
│     (:8000)         (аддитивная)                     │
└───────────────────────┬──────────────────────────────┘
                        │ Prisma ORM
                        ▼
┌──────────────────────────────────────────────────────┐
│              🗄️ PostgreSQL (Docker)                  │
└──────────────────────────────────────────────────────┘
```

### ML-модуль

```mermaid
flowchart TB
    User(("👤<br/>Пользователь"))
    
    React["🖥️ React Client<br/><i>:5173</i>"]
    Node["⚙️ Node.js Server<br/><b>NEOBANK</b><br/><i>:5000</i>"]
    ML["🐍 ML-Service<br/><b>FastAPI</b><br/><i>:8000</i>"]
    Model[("📦 model.pkl<br/>LogisticRegression")]
    DB[("🗄️ PostgreSQL<br/><i>Docker</i>")]
    Fallback["📐 Fallback<br/>Аддитивная свёртка"]
    
    User --> React
    React -->|"HTTP"| Node
    Node -->|"HTTP /predict"| ML
    ML --> Model
    Node -.->|"если ML упал"| Fallback
    Node -->|"Prisma"| DB
    
    style User fill:#6e45e2,color:#fff
    style React fill:#61DAFB,color:#000
    style Node fill:#339933,color:#fff
    style ML fill:#3776AB,color:#fff
    style Model fill:#F7931E,color:#fff
    style DB fill:#4169E1,color:#fff
    style Fallback fill:#ff6b6b,color:#fff
```

---

## 🧠 ML-модуль

> 📂 **Полный ML-пайплайн и код вынесены в отдельный репозиторий:**  
> 👉 [**neobank_ml**](https://github.com/allv520/neobank_ml)

Помимо классического подхода (аддитивная свёртка), в проект **интегрирована ML-модель** кредитного скоринга.

### 🎯 Сравнение подходов

| Подход | Принцип | ROC-AUC |
|--------|---------|:-------:|
| **Аддитивная свёртка** | Экспертные веса, придуманные человеком | ~0.60 |
| **ML-модель (LogReg)** | Обучена на данных, находит закономерности | **0.68–0.73** |

### 🔄 Как работает

1. Пользователь открывает раздел «Кредиты»
2. React отправляет запрос `GET /api/credit/rate`
3. Node.js вызывает `getInterestRate(userId)`
4. **Пробует ML-сервис** → отправляет 8 признаков на `:8000/predict`
5. ML-сервис возвращает **персональную ставку** (6–10%)
6. Если ML недоступен → **fallback** на аддитивную свёртку (14–18%)

### 📊 Метрики ML-модели

Обучено 3 модели на **1000 примерах**:

| Модель | Accuracy | Precision | Recall | F1 | **ROC-AUC** |
|--------|:--------:|:---------:|:------:|:--:|:-----------:|
| **Random Forest** | 0.770 | 0.524 | 0.234 | 0.324 | **0.727** |
| Logistic Regression | 0.770 | 0.529 | 0.191 | 0.281 | 0.675 |
| Decision Tree | 0.730 | 0.333 | 0.149 | 0.206 | 0.667 |

### 📈 Важность признаков (Random Forest)

| Признак | Важность |
|---------|:--------:|
| `debt_ratio` | **0.289** |
| `expense` | 0.178 |
| `income` | 0.156 |
| `days_on_platform` | 0.129 |
| `balance` | 0.123 |
| `has_overdue` | 0.045 |
| `active_cards` | 0.041 |
| `closed_credits` | 0.039 |

### 📉 Сравнение ML и аддитивной свёртки

На **10 реальных пользователях**:

| Пользователь | Аддитивная | ML | Разница |
|:------------:|:----------:|:--:|:-------:|
| 1 | 18.23% | 9.93% | -8.30 |
| 2 | 15.62% | 6.64% | -8.98 |
| 3 | 14.43% | 7.89% | -6.54 |
| 4 | 16.49% | 8.01% | -8.48 |
| 5 | 15.89% | 8.31% | -7.58 |
| 6 | 15.81% | 6.89% | -8.92 |
| 7 | 17.01% | 8.96% | -8.05 |
| 8 | 15.89% | 6.79% | -9.10 |
| 9 | 14.01% | 6.56% | -7.45 |
| 10 | 17.36% | 7.35% | -10.01 |

**Вывод:** ML-модель даёт **более низкие и калиброванные** ставки для надёжных заёмщиков. Это делает кредитование **доступнее**.

### 🚀 Запуск ML-сервиса

```bash
# 1. Активируем виртуальное окружение
cd neobank-ml
.venv\Scripts\Activate.ps1

# 2. Запускаем Uvicorn
cd ml-service
uvicorn app:app --reload --port 8000
```

**Проверка:** `http://localhost:8000` → JSON со статусом `ok`.

### 🧪 Тест ML-предсказания

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "income": 22000, "expense": 8000, "debt_ratio": 0.36,
    "balance": 180000, "active_cards": 2, "days_on_platform": 300,
    "closed_credits": 1, "has_overdue": 0
  }'
```

**Ответ:**
```json
{"default_proba": 0.1545, "rate": 8.09, "model": "LogisticRegression"}
```

---

## 🧮 Математическая модель скоринга (fallback)

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
- Python **3.12+**
- PostgreSQL **15+** (или Docker)
- npm / yarn

### 1️⃣ Клонирование

```bash
git clone https://github.com/allv520/NeoBank.git
cd NeoBank
```

### 2️⃣ Запуск PostgreSQL (Docker)

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

Создайте `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/neobank"
JWT_SECRET="your_secret_key"
PORT=5000
ML_SERVICE_URL=http://localhost:8000
USE_ML_SCORING=true
```

Миграции и запуск:

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

### 5️⃣ Запуск ML-сервиса (опционально)

```bash
cd ../neobank-ml
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r ml-service/requirements.txt
cd ml-service
uvicorn app:app --reload --port 8000
```

🟢 ML-сервис: **http://localhost:8000**

> ⚠️ Если ML-сервис не запущен — NEOBANK автоматически использует fallback (аддитивную свёртку).

---

## 📁 Структура проекта

```
NeoBank/
│
├── 📂 client/                       # React-приложение
│   └── src/
│       ├── 📂 components/           # Переиспользуемые компоненты
│       ├── 📂 pages/                # Страницы приложения
│       ├── 📄 api.js                # Axios
│       └── 📄 App.jsx
│
├── 📂 server/                       # Node.js-сервер
│   ├── 📂 prisma/
│   │   └── 📄 schema.prisma         # Схема БД
│   ├── 📄 scoring.js                # Аддитивная свёртка (fallback)
│   ├── 📄 ml-scoring.js             # Клиент к ML-сервису
│   ├── 📄 scoring-service.js        # Гибридная логика
│   └── 📄 index.js                  # Точка входа
│
└── 📄 README.md
```

---

## 🔌 API Endpoints

### 🔐 Аутентификация
| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `POST` | `/api/register` | Регистрация |
| `POST` | `/api/login` | Вход пользователя |
| `POST` | `/api/admin/login` | Вход администратора |

### 👤 Пользователь
| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/api/me` | Данные пользователя |
| `GET` | `/api/cards` | Список карт |
| `POST` | `/api/deposit` | Пополнение |
| `POST` | `/api/transfer` | Перевод |
| `PATCH` | `/api/cards/:id/settings` | Лимит и блокировка |

### 🏦 Кредиты
| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/api/credit/rate` | **Индивидуальная ставка (ML/fallback)** |
| `POST` | `/api/credit/apply` | Оформить кредит |
| `POST` | `/api/credit/withdraw` | Снять средства |
| `POST` | `/api/credit/repay` | Погашение |

### 👨‍💼 Администратор
| Метод | Endpoint | Описание |
|:-----:|----------|----------|
| `GET` | `/api/admin/users` | Все пользователи |
| `GET` | `/api/admin/stats` | Статистика |
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

Проведено функциональное тестирование методом **«чёрного ящика»** + тестирование ML-модели.

| Функционал | Статус |
|------------|:------:|
| Регистрация и авторизация | ✅ |
| Управление картами | ✅ |
| Пополнение и переводы | ✅ |
| Оформление кредита с ML-скорингом | ✅ |
| Fallback на аддитивную свёртку | ✅ |
| Автоматическое списание | ✅ |
| Аналитика и фильтрация | ✅ |
| Панель администратора | ✅ |

---

## 🗺️ Планы развития

- 🤖 Замена LogReg на **XGBoost** (повышение ROC-AUC)
- 📈 Прогнозирование расходов (time series)
- 🏷️ Автоклассификация транзакций (NLP)
- 🔔 Push-уведомления
- 💳 Интеграция с внешними платёжными системами
- 📱 Мобильное приложение (React Native)
- 🐳 Docker Compose для запуска одной командой

---

## 👩‍💻 Автор

**Алиева Алина Саидовна**

Специальность: `09.02.07 — Информационные системы и программирование`
Московский колледж управления, гостиничного бизнеса и информационных технологий «Царицыно»
📍 Москва, 2026

---

## 📄 Лицензия

Проект создан в учебных целях в рамках дипломной работы. 

---
