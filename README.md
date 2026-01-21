
# � Clothing Store - MERN Stack E-Commerce Project �️

Welcome to the **Clothing Store**, a modern, full-stack e-commerce platform designed for the fashion industry. This project utilizes the **MERN stack** (MongoDB, Express.js, React, Node.js) to deliver a seamless shopping experience with premium aesthetics and robust functionality. ✨

---

## 🌟 Key Features

### 👤 Customer Experience

*   **� Trendy Product Catalog:** Browse a curated selection of fashion items with rich visuals and categories.
*   **�️ Smart Cart System:** Easily manage your shopping bag and proceed to a secure checkout.
*   **� Secure Authentication:** Sign up/Login via email or **Google** (OAuth2). Password recovery included.
*   **⭐ Reviews & Ratings:** Read and leave feedback on products.
*   **� Responsive & Interactive:** Built with **Tailwind CSS** and **Framer Motion** for smooth animations and mobile-perfect design.

### 🛠️ Admin Dashboard

*   **📦 Product Management:** Add, edit, and delete clothing items including sizes, colors, and images.
*   **👥 User Administration:** Manage registered users and roles (Admin/User).
*   **� Order Tracking:** View and update order statuses.

---

## 🏗️ Tech Stack

This project is built with the latest web technologies:

### **Frontend** (`/frontend`)
*   **Framework:** React 19 + Vite ⚡
*   **Styling:** Tailwind CSS v4 🎨
*   **Animations:** Framer Motion 🎬
*   **Icons:** Lucide React & React Icons
*   **State/Routing:** React Router DOM, Custom Hooks
*   **Notifications:** React Hot Toast

### **Backend** (`/backend`)
*   **Runtime:** Node.js
*   **Framework:** Express.js v5
*   **Database:** MongoDB + Mongoose v8
*   **Authentication:** JWT (JSON Web Tokens) & Google OAuth
*   **AI Integration:** Google Generative AI (@google/generative-ai) 🤖
*   **Email:** Nodemailer

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd Clothing-Store-MERN-Project
```

### 2️⃣ Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
email_user=your_email@gmail.com
email_pass=your_email_app_password
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:
```bash
npm start
```

### 3️⃣ Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend development server:
```bash
npm run dev
```

---

## � Application Workflow

1.  **User Access:** Users can browse products immediately but must log in to add items to the cart or checkout.
2.  **Shopping:** Users select sizes/colors and add items to the cart.
3.  **Checkout:** Secure checkout process (Integration dependent on payment gateway).
4.  **Admin:** Admins access the dashboard to manage inventory and view sales data.

---

## 💖 Show your support

Give a ⭐️ if you like this project! Happy Coding! 🚀
