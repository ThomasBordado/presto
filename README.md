# Presto – Presentation Builder & Live Viewer

Presto is a web application inspired by Slides.com that lets users create, edit and present slide decks in the browser. It was built as a full-stack project for a university course, with a strong focus on React, UI/UX, accessibility and automated testing.

This repository contains:

- A **React frontend** for managing presentations and slides
- A lightweight **backend API** used by the frontend
- Tooling and scripts for local development, testing and deployment

---

## 🚀 Features

- **Authentication**
  - Register, login and logout flows with basic form validation
  - Protected routes for authenticated users

- **Dashboard**
  - List of user presentations with thumbnail, description and slide count
  - “New presentation” modal to create a deck (name, description, thumbnail)

- **Presentation Editing**
  - Add, delete and reorder slides
  - Edit slide title, content and layout
  - Support for text blocks and other elements on a slide
  - Autosave / update behaviour via the backend API

- **Presentation Viewing**
  - Full-screen presentation mode
  - Keyboard navigation between slides
  - Responsive layout so decks are viewable on different screen sizes

- **UX, Accessibility & Testing**
  - Keyboard-accessible navigation and controls
  - Semantic HTML and ARIA where appropriate
  - Frontend tests for key flows (auth, dashboard, editor)
  - Linting and pre-commit checks via course tooling

---

## 🛠 Tech Stack

**Frontend**

- React (SPA)
- React Router for client-side routing
- Fetch/HTTP wrappers to talk to the backend REST API
- CSS modules / custom styling (no UI template libraries)

**Backend**

- Lightweight Node.js HTTP server (course-provided skeleton extended where needed)
- Simple in-memory / file-based store to support the frontend interface

**Tooling**

- npm / Node.js
- ESLint and Prettier-style formatting rules
- Git hooks and CI configuration from the course template

---

## 📁 Project Structure

```text
.
├── frontend/          # React single-page application (main focus of this repo)
├── backend/           # Lightweight API server used by the frontend
├── util/              # Setup and utility scripts
├── A11Y.md            # Accessibility design notes
├── UIUX.md            # UI/UX decisions and rationale
├── TESTING.md         # Testing strategy and notes
├── deployment.md      # Notes on deployment (e.g. Vercel)
└── README.md          # Project overview (this file)
```
---

## 🔧 Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn


### 1. Clone the Repository

```bash
git clone https://github.com/ThomasBordado/presto.git
cd presto
```


### 2. Install dependancies 

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd ../backend
npm install
```

### 3. Run the App locally

### Start backend
```bash
cd backend
npm start
```

### Start frontend
```bash
cd frontend
npm run dev
```

Once running, open the frontend in your browser (commonly): http://localhost:3000/


### 4. Run Tests

```bash
npm test
```
---
## 🌐 Deployment

The frontend is suitable for deployment on platforms such as Vercel or similar static hosting providers, with the backend deployed separately as a lightweight Node service.

Deployment-related notes and assumptions are documented in deployment.md.


---
## 🧑‍💻 My Contributions

While the backend scaffolding and tooling were provided as part of the course, my work focused on building out the frontend application and integrating it with the API. In particular, I:

Implemented the React SPA, including routing for landing, login, register, dashboard and editor views.

Built the dashboard UI for listing presentations and the modal flow for creating new presentations.

Developed the slide editor interface, including slide navigation and editing of slide content.

Integrated the frontend with the backend REST API for authentication and presentation management.

Applied accessibility and UI/UX best practices informed by A11Y.md and UIUX.md.

Wrote and maintained frontend tests for key user flows and kept the project passing the course CI checks.
