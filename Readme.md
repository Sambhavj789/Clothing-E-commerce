
# 👔 Elite Attire — Full-Stack E-Commerce Platform

A modern, full-stack e-commerce web application for a premium clothing brand. Built with **React** on the frontend and **Node.js + Express + MongoDB** on the backend, featuring a dedicated admin panel for managing products, orders, and categories.

---

## ✨ Features

### 🛍️ Customer-Facing
- **Product Catalog** — Browse products with category, size, and price-range filters
- **Hero Slider** — Dynamic banner section with call-to-action
- **User Authentication** — Register / Login with JWT-based auth
- **Shopping Cart** — Add/remove items, adjust quantities, view order summary
- **Order Placement** — Place orders directly from the product listing
- **Responsive Design** — Mobile-friendly UI crafted with CSS Modules

### 🔐 Admin Panel
- **Dashboard** — Centralized admin layout with sidebar navigation
- **Product Management** — Add, edit, delete products with image uploads (Multer)
- **Category Management** — Create, update, delete categories & subcategories
- **Order Management** — View all orders, track status, manage fulfillment

---

## 🧰 Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| **Frontend**  | React 19, Vite, React Router 7, Axios, React Icons  |
| **Backend**   | Node.js, Express 5, Mongoose (MongoDB), JWT, bcrypt  |
| **Storage**   | MongoDB (via Mongoose ODM), Multer (file uploads)    |
| **Auth**      | Cookie-based JWT authentication & role-based access  |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` (use the provided `.env-example`):

```env
PORT = 4000
MONGO_URI = "mongodb://localhost:27017/clothing-e-commerce"
MODE = "development"
FRONTEND_URL = "*"
JWT_SECRET = "your_secret_key"
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 📸 Screenshots

All design previews are available in the `design/` directory:

| Page | Preview |
|------|---------|
| Home Page | `design/home_elite_attire/screen.png` |
| Shop / Products | `design/shop_products_elite_attire/screen.png` |
| About Us | `design/our_story_elite_attire/screen.png` |
| Contact Us | `design/contact_us_elite_attire/screen.png` |
| My Orders | `design/my_orders_elite_attire/screen.png` |
| Admin — Products | `design/product_inventory_admin_console/screen.png` |
| Admin — Orders | `design/manage_orders_admin_console/screen.png` |
| Admin — Dashboard | `design/admin_dashboard_elite_attire/screen.png` |

---

## 📁 Project Structure

```
E-Commerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── connectToDB.js
│   │   ├── controllers/
│   │   │   ├── authControllers.js
│   │   │   ├── categoryControllers.js
│   │   │   ├── orderControllers.js
│   │   │   └── productControllers.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── checkAdminMiddleware.js
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── productsModel.js
│   │   │   ├── ordersModel.js
│   │   │   └── categoryModel.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   └── upload.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env-example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── Header.jsx
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminCategory.jsx
│   │   ├── utils/
│   │   │   └── api.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── design/
    ├── home_elite_attire/
    ├── shop_products_elite_attire/
    ├── our_story_elite_attire/
    ├── contact_us_elite_attire/
    ├── my_orders_elite_attire/
    ├── admin_dashboard_elite_attire/
    ├── product_inventory_admin_console/
    └── manage_orders_admin_console/
```

---

## 📬 API Endpoints

| Method | Endpoint                         | Auth    | Description            |
| ------ | -------------------------------- | ------- | ---------------------- |
| POST   | `/api/v1/auth/register`          | —       | Register a new user    |
| POST   | `/api/v1/auth/login`             | —       | Login                  |
| GET    | `/api/v1/auth/me`                | ✅ User | Get current user       |
| GET    | `/api/v1/auth/logout`            | ✅ User | Logout                 |
| GET    | `/api/v1/category`               | —       | Get all categories     |
| POST   | `/api/v1/category`               | ✅ Admin | Add category          |
| PUT    | `/api/v1/category`               | ✅ Admin | Update category       |
| DELETE | `/api/v1/category`               | ✅ Admin | Delete category       |
| GET    | `/api/v1/products/all`           | —       | Get all products       |
| GET    | `/api/v1/products/product/:id`   | —       | Get single product     |
| POST   | `/api/v1/products`               | ✅ Admin | Add product (multipart)|
| PUT    | `/api/v1/products`               | ✅ Admin | Update product         |
| DELETE | `/api/v1/products`               | ✅ Admin | Delete product         |
| GET    | `/api/v1/orders/all`             | ✅ Admin | Get all orders         |
| GET    | `/api/v1/orders/user-orders`     | ✅ User | Get user's orders      |
| POST   | `/api/v1/orders/create`          | ✅ User | Place an order         |
| PUT    | `/api/v1/orders/update`          | ✅ Admin | Update order status   |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to open an [issue](../../issues) or submit a [pull request](../../pulls).

---

## 📄 License

This project is licensed under the ISC License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Analyze Infotech**
