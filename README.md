# 🍰 Sonali Coldrinks & Bakery

A full-stack online ordering system for a bakery/cold-drinks shop — customers can browse the menu, place orders (Cash on Delivery or UPI/online), and track them in real time, while the owner manages everything from a live admin dashboard.

Built with **React + Vite** on the frontend, **Node.js/Express** on the backend, **TiDB Cloud (MySQL-compatible)** for storage, **Socket.IO** for real-time order updates, and **WhatsApp Cloud API** for automated order notifications.

---

## ✨ Features

### Customer-facing
- Browse a categorized, live menu (only available items shown)
- Add items to cart, adjust quantities, view running total
- Checkout with delivery details, **GST** and **delivery fee** auto-calculated
- Pay via **Cash on Delivery** or **UPI/Online** (QR code checkout)
- Order confirmation page with a shareable **Order ID**
- Track order status by Order ID
- Automatic **WhatsApp confirmation** message after ordering

### Admin dashboard
- Secure JWT-based admin login
- Live-updating order feed via **Socket.IO** (no refresh needed)
- Accept, update status (`pending → accepted → preparing → out_for_delivery → delivered`), or cancel orders
- Full menu management — add, edit, delete, and toggle item availability
- Bulk-clear historical orders
- Instant **WhatsApp alert** to the owner for every new order

---

## 🛠 Tech Stack

| Layer      | Technology                                                        |
|------------|---------------------------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Tailwind CSS, react-hot-toast, PWA support |
| Backend    | Node.js, Express, Socket.IO                                       |
| Database   | TiDB Cloud (MySQL-compatible) via `mysql2`                        |
| Auth       | JWT (`jsonwebtoken`) + `bcryptjs` password hashing                 |
| Messaging  | WhatsApp Cloud API (Meta Graph API)                                |

---

## 📁 Project Structure

```
sonali_tidb/
├── backend/
│   ├── config/          # DB connection, Socket.IO setup, SQL schema
│   ├── controllers/     # Route logic (admin, menu, orders)
│   ├── middleware/      # Auth middleware, error handler
│   ├── models/          # Data access layer
│   ├── routes/          # Express route definitions
│   ├── services/        # WhatsApp notification service
│   ├── utils/           # Helpers (order ID generator, etc.)
│   ├── seed.js           # Seed sample menu data
│   ├── create_admin.js   # CLI script to create an admin account
│   └── server.js         # App entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Cart, MenuCard, OrderCard
│   │   ├── context/      # Cart state (Context API)
│   │   ├── pages/         # Home, Checkout, OrderSuccess, Login, AdminDashboard
│   │   ├── services/      # Axios API client, Socket.IO client
│   │   └── utils/         # Pricing calculations
│   └── public/payment/    # UPI/PhonePe QR code image
└── package.json          # Root scripts to run both apps together
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [TiDB Cloud](https://tidbcloud.com/) cluster (free tier works)
- A WhatsApp Cloud API account (optional — for order notifications)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd sonali_tidb
npm run install:all
```
This installs dependencies for the root, `backend/`, and `frontend/` in one go.

### 2. Configure environment variables
Copy the example env file and fill in your own values:
```bash
cp backend/.env.example backend/.env
```

| Variable | Description |
|---|---|
| `PORT` | Backend server port (default `5000`) |
| `TIDB_HOST` / `TIDB_PORT` / `TIDB_USER` / `TIDB_PASSWORD` / `TIDB_DATABASE` | TiDB Cloud connection details (from your cluster's **Connect → Node.js** panel) |
| `JWT_SECRET` | Any long random string for signing admin auth tokens |
| `CLIENT_URL` | Frontend URL for CORS (default `http://localhost:5173`) |
| `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Cloud API credentials |
| `OWNER_PHONE` | Bakery owner's WhatsApp number (international format, no `+`) |
| `ADMIN_SETUP_KEY` | One-time secret key used to create the first admin account |

### 3. Set up the database
Apply the schema to your TiDB Cloud cluster:
```bash
cd backend
npm run schema
```
Optionally seed it with sample menu items:
```bash
npm run seed
```

### 4. Create your admin account
```bash
node backend/create_admin.js
```

### 5. Run the app
From the project root, this starts both backend and frontend together:
```bash
npm run dev
```
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:5000**
- Admin login: **http://localhost:5173/admin/login**

---

## 📡 API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/menu` | Public | Get all menu items |
| `POST` | `/api/menu` | Admin | Add a menu item |
| `PUT` | `/api/menu/:id` | Admin | Update a menu item |
| `DELETE` | `/api/menu/:id` | Admin | Delete a menu item |
| `PATCH` | `/api/menu/:id/toggle` | Admin | Toggle item availability |
| `POST` | `/api/orders` | Public | Place a new order |
| `GET` | `/api/orders/:orderId` | Public | Track an order by ID |
| `GET` | `/api/orders` | Admin | List all orders |
| `PUT` | `/api/orders/:id/accept` | Admin | Accept an order |
| `PUT` | `/api/orders/:id/cancel` | Admin | Cancel an order |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status |
| `DELETE` | `/api/orders/clear` | Admin | Clear all orders |
| `POST` | `/api/admin/login` | Public | Admin login |
| `POST` | `/api/admin/setup` | Public (one-time) | Create the first admin |
| `GET` | `/api/admin/profile` | Admin | Get logged-in admin's profile |

Admin-only routes require a `Bearer <token>` obtained from `/api/admin/login`.

---

## 📦 Available Scripts

**Root**
- `npm run dev` — run backend and frontend concurrently
- `npm run install:all` — install all dependencies
- `npm run seed` — seed the database with sample menu data
- `npm run create-admin` — create an admin account

**Backend**
- `npm start` — run in production mode
- `npm run dev` — run with nodemon (auto-restart)
- `npm run schema` — apply `schema.sql` to the database

**Frontend**
- `npm run dev` — start the Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally

---

## 🔒 Notes
- Never commit your `.env` file — it contains database and API secrets. Only `.env.example` should be tracked.
- WhatsApp notifications fail silently (logged, not thrown) so a messaging outage never blocks order placement.

---

## 📄 License
This project is currently unlicensed. Add a `LICENSE` file if you plan to open-source it.
