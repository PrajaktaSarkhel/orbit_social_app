# 🌌 Orbit Social Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![Design](https://img.shields.io/badge/UI-Cosmic%20Glassmorphism-purple.svg)
![License](https://img.shields.io/badge/License-ISC-green.svg)
![Deployment](https://img.shields.io/badge/Deployment-Live-orange.svg)

Orbit is a full-stack social networking platform engineered for high efficiency, seamless discovery, and zero-friction user engagement. Unlike traditional clones that lock visitors behind a hard authentication wall, Orbit implements a **feed-first public discovery model** paired with **contextual action gates** and **optimistic UI updates**.

---

## 🚀 Live Demo
* **Frontend:** [orbit-social-app.vercel.app](https://orbit-social-app-8ebu.vercel.app/)
* **Backend API:** [orbit-social-app.onrender.com](https://orbit-social-app.onrender.com)

---

## 💡 What Makes Orbit Unique (Architectural & Tech Differentiators)

Add these high-impact technical points to your project description, portfolio, and resume:

1. **Feed-First Public Discovery & Deferred Authentication**:
   - Eliminates bounce rates by allowing unauthenticated visitors to immediately browse feeds, view media, check engagement stats, and explore discussions.
   - High-converting **Contextual Auth Gate**: If a guest attempts to **Like**, **Comment**, **Share**, **Save/Bookmark**, or **Create a Post**, a glassmorphic modal prompts them to sign in or register without losing their feed position or context.

2. **Optimistic UI Engine with Error Rollback (0ms Perceived Latency)**:
   - Likes, Bookmarks, and Comments reflect immediately on the client interface before waiting for the network round-trip.
   - If a network request fails, the application automatically reverts to the previous snapshot state and displays an alert toast.

3. **Hybrid Web Share Integration**:
   - Integrates the W3C **Web Share API** (`navigator.share`) to trigger native operating system share sheets on mobile and tablet devices.
   - Seamlessly falls back to 1-click direct link copying to the clipboard with an animated confirmation snackbar on desktop browsers, while tracking server-side share metrics.

4. **Persistent Bookmarking & Collection System**:
   - Indexed Mongoose schema (`savedBy`) enables personal post collections.
   - Multi-tab feed filters allow switching between **Explore (All)**, **Trending (Engagement-Ranked)**, and **Saved (Personal Bookmarks)**.

5. **Centralized Reactive Auth State (`AuthContext`)**:
   - Replaces scattered, synchronous `localStorage` reads with a unified React Context and custom `useAuth()` hook that guarantees synchronized session state, token injection, and action queueing.

6. **Skeleton Shimmer Loading (CLS Optimization)**:
   - Implements Material-UI skeleton cards during initial loading and pagination to eliminate Cumulative Layout Shift (CLS) and ensure high Core Web Vitals performance.

7. **Cosmic Glassmorphism Design System**:
   - Tailored space-age dark aesthetic (`#080c14`, deep indigo, subtle cyan and pink glows), custom scrollbars, and micro-interactions (heart pop pulse, expandable comment drawers).

---

## 🛠️ Tech Stack

### **Frontend**
* **React 19:** Declarative, component-driven UI architecture.
* **React Router v6:** Seamless client-side routing.
* **Material UI (MUI v7) & Emotion:** Customized cosmic glassmorphism theme and responsive grid.
* **Axios:** RESTful client with automatic JWT bearer request/response interceptors.
* **Google Fonts:** Clean typography powered by *Plus Jakarta Sans*.

### **Backend**
* **Node.js & Express.js:** RESTful API server with modular routers and middleware.
* **JWT (JSON Web Tokens):** Stateless authentication with bearer token authorization.
* **BcryptJS:** Secure salted password hashing.
* **CORS:** Cross-origin resource sharing configured for web deployment.

### **Database**
* **MongoDB Atlas & Mongoose:** Scalable document schemas with compound indexing and aggregation pipelines for engagement ranking.

---

## 📡 API Reference

| Method | Endpoint | Description | Public / Protected |
|--------|----------|-------------|-------------------|
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/login` | User login & JWT generation | Public |
| `GET` | `/api/posts/feed?page=1&filter=all` | Retrieve paginated public feed (`all`, `trending`) | Public |
| `POST` | `/api/posts/create` | Create a new post | Auth Protected |
| `PUT` | `/api/posts/:id/like` | Like or unlike a post (optimistic) | Auth Protected |
| `PUT` | `/api/posts/:id/save` | Save or unsave a post (bookmark) | Auth Protected |
| `POST` | `/api/posts/:id/comment` | Add a comment to a post | Auth Protected |
| `POST` | `/api/posts/:id/share` | Increment share counter & share metadata | Public |
| `GET` | `/api/posts/saved/:username` | Retrieve saved posts for a user | Auth Protected |

---

## 📁 Project Structure
```text
orbit-social-app/
├── backend/
│   ├── models/
│   │   ├── Post.js        # Schemas with likes, comments, savedBy, sharesCount
│   │   └── User.js        # User credentials schema
│   ├── routes/
│   │   ├── auth.js        # Signup & Login endpoints
│   │   └── posts.js       # Feed, like, save, comment, share endpoints
│   ├── .env               # Environment configuration
│   └── index.js           # Server bootstrap
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js # Centralized authentication & action gate
│   │   ├── components/
│   │   │   ├── AuthModal.js   # Glassmorphic modal with Sign In & Sign Up tabs
│   │   │   ├── Navbar.js      # Sticky header with top-right Auth buttons
│   │   │   ├── PostCard.js    # Like, comment drawer, share, bookmark card
│   │   │   └── CreatePost.js  # Post creator with auth prompt & preview
│   │   ├── pages/
│   │   │   ├── Feed.js        # Explore, Trending, Saved multi-tab feed
│   │   │   ├── Login.js       # Dedicated login route
│   │   │   └── Signup.js      # Dedicated signup route
│   │   ├── api.js             # Axios client with JWT interceptor
│   │   ├── App.js             # Theme & route provider
│   │   └── index.css          # Cosmic design tokens & animations
│   └── package.json
└── README.md
```

---

## ⚙️ Local Development

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/orbit-social-app.git
cd orbit-social-app
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
# Client running at http://localhost:3000
```

---

## 📄 License
Distributed under the ISC License.