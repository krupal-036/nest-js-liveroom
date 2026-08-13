# 🚀 NestJS Liveroom

**NestJS-Liveroom** is a real-time WebSocket application demonstrating a production-oriented approach to dynamic room management. It combines **NestJS, Socket.IO, and React** to create scalable live rooms where clients can dynamically join, communicate, and synchronize real-time state.

The project is organized as a **monorepo**, with dedicated `backend` and `frontend` applications managed from a shared root configuration. A root-level `package.json` provides unified commands for installing dependencies and running both applications together during development.

## 🏗️ Project Architecture

```text
nest-js-liveroom/
├── backend/              # NestJS + Socket.IO backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── package.json          # Root monorepo scripts
├── package-lock.json
├── .gitignore
└── README.md
```

This structure keeps the frontend and backend independently organized while allowing them to be developed and started together through the root project configuration.

## 🛠️ Tech Stack

### Backend

* **NestJS** — Modular Node.js framework for building the WebSocket server, gateways, and services.
* **Socket.IO** — Enables bidirectional, low-latency communication and dynamic room management.
* **TypeScript** — Provides static typing and improved maintainability across the backend.

### Frontend

* **React** — Component-based UI for interacting with live rooms.
* **TypeScript** — Provides type safety for application state, components, and Socket.IO event handling.
* **Socket.IO Client** — Establishes real-time communication with the NestJS WebSocket server.

### Project Tooling

* **Monorepo Architecture** — Maintains frontend and backend applications within a single repository.
* **Root-level npm Scripts** — Provides a unified development workflow for starting both applications simultaneously.

## ✨ Core Features

* ⚡ **Dynamic Live Rooms** — Create, join, and manage WebSocket rooms dynamically using entity-based identifiers.
* 🔄 **Polymorphic Data Architecture** — Decouples room logic from a specific database entity structure, allowing different entity types to participate in the same real-time room infrastructure.
* 📡 **Real-Time Communication** — Enables bidirectional communication and instant event broadcasting through Socket.IO.
* 🏗️ **Modular Backend Architecture** — Uses NestJS gateways and services to separate WebSocket communication from application logic.
* 🔗 **Frontend–Backend Integration** — React communicates with the NestJS WebSocket layer through typed Socket.IO events.
* 📦 **Monorepo Development Workflow** — Frontend and backend remain in separate folders while being managed and launched from the project root.
* 🚀 **Scalable Room Management** — Designed around modular event handling and real-time state synchronization for multiple concurrent rooms.

## ▶️ Running the Project

The root `package.json` provides commands to manage both applications, allowing the complete project to be started from the repository root rather than running the frontend and backend separately.

```bash
npm install
npm run dev
```

This setup provides a clean development workflow while keeping the frontend and backend codebases logically separated.
