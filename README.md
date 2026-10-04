# 🪐 Orbit Social Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![Design](https://img.shields.io/badge/UI-Clean%20Modern%20Light-0ea5e9.svg)
![License](https://img.shields.io/badge/License-ISC-green.svg)
![Deployment](https://img.shields.io/badge/Deployment-Live-orange.svg)

Orbit is a full-stack social networking platform engineered for high efficiency, seamless discovery, and zero-friction user engagement. Built on the modern MERN stack, Orbit pairs a **feed-first public discovery model** with **contextual authentication gates**, an **optimistic UI engine**, and a **clean, contemporary light aesthetic**.

---

## 🚀 Live Demo
* **Frontend:** [orbit-social-app.vercel.app](https://orbit-social-app-8ebu.vercel.app/)
* **Backend API:** [orbit-social-app-backend.onrender.com](https://orbit-social-app-backend.onrender.com)

---

## 💡 What Makes Orbit Unique (Architectural & Tech Differentiators)

Add these high-impact technical points to your project portfolio, resume, or interview discussions:

1. **Feed-First Public Discovery & Deferred Authentication**:
   - Eliminates bounce rates by allowing unauthenticated visitors to immediately browse feeds, view media, read comments, inspect engagement metrics, and explore discussions.
   - High-converting **Contextual Auth Gate**: When a visitor attempts to **Like**, **Comment**, **Share**, **Save/Bookmark**, or **Publish a Post**, a sleek modal prompt appears preserving their exact feed position and scroll state.

2. **Curated Instagram-Style Discovery & Auto-Seeding**:
   - Pre-configured with rich photography (architecture, travel, developer workspaces, specialty coffee, and culinary creations) complete with threaded comments, realistic timestamps, hashtags, and engagement metrics.
   - Includes a safe, automated seeder (`backend/seed.js` or `npm run seed`) that backs up existing records and auto-populates the database.

3. **Optimistic UI Engine with Error Rollback (0ms Perceived Latency)**:
   - Likes, Bookmarks, and Comments reflect immediately on the client interface without waiting for network round-trips.
   - If a network request encounters an error, the interface automatically rolls back to the prior state and provides a non-intrusive notification toast.

4. **Hybrid Web Share Integration**:
   - Integrates the W3C **Web Share API** (`navigator.share`) to trigger native operating system share sheets on mobile and tablet devices.
   - Seamlessly falls back to 1-click direct link copying to the clipboard with an animated confirmation snackbar on desktop browsers, while tracking server-side share metrics.

5. **Persistent Bookmarking & Engagement-Ranked Trending**:
   - Indexed Mongoose schema (`savedBy`) enables personal post collections.
   - Multi-tab feed filters allow switching between **Explore (All)**, **Trending (Engagement-Ranked via Aggregation Pipeline)**, and **Saved (Personal Bookmarks)**.

6. **Centralized Reactive Auth State (`AuthContext`)**:
   - Replaces scattered, synchronous `localStorage` reads with a unified React Context and custom `useAuth()` hook that guarantees synchronized session state, token injection, and action queueing.

7. **Clean Modern Light Design & Custom Vector Logo (`OrbitLogo`)**:
   - Modern, high-readability light aesthetic with Slate-900 typography, soft neutral cards, crisp 1px borders, subtle micro-shadows, and responsive layout.
   - Official custom SVG vector branding (`OrbitLogo`) integrated across the navigation bar, authentication dialogs, and login/signup screens.

8. **Skeleton Shimmer Loading (CLS Optimization)**:
   - Implements Material-UI skeleton cards during initial loading and pagination to eliminate Cumulative Layout Shift (CLS) and ensure high Core Web Vitals performance.

---

## 🛠️ Tech Stack

### **Frontend**
* **React 19:** Declarative, component-driven UI architecture.
* **React Router v6:** Seamless client-side routing.
* **Material UI (MUI v7) & Emotion:** Customized modern light design system and responsive grid.
* **Axios:** RESTful client with automatic JWT bearer request/response interceptors.
* **Google Fonts:** Clean typography powered by *Plus Jakarta Sans*.

### **Backend**
* **Node.js & Express.js:** RESTful API server with modular routers and middleware.
* **JWT (JSON Web Tokens):** Stateless authentication with bearer token authorization.
* **BcryptJS:** Secure salted password hashing for user security.
* **CORS:** Cross-origin resource sharing configured for web deployment.

### **Database**
* **MongoDB Atlas & Mongoose:** Scalable document schemas with compound indexing and aggregation pipelines for engagement ranking.

---

## 📡 API Reference

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/signup` | Register a new user with hashed password | Public |
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
│   │   ├── Post.js             # Post schema with likes, comments, savedBy, sharesCount
│   │   └── User.js             # User credentials schema (bcrypt & JWT)
│   ├── routes/
│   │   ├── auth.js             # Signup & Login endpoints with DB health checks
│   │   └── posts.js            # Feed, like, save, comment, and share endpoints
│   ├── seedData.js             # Curated Instagram-style discovery posts
│   ├── seed.js                 # Database seeder with sample posts
│   ├── .env                    # Environment configuration (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example            # Sample configuration template
│   ├── package.json
│   └── index.js                # Express server bootstrap & MongoDB connection
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML entry point with Plus Jakarta Sans font
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  # Centralized authentication & action gate
│   │   ├── components/
│   │   │   ├── AuthModal.js    # Modal dialog with Orbit branding, Sign In & Sign Up tabs
│   │   │   ├── OrbitLogo.js    # Custom vector SVG Orbit branding component
│   │   │   ├── Navbar.js       # Sticky header with logo, navigation, and user menu
│   │   │   ├── PostCard.js     # Post card with like, comments, share, and bookmark
│   │   │   └── CreatePost.js   # Post creator with auth prompt & live preview
│   │   ├── pages/
│   │   │   ├── Feed.js         # Explore, Trending, and Saved multi-tab feeds
│   │   │   ├── Login.js        # Dedicated login route
│   │   │   └── Signup.js       # Dedicated signup route
│   │   ├── api.js              # Axios client with JWT interceptor
│   │   ├── App.js              # Theme provider & client-side routes
│   │   └── index.css           # Clean modern light design tokens & animations
│   └── package.json
└── README.md
```

---

## ⚙️ Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/PrajaktaSarkhel/orbit_social_app.git
cd orbit_social_app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (you can copy `.env.example`):
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/orbit?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
REACT_APP_API_BASE_URL=http://localhost:5001/api
```

Seed initial discovery posts (optional):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server running at http://localhost:5001
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm start
# Client running at http://localhost:3000
```

---

## 📄 License
Distributed under the ISC License.