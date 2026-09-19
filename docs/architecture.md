# System Architecture & Tech Stack

This document serves as the single source of truth for the application's system design, service communication, and directory layout.

---

## 1. System Overview & Ports

The application follows a **Microservices-ready Monorepo Architecture**:

- **Frontend (`:5173`)**: React + Vite SPA using TypeScript & Tailwind CSS.
- **Main Backend API (`:5000`)**: Express.js + TypeScript handling Auth, DB operations, and Business Logic.
- **Database**: PostgreSQL managed with Drizzle ORM.
- **AI/ML Service (`:8000`)**: Python FastAPI Microservice dedicated to ML data processing, CSV analysis (Pandas & Scikit-Learn), and LLM integrations (Google Gemini / OpenAI).

+------------------+           +------------------+          +-------------------+
|  React Frontend  |  ------>  | Express Backend  |  ----->  | PostgreSQL DB     |
|   (Port 5173)    |           |   (Port 5000)    |          | (Drizzle ORM)     |
+------------------+           +------------------+          +-------------------+
|
| (Proxy/Internal HTTP)
v
+------------------+
| FastAPI Service  |
|   (Port 8000)    |
| (Pandas/ML/LLM)  |
+------------------+

## 2. Directory Structure

### A. Express Backend (`backend/`)
Follows a modular, feature-based pattern.

```text
backend/
└── src/
    ├── db/
    │   ├── index.ts               # Drizzle connection setup
    │   └── schema.ts              # PostgreSQL database schemas
    ├── middlewares/
    │   └── auth.middleware.ts     # JWT authentication guard
    ├── modules/
    │   ├── auth/                  # Auth routes, services, controllers
    │   ├── categories/            # Category management
    │   ├── transaction/           # Expense & Income transactions
    │   ├── analytics/             # Financial dashboard metrics
    │   └── ai/                    # Express AI Proxy routes (Calls FastAPI)
    │       ├── ai.controller.ts
    │       └── ai.route.ts
    ├── utils/                     # API Response & Error handling helpers
    ├── app.ts                     # Express setup, CORS, route registration
    └── server.ts                  # Server initialization





    frontend/
└── src/
    ├── api/                       # Axios API clients (auth, transaction, ai, etc.)
    ├── components/
    │   ├── auth/                  # Login / Register forms
    │   └── layout/                # Navbar, Sidebar, AppLayout
    ├── context/                   # AuthContext & Zustand Stores
    ├── pages/                     # Dashboard, Transactions, Categories, Analytics, Auth
    ├── routes/                    # AppRoutes definitions
    └── types/                     # TypeScript Interfaces & Models



    ai_service/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── categorize.py   # LLM Text-to-Category endpoint
│   │       │   └── csv_analysis.py # CSV Ingestion, ML & Analytics
│   │       └── router.py
│   ├── core/
│   │   └── config.py               # API keys & Environment settings
│   ├── services/
│   │   ├── llm_service.py          # Gemini/OpenAI SDK logic & Structured outputs
│   │   ├── ml_pipeline.py          # Pandas, Anomaly Detection & Forecasting
│   │   └── prompt_templates.py     # Isolated Prompt templates
│   ├── schemas/                    # Pydantic models for validation
│   └── main.py                     # FastAPI entry point
├── requirements.txt                # FastAPI, Pandas, Scikit-Learn, Pydantic
└── Dockerfile

3. AI Architecture & Data Flow
Feature 1: LLM Transaction Categorization
Frontend sends raw user text (e.g., "Starbucks Coffee $5") to POST /api/v1/ai/categorize on Express (:5000).

Express verifies JWT and proxies the payload to FastAPI (:8000).

FastAPI (llm_service.py) passes the prompt to the LLM and enforces a structured JSON response returning category name, confidence score, and suggested tags.

Feature 2: CSV Upload & ML Analytics Pipeline
Frontend uploads a .csv file via Multipart/Form-Data to Express.

Express forwards the stream to FastAPI's /api/v1/ai/analyze-csv endpoint.

FastAPI (ml_pipeline.py):

Ingestion & Preprocessing: Parses CSV into a Pandas DataFrame, cleans null values, normalizes dates/amounts.

Feature Engineering & ML: Calculates spending variance, moving averages, and runs Isolation Forest to flag unusual spending anomalies.

LLM Summary: Sends the calculated statistical summary (not raw full file) to the LLM to generate plain-text English financial insights.

Result: FastAPI returns structured charts data + AI insights back to Express -> Frontend.

## 2. Deployment & Running the Application

The entire application is containerized and can be started with a single command.

### Start the complete application

From the project root:

```bash
docker compose up --build
```

This command automatically:

* Builds the **Frontend** container.
* Builds the **Express Backend** container.
* Builds the **FastAPI AI/ML** container.
* Starts the **PostgreSQL** database.
* Creates the PostgreSQL database and user on first initialization.
* Waits for PostgreSQL and FastAPI to become healthy before starting the backend.
* Automatically runs **Drizzle database migrations**.
* Creates/updates the required database tables.
* Starts the complete application stack.

### Application URLs

After startup:

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:5000`
* FastAPI: `http://localhost:8000`
* FastAPI documentation: `http://localhost:8000/docs`

The PostgreSQL database is used internally by Docker and does not need to expose port `5432` to the host.

### Production-ready workflow

A new user or client should only need Docker installed and then run:

```bash
docker compose up --build
```

No manual PostgreSQL installation, database creation, table creation, or migration commands are required.

> **Note:** Do not use `docker compose down -v` during normal operation because it removes the PostgreSQL volume and therefore deletes the stored database data.
