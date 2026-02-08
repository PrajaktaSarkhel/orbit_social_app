# 🌌 Orbit Social App

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![License](https://img.shields.io/badge/License-ISC-green.svg)
![Deployment](https://img.shields.io/badge/Deployment-Live-orange.svg)

Orbit is a high-performance, full-stack social networking platform designed for seamless interaction. It features a clean, modern UI and a robust MERN-stack architecture, allowing users to share thoughts, images, and engage with a global community.

---

## 🚀 Live Demo
* **Frontend:** [orbit-social-app.vercel.app](https://orbit-social-app.vercel.app/)
* **Backend API:** [orbit-social-app.onrender.com](https://orbit-social-app.onrender.com)

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **React.js:** Declarative, component-based library for the dynamic UI.
* **React Router:** Handles seamless client-side navigation.
* **Axios:** Manages asynchronous API calls and request/response interceptors.
* **Styling:** Modern CSS3 (Flexbox/Grid) with **Material UI (MUI)** and **React Bootstrap** for responsive design.

### **Backend**
* **Node.js & Express.js:** Scalable server environment and RESTful API management.
* **JWT (JSON Web Tokens):** Secure, stateless user authentication.
* **BcryptJS:** Industry-standard password hashing.

### **Database**
* **MongoDB Atlas:** Cloud NoSQL database for flexible JSON-like data storage.
* **Mongoose:** Object Modeling for Node.js, managing User and Post relationships.

---

## ✨ Key Features

- [x] **Secure Auth:** Signup and Login with JWT-protected routes.
- [x] **Flexible Posting:** Create posts with text, images, or both.
- [x] **Smart Feed:** Chronological public feed displaying all user interactions.
- [x] **Social Engagement:** Real-time Like/Unlike system and Comment threads.
- [x] **Responsive UI:** Optimized for mobile, tablet, and desktop views.

---

## 📁 Project Structure
```text
orbit-social-app/
├── backend/
│   ├── models/        # Mongoose Schemas (User, Post)
│   ├── routes/        # API Endpoints (Auth, Posts)
│   ├── .env           # Environment Variables
│   └── index.js       # Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/# Reusable UI elements
│   │   ├── pages/     # Login, Signup, Feed
│   │   └── App.js     # Routing logic
│   └── public/
└── README.md
```

---

## ⚙️ Local Installation

### 1. Clone the Repo:
```bash
git clone https://github.com/yourusername/orbit-social-app.git
cd orbit-social-app
```

### 2. Backend Setup:
```bash
cd backend
npm install
# Create a .env file and add your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup:
```bash
cd frontend
npm install
npm start
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | User login & JWT generation |
| `GET` | `/api/posts/feed` | Retrieve all posts |
| `POST` | `/api/posts/create` | Create a new post |
| `PUT` | `/api/posts/:id/like` | Like/Unlike a post |

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License.