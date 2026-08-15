# 🚀 NestJS Liveroom

**NestJS-Liveroom** is a real-time WebSocket application demonstrating a production-oriented approach to dynamic room management. It combines **NestJS, Socket.IO, and React** to create scalable live rooms where clients can dynamically join, communicate, and synchronize real-time state.

The project is organized as a **monorepo**, with dedicated `backend` and `frontend` applications managed from a shared root configuration. A root-level `package.json` provides unified commands for installing dependencies, running, building, formatting, and cleaning both applications together.

<p align="center">
  <a href="https://nest-js-liveroom.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-Frontend-black?style=for-the-badge&logo=vercel" alt="Live Frontend"></a>
  <a href="https://nest-js-liveroom.onrender.com/"><img src="https://img.shields.io/badge/API-Backend-black?style=for-the-badge&logo=render" alt="Live Backend"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs" alt="NestJS">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5%2F6-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Socket.IO-4.8-black?style=flat-square&logo=socket.io" alt="Socket.IO">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" alt="Vite">
</p>

---

## 🔗 Live Links

| App | URL |
|---|---|
| 🌐 **Frontend (Main Access Point)** | [nest-js-liveroom.vercel.app](https://nest-js-liveroom.vercel.app/) |
| ⚙️ **Backend API** | [nest-js-liveroom.onrender.com](https://nest-js-liveroom.onrender.com/) |

> ℹ️ The frontend is the primary entry point for users. It communicates with the backend over REST and WebSocket connections. The backend is hosted on Render's free tier, so the first request after a period of inactivity may take a few seconds to spin up.

---

## 🏗️ Project Architecture

```text
nest-js-liveroom/
├── backend/                  # NestJS + Socket.IO backend
│   ├── src/
│   ├── scripts/               # DB reset / clean utility scripts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── scripts/                  # Root-level build utility scripts
│   ├── copy-frontend.js       # Copies built frontend into backend for unified deploy
│   └── generate-sitemap.js    # Generates sitemap during build
│
├── package.json               # Root monorepo scripts
├── package-lock.json
├── .gitignore
└── README.md
```

This structure keeps the frontend and backend independently organized while allowing them to be installed, developed, built, and deployed together through the root project configuration.

---

## 🛠️ Tech Stack

### Backend

* **[NestJS](https://nestjs.com/)** `v11` — Modular Node.js framework powering the WebSocket gateways, REST controllers, and services.
* **[Socket.IO](https://socket.io/)** `v4.8` — Enables bidirectional, low-latency communication and dynamic room management (`@nestjs/websockets`, `@nestjs/platform-socket.io`).
* **[TypeORM](https://typeorm.io/)** `v11` (`@nestjs/typeorm`) + **MySQL** (`mysql2`) — Relational data persistence layer.
* **[Mongoose](https://mongoosejs.com/)** `v11` (`@nestjs/mongoose`) — MongoDB integration for document-based data.
* **[JWT](https://github.com/nestjs/jwt)** (`@nestjs/jwt`) + **bcrypt** — Authentication and secure password hashing.
* **class-validator / class-transformer** — DTO validation and payload transformation.
* **@nestjs/throttler** — Rate limiting to protect API and WebSocket endpoints.
* **cookie-parser** — Cookie handling for auth/session flows.
* **TypeScript** `v5.7` — Static typing across the backend codebase.

### Frontend

* **[React](https://react.dev/)** `v19` — Component-based UI for interacting with live rooms.
* **[React Router](https://reactrouter.com/)** `v7` — Client-side routing.
* **[Socket.IO Client](https://socket.io/docs/v4/client-api/)** `v4.8` — Establishes real-time communication with the NestJS WebSocket server.
* **[Tailwind CSS](https://tailwindcss.com/)** `v4` — Utility-first styling via `@tailwindcss/vite`.
* **react-icons** & **emoji-picker-react** — UI icons and emoji picker for chat/room interactions.
* **react-syntax-highlighter** — Syntax-highlighted code blocks (e.g. for code-sharing in rooms).
* **TypeScript** `v6` — Type safety across components, state, and Socket.IO event handling.
* **[Vite](https://vitejs.dev/)** `v8` — Fast dev server and build tooling.

### Project Tooling

* **Monorepo Architecture** — Maintains frontend and backend applications within a single repository.
* **Root-level npm Scripts** — Unified workflow for installing, developing, building, formatting, and cleaning both applications.
* **concurrently** — Runs frontend and backend dev servers in parallel with labeled, color-coded output.
* **ESLint + Prettier** — Consistent linting and formatting across both applications.
* **Custom build scripts** (`scripts/copy-frontend.js`, `scripts/generate-sitemap.js`) — Support a unified production build where the frontend is compiled and copied into the backend for single-origin deployment.

---

## ✨ Core Features

* ⚡ **Dynamic Live Rooms** — Create, join, and manage WebSocket rooms dynamically using entity-based identifiers.
* 🔄 **Polymorphic Data Architecture** — Decouples room logic from a specific database entity structure, allowing different entity types to participate in the same real-time room infrastructure.
* 📡 **Real-Time Communication** — Enables bidirectional communication and instant event broadcasting through Socket.IO.
* 🏗️ **Modular Backend Architecture** — Uses NestJS gateways and services to separate WebSocket communication from application logic.
* 🔐 **Authentication Layer** — JWT-based authentication with bcrypt password hashing and cookie support.
* 🗄️ **Dual Database Support** — TypeORM (MySQL) for relational data alongside Mongoose (MongoDB) for document-based data.
* 🛡️ **Rate Limiting** — Built-in request throttling via `@nestjs/throttler` to protect endpoints from abuse.
* 🔗 **Frontend–Backend Integration** — React communicates with the NestJS WebSocket layer through typed Socket.IO events.
* 😀 **Rich Room Interactions** — Emoji picker and syntax-highlighted code sharing for a chat-like room experience.
* 🛠️ **Admin Control Panel** — A dedicated, role-protected dashboard for managing user accounts, access, and moderation across the workspace (see [Admin Control Panel](#-admin-control-panel) below).
* 📦 **Monorepo Development Workflow** — Frontend and backend remain in separate folders while being managed and launched from the project root.
* 🚀 **Scalable Room Management** — Designed around modular event handling and real-time state synchronization for multiple concurrent rooms.
* 🗺️ **Automated Sitemap Generation** — Generates a sitemap as part of the production build process.
* ☁️ **Unified Deployment Pipeline** — A single build pipeline compiles the frontend and copies it into the backend for streamlined deployment (frontend on Vercel, backend on Render).

---

## 🛠️ Admin Control Panel

A built-in, role-protected **Admin Control Panel** gives administrators full visibility and control over user accounts, workspace access, and moderation — all from a single dashboard.

**Workspace overview**
* 📊 **Live account stats** — At-a-glance counters for **Total Users**, **Active**, **Disabled**, and **Blacklisted** accounts, updated in real time.

**Site settings**
* 🔐 **User Login toggle** — Enable or disable public login access to the platform on demand.
* 📝 **User Signup toggle** — Enable or disable new user registration workspace-wide.
* 🔄 **Manual refresh** — Re-sync settings and stats instantly via a refresh control.

**Registered users management**
* 👥 **User directory** — A sortable table of all registered users showing avatar, username, role (`Admin` / `User`), status (`Active` / `Disabled` / `Blacklisted`), and email.
* 🛡️ **Protected accounts** — Primary admin accounts are marked as protected, with actions disabled to prevent accidental self-lockout.
* 🚫 **Disable / Enable users** — Instantly suspend or restore a user's access to the platform.
* ⛔ **Blacklist users** — Permanently restrict abusive or malicious accounts from rejoining.
* 🗑️ **Delete users** — Remove user accounts from the workspace entirely.
* 🌗 **Theme-aware UI** — The panel fully supports light/dark mode for consistent styling across the app.

This panel is intended for users with the `Admin` role only and enforces role-based access control so that standard users cannot view or reach it.

---

## ▶️ Getting Started

### Prerequisites

* **Node.js** (LTS recommended)
* **npm**
* A running **MySQL** instance (for TypeORM)
* A running **MongoDB** instance (for Mongoose)

### Installation & Development

The root `package.json` provides commands to manage both applications, allowing the complete project to be installed and started from the repository root rather than running the frontend and backend separately.

```bash
# Install root, backend, and frontend dependencies
npm install

# Run both frontend and backend concurrently in watch mode
npm run dev
```

This starts:
* **Backend** — NestJS in watch mode (`start:dev`)
* **Frontend** — Vite dev server (`--host`, accessible on your local network)

Console output is labeled and color-coded (`FRONTEND` in cyan, `BACKEND` in magenta) for easy debugging.

---

## 📜 Available Scripts

### Root (`/package.json`)

| Script | Description |
|---|---|
| `npm run dev` | Runs frontend (Vite) and backend (Nest, watch mode) concurrently |
| `npm start` | Starts only the backend |
| `npm run build` | Builds the frontend, copies it into the backend, then builds the backend (full production build) |
| `npm run build:frontend` | Generates the sitemap and builds the frontend |
| `npm run build:backend` | Builds the backend only |
| `npm run copy:frontend` | Copies the compiled frontend build into the backend directory |
| `npm run postbuild` | Generates the sitemap (`scripts/generate-sitemap.js`) |
| `npm run format` | Formats both frontend and backend source files with Prettier |
| `npm run db:reset` | Resets the backend database |
| `npm run clean` | Cleans backend build artifacts |

### Backend (`/backend/package.json`)

| Script | Description |
|---|---|
| `npm run start` | Starts the NestJS server |
| `npm run start:dev` | Starts the server in watch mode |
| `npm run start:debug` | Starts the server in debug + watch mode |
| `npm run start:prod` | Runs the compiled production build (`dist/main`) |
| `npm run build` | Compiles the NestJS application |
| `npm run lint` | Lints and auto-fixes backend source files |
| `npm run format` | Formats backend source files with Prettier |
| `npm test` | Runs unit tests with Jest |
| `npm run test:watch` | Runs unit tests in watch mode |
| `npm run test:cov` | Runs unit tests with coverage report |
| `npm run test:e2e` | Runs end-to-end tests |
| `npm run db:reset` | Resets the database via `scripts/reset-db.js` |
| `npm run clean` | Cleans build artifacts via `scripts/clean.js` |

### Frontend (`/frontend/package.json`)

| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server (network-accessible) |
| `npm run build` | Type-checks and builds the frontend for production |
| `npm run preview` | Serves the production build locally for preview |
| `npm run lint` | Lints frontend source files |
| `npm run format` | Formats frontend source files with Prettier |

---

## 🚀 Deployment

* **Frontend** is deployed on **[Vercel](https://vercel.com/)** → [nest-js-liveroom.vercel.app](https://nest-js-liveroom.vercel.app/)
* **Backend** is deployed on **[Render](https://render.com/)** → [nest-js-liveroom.onrender.com](https://nest-js-liveroom.onrender.com/)
* The root `npm run build` script produces a unified production build: the frontend is compiled, a sitemap is generated, the compiled frontend assets are copied into the backend, and finally the backend is built — enabling either a split deployment (as above) or a single-origin deployment where the backend serves the frontend build.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please run `npm run format` and `npm run lint` in the relevant workspace before submitting a PR.

---

## 🐛 Issues

Found a bug or have a feature request? Please open an issue here:
👉 [github.com/krupal-036/nest-js-liveroom/issues](https://github.com/krupal-036/nest-js-liveroom/issues)

---

## 👤 Author

**Krupal Fataniya**

- Portfolio: [krupal.vercel.app](https://krupal.vercel.app/)