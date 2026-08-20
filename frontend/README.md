# Chart It

A modern, full-stack AI-powered expense management system designed to help users track, analyze, and automate their financial workflows in real-time.

---

## 🚀 Overview

**Chart It** is a full-stack web application for personal expense tracking, automated budget classification, and financial behavior analytics.

The project focuses on a modular, clean frontend architecture integrated with a Node.js/Express backend, Drizzle ORM, PostgreSQL database, and an **LLM-powered Natural Language AI Engine** that automatically parses unstructured text inputs and image receipts into structured transactions.

---

## ✨ Key Features

* 🔐 **Secure Authentication** — JWT-based user login, registration, and protected routes.
* 📊 **Financial Dashboard** — Real-time cashflow metrics, income vs. expense visual trends, and balance tracking.
* 💸 **Transaction Management** — Full history tracking with multi-attribute filtering and status indicators.
* 🗂️ **Category System** — Custom category tagging with dynamic icon mappings and item link counters.
* 📈 **Advanced Analytics** — Automated weekly outflow tracking, spending distribution, and budget optimization metrics.
* 🤖 **AI Assistant & Natural Language Parser** — Natural language text parser (e.g., *"Spent $50 on gas"*) and intelligent OCR scanning capability for automated transaction extraction.
* 👤 **User Profile Management** — Personal settings and profile overview.
* 📱 **Modern Dark UI** — Responsive layout built with Tailwind CSS, Lucide icons, and glassmorphism styling.

---

## 🛠️ Tech Stack

### Frontend
* **React** & **TypeScript**
* **Vite** — Build tool and dev server
* **Tailwind CSS** — Utility-first styling
* **React Router v6** — Client-side navigation & layout routing
* **Lucide React** — Icon suite

### Backend Architecture
* **Node.js** & **Express.js** — REST API Framework
* **PostgreSQL** — Relational database
* **Drizzle ORM** — Type-safe ORM & schema builder
* **Zod** — Schema validation
* **JSON Web Tokens (JWT)** & **bcrypt** — Security & Auth
* **LLM / Vision AI API Integration** — Natural language parsing and OCR extraction

---

## 📁 Project Structure

```text
chart-it/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── database-schema.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # AppLayout, Sidebar
│   │   │   └── ui/             # Reusable modals, inputs, cards
│   │   ├── hooks/              # Auth & Data fetching hooks
│   │   ├── pages/
│   │   │   ├── AIAssistantPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   ├── Authpage.tsx
│   │   │   ├── CategoriesPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── TransactionsPage.tsx
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── src/
    │   ├── db/                 # Drizzle schemas and DB client
    │   ├── routes/             # Express API routers (auth, transactions, categories, AI)
    │   ├── controllers/        # Request handlers & Business logic
    │   ├── middlewares/        # JWT auth verification & Zod validation
    │   └── server.ts
    ├── package.json
    └── drizzle.config.ts

🧩 System Architecture & Data Flow
Chart It separates responsibilities between client rendering, backend validation, and AI parsing services.

Plaintext
[ React Frontend ]
       │
       ▼
[ Express REST API ]
       │
       ├───► [ Drizzle ORM ] ───► [ PostgreSQL Database ]
       │
       └───► [ LLM AI Engine ] ──► (Parses raw text/OCR to JSON transactions)
Application Routing Pipeline
Plaintext
Public Routes
├── /login
└── /register

Protected AppLayout Routes
├── /dashboard     (Overview & AI Quick Entry)
├── /transactions  (Detailed History)
├── /categories    (Tag Management)
├── /analytics     (Financial Insights)
├── /ai-hub        (AI Natural Language & OCR Hub)
└── /profile       (User Settings)
⚙️ Quick Start
1. Clone & Install
Bash
git clone <repository-url>
cd chart-it
2. Frontend Setup
Bash
cd frontend
npm install
npm run dev
3. Backend Setup
Bash
cd ../backend
npm install
npm run dev
🔐 Environment Setup
Create a .env file in the backend directory:

Code snippet
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/chartit_db
JWT_SECRET=your_super_secret_key
AI_API_KEY=your_llm_api_key