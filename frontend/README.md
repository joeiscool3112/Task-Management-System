# 📌 Task Management App

A full-stack Task Management application built with **React (Frontend)** and **Node.js + Express + PostgreSQL (Backend)**.

---

## 🚀 Features

### 🔐 Authentication
- User registration
- User login (JWT)
- Persistent login (localStorage)
- Protected routes

---

### 📁 Projects
- Create project (name, description, color)
- View all projects
- View project with tasks
- Edit/Delete project (owner only)

---

### ✅ Tasks
- Create task in project
- Edit task (name, description, due date, priority)
- Update status: `todo` → `inprogress` → `done`
- Delete task
- View tasks per project

---

### 🔒 Permissions
- Owner: full control
- Others: view only

---

## 🧱 Tech Stack

### Frontend
- React (Hooks)
- CSS
- Fetch API

### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

---

## 📂 Project Structure

```txt
frontend/
  App.jsx
  ProjectList.jsx
  ProjectsForm.jsx

backend/
  routes/
    auth.js
    projects.js
    tasks.js
  middleware/
    mauth.js
  config/
    db.js
```

---

## ⚙️ Installation

### 1. Clone

```bash
git clone <your-repo-url>
cd project-folder
```

---

### 2. Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=3000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
```

Run:

```bash
npm run dev
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🗄️ Database

### Users
```sql
id
username
email
password_hash
```

### Projects
```sql
id
name
description
color
user_id
```

### Tasks
```sql
id
name
description
status
priority
due_date
project_id
user_id
```

---

## 🔐 API

### Auth
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Projects
```http
GET    /api/projects
POST   /api/projects
PATCH  /api/projects/:id/edit
DELETE /api/projects/:id/delete
```

### Tasks
```http
GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks
PATCH  /api/projects/:projectId/tasks/:taskId/edit
DELETE /api/projects/:projectId/tasks/:taskId/delete
```

---

## 🧠 Key Concepts
- useState / useEffect
- Conditional rendering
- Role-based UI
- REST API
- Optimistic updates

---


---

## 👨‍💻 Author
Full-stack learning project
