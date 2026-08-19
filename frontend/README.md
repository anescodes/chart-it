# Chart It

A modern full-stack expense management application designed to help users track, analyze, and visualize their financial activity.

## 🚀 Overview

**Chart It** is a full-stack web application for managing personal expenses and financial data.

The project focuses on building a clean, scalable, and maintainable architecture while providing an intuitive interface for tracking transactions and visualizing financial information.

The application is built with a modern React frontend and a dedicated backend API.

---

## ✨ Features

* 🔐 User authentication
* 📝 User registration and login
* 💰 Expense management
* 📊 Financial data visualization
* 📈 Dashboard with financial statistics
* 🗂️ Expense categories
* 🔄 CRUD operations for expenses
* 🛡️ Protected routes
* ✅ Client-side form validation
* 📱 Responsive user interface
* 🌍 Currency and date formatting
* 🔌 REST API integration

> More features will be added as the project evolves.

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Zustand** — global state management
* **Axios** — HTTP client
* **Zod** — schema validation
* **React Router** — routing

### Backend

The frontend communicates with a separate backend through a REST API.

> Backend technology and architecture are documented in the backend repository.

---

## 📁 Project Structure

```text
chart-it-frontend/
│
├── public/
│   └── Static assets
│
├── src/
│   │
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.api.ts
│   │   └── expenses.api.ts
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   └── layout/
│   │
│   ├── context/
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useExpenses.ts
│   │
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── schemas/
│   │   └── auth.schema.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   └── expense.types.ts
│   │
│   ├── utils/
│   │   ├── currency.ts
│   │   └── date.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🧩 Architecture

The frontend is organized by responsibility to keep the codebase maintainable and scalable.

### API Layer

The `api/` directory contains all communication with the backend.

```text
React Component
      ↓
Custom Hook
      ↓
API Layer
      ↓
Axios
      ↓
Backend REST API
```

Example:

```text
expenses.api.ts
       ↓
GET /api/expenses
       ↓
Spring Boot / Backend
```

---

### Components

Reusable UI components are separated from feature-specific components.

```text
components/
├── ui/
├── auth/
└── layout/
```

The `ui/` directory contains reusable components such as:

* Button
* Input
* Card
* Modal
* Spinner

---

### State Management

Global application state is managed using **Zustand**.

Zustand is used for state that needs to be shared between different parts of the application without unnecessarily passing props through multiple component levels.

---

### Validation

**Zod** is used to define validation schemas for user input.

Example:

```text
Form
 ↓
Zod Schema
 ↓
Validation
 ↓
API Request
```

---

### Routing

React Router handles application routing.

Protected routes require an authenticated user before allowing access.

```text
Public Routes
├── Login
└── Register

Protected Routes
└── Dashboard
    ├── Expenses
    ├── Statistics
    └── Profile
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd chart-it-frontend
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Use `.env.example` as a reference.

> Never commit private secrets or sensitive credentials to Git.

---

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at the local development URL provided by Vite.

---

## 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🧪 Code Quality

Before committing changes, make sure the project builds successfully and that the implemented feature works correctly.

Recommended workflow:

```text
Implement
   ↓
Test
   ↓
Review
   ↓
Commit
```

---

## 📚 Documentation

Additional technical documentation can be found in the `docs/` directory.

```text
docs/
├── architecture.md
├── api.md
├── authentication.md
└── deployment.md
```

---

## 🗺️ Roadmap

Planned improvements include:

* [ ] Advanced financial analytics
* [ ] Improved dashboard
* [ ] Expense filtering and searching
* [ ] Data export
* [ ] Advanced charts
* [ ] Notifications
* [ ] Improved authentication
* [ ] Automated testing
* [ ] Docker support
* [ ] Production deployment
* [ ] Performance optimization

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

For major changes, please open an issue first to discuss the proposed change.

---

## 📄 License

This project is currently under development.

License information will be added later.

---

## 👨‍💻 Author

**Anes**

Built as a full-stack software engineering project with a focus on clean architecture, scalability, and practical development.
