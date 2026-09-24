# GarbaSaathi — Pune Garba Community MVP 💃🕺

> **Tagline:** 9 Days. 9 Friends. Endless Garba. 💃🕺  
> **Location:** Pune, Maharashtra  
> **Target Event:** Navratri Garba & Dandiya Community  

GarbaSaathi is a simple, modern, mobile-friendly community web application for Navratri in Pune where boys and girls can create a profile and connect with fellow Garba/Dandiya lovers across Pune.

---

## 🌟 Key Features

1. **Navratri Hero Landing Page**
   - Garba-themed responsive design with rich dark/purple/pink festive aesthetics.
   - Highlights "How It Works" (Create Profile → Discover Friends → Connect & Celebrate).
   - "Why GarbaSaathi?" community benefits and safety guidelines.

2. **Pune-Only Profile Registration**
   - Supports Pune areas: Baner, Balewadi, Wakad, Hinjewadi, Kothrud, Aundh, Viman Nagar, Kharadi, Hadapsar, Magarpatta, Swargate, Camp, Pimpri, Chinchwad, Bhosari, PCMC, etc.
   - Garba experience level (Beginner, Intermediate, Experienced) & preference (Garba, Dandiya, Both).
   - Multi-day selection for Navratri (Day 1 through Day 9).
   - Safe public contact (Instagram username / handle) — **No phone numbers exposed**.

3. **9 Days. 9 Friends. Daily Partner Connection System**
   - Navratri day pill filters (Day 1..Day 9).
   - When User A connects with User B for Day 3, User B is marked as connected and automatically filtered out of User A's available list for Day 3.
   - On other days (e.g. Day 4), User B can appear again ("9 Days. 9 Friends" concept).

4. **My GarbaSaathis Page**
   - View your saved Garba connections grouped by Navratri day (Day 1, Day 2, Day 3, etc.).
   - Access partner's provided social handle to coordinate meetup locations.

5. **Moderation & Admin Dashboard**
   - View total user count and active Pune area demographic stats.
   - Manage registered profiles with delete capabilities.
   - One-click demo data reset & re-seeding.

6. **Safety & Privacy Guidelines**
   - Promotes public venue meetups, financial safety, boundary respect, and zero phone number exposure.

---

## 🏗️ Architecture & Folder Structure

```text
GarbaSaathi/
├── server/                    # Node.js + Express + SQLite Backend
│   ├── index.js               # REST API server & routes
│   ├── db.js                  # SQLite database initialization & schema
│   ├── seedData.js            # 14 realistic Pune demo profiles & initial connections
│   ├── garba.db               # SQLite database file (created automatically)
│   └── package.json
│
├── client/                    # Vite + React + Tailwind CSS Frontend
│   ├── index.html             # SEO meta tags, Google Fonts, Title
│   ├── vite.config.js         # Proxy config targeting backend port 5000
│   ├── tailwind.config.js     # Custom festive color palette & animations
│   ├── postcss.config.js      # PostCSS setup
│   ├── src/
│   │   ├── main.jsx           # React DOM root entry
│   │   ├── App.jsx            # Main app shell & navigation router
│   │   ├── index.css          # Global Tailwind styles & glassmorphism
│   │   ├── context/
│   │   │   └── UserContext.jsx # Session & Active Demo Profile Switcher
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── BrowseMembersPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MyConnectionsPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MemberCard.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   └── SafetySection.jsx
│   │   └── utils/
│   │       └── constants.js   # Pune areas, Navratri days, options
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Setup & Local Development

### Prerequisites
- Node.js v18+ 
- npm v9+

### 1. Backend Setup
```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Start Express backend (runs on http://localhost:5000)
node index.js
```

### 2. Frontend Setup (in a second terminal)
```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🗄️ Database Schema & API Endpoints

### Database Tables (SQLite)

#### `users`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `name` TEXT NOT NULL
- `age` INTEGER NOT NULL
- `gender` TEXT NOT NULL
- `area` TEXT NOT NULL
- `experience` TEXT NOT NULL
- `activity` TEXT NOT NULL
- `availableDays` TEXT NOT NULL (JSON string array, e.g. `[1, 2, 3, 5]`)
- `lookingFor` TEXT NOT NULL
- `socialContact` TEXT NOT NULL
- `bio` TEXT NOT NULL
- `avatarUrl` TEXT
- `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP

#### `connections`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `userId` INTEGER NOT NULL
- `partnerId` INTEGER NOT NULL
- `navratriDay` INTEGER NOT NULL
- `connectionDate` DATETIME DEFAULT CURRENT_TIMESTAMP
- `status` TEXT DEFAULT 'connected'
- `UNIQUE(userId, partnerId, navratriDay)`

---

### Key Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Get profiles with optional filters (`area`, `gender`, `experience`, `activity`, `day`, `currentUserId`) |
| `GET` | `/api/users/:id` | Get profile details by ID |
| `POST` | `/api/users` | Create new profile with validation |
| `DELETE` | `/api/users/:id` | Delete profile (Admin / Moderation) |
| `POST` | `/api/connections` | Connect with partner for a specific Navratri Day (`{ userId, partnerId, navratriDay }`) |
| `GET` | `/api/connections` | Get user's connections grouped by day (`?userId=12`) |
| `DELETE` | `/api/connections/:id` | Remove connection |
| `GET` | `/api/admin/stats` | Retrieve total users, connections, and area demographics |
| `POST` | `/api/seed` | Reset & re-seed database with demo Pune profiles |

---

## 📦 Production Build & Deployment Instructions

### Frontend Deployment (Vite)
To build production static assets:
```bash
cd client
npm run build
```
The optimized bundle will be generated in `client/dist/`. This can be deployed to Vercel, Netlify, or served directly via Express.

### Backend Deployment (Render / Railway / VPS)
1. Push your repository to GitHub.
2. Set environment variables on your host:
   - `PORT`: `5000` (or host provided port)
3. Build command: `npm install`
4. Start command: `node server/index.js`

---

## 🛡️ Community Safety
- Phone numbers are **never** displayed publicly.
- Profiles share preferred social handles (e.g. Instagram).
- Always meet at public Garba grounds / event venues in Pune.
