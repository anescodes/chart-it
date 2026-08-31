# API Endpoints & Routes Reference

All main API endpoints are exposed through the Express Backend (`http://localhost:5000/api/v1`).

---

## 1. Authentication Module (`/auth`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/register` | No | Register new user account |
| `POST` | `/api/v1/auth/login` | No | Authenticate user & return JWT |
| `GET` | `/api/v1/auth/me` | Yes | Get current user profile |

---

## 2. Categories Module (`/categories`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/categories` | Yes | List all categories for logged-in user |
| `POST` | `/api/v1/categories` | Yes | Create a new custom category |
| `DELETE`| `/api/v1/categories/:id` | Yes | Delete a category |

---

## 3. Transactions Module (`/transactions`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/transactions` | Yes | Get transactions (with pagination/filters) |
| `POST` | `/api/v1/transactions` | Yes | Create a new transaction |
| `PATCH` | `/api/v1/transactions/:id` | Yes | Update transaction details |
| `DELETE`| `/api/v1/transactions/:id` | Yes | Delete a transaction |

---

## 4. Analytics Module (`/analytics`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/analytics/summary` | Yes | Get total income, balance, and expense totals |
| `GET` | `/api/v1/analytics/breakdown` | Yes | Category-wise expense breakdown for charts |

---

## 5. AI & ML Microservice Module (`/ai`)

*Note: Express proxies these requests directly to FastAPI (`http://localhost:8000/api/v1`).*

| Method | Endpoint | Auth Required | Input Payload | Response Output |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/api/v1/ai/categorize` | Yes | `{ "text": "Grocery store $40" }` | `{ "category": "Food", "confidence": 0.98 }` |
| `POST` | `/api/v1/ai/analyze-csv` | Yes | `multipart/form-data` (CSV file) | ML Anomalies + Forecasts + LLM Insights |
