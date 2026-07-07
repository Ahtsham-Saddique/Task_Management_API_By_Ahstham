# Task Management API

Node.js + Express + MongoDB (JWT cookie auth). Supports projects and tasks, plus admin pages.

---

## Features

- User registration and login
- JWT stored in **HttpOnly cookie** (`token`)
- User dashboard + admin dashboard (EJS pages)
- CRUD:
  - Projects (per logged-in user)
  - Tasks (per logged-in user, scoped to a project)
- Admin:
  - View/delete users
  - View/delete projects
  - View tasks for a user’s project and delete tasks

---

## Tech Stack

- Express
- EJS (server-side rendered pages)
- MongoDB + Mongoose
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- cookie-parser

---

## Environment Variables

Create a `.env` file in the project root.

Required:
- `JWT_SECRET` = a strong secret string
- `MONGODB_URI` (or your Mongo connection string as used in `config/db.js`)
- `PORT` (optional)

---

## Start the Server

```bash
npm install
npm start
```

Server defaults to `PORT=3000` if not set.

---

## Authentication Model (JWT cookie)

- **Login** (`POST /auth/login`) sets a cookie named:
  - `token` (HttpOnly)
- **Protected API** routes read the token from cookie:
  - `req.cookies.token`
- If token is missing/invalid:
  - `authMiddleware` returns **401 JSON**
  - `pageAuthMiddleware` redirects to `/login`

Important:
- The JWT is stored in the browser cookie; you do not pass it manually as an `Authorization` header.

---

## Base URLs

- Auth/JSON: `http://localhost:PORT/auth/...`
- User APIs: `http://localhost:PORT/projects/...` and `http://localhost:PORT/tasks/...`
- Pages:
  - `http://localhost:PORT/dashboard`
  - `http://localhost:PORT/admin/dashboard`

---

## Postman Setup

### 1) Login to get cookie
1. Call:
   - `POST /auth/login`
2. In Postman, enable cookie handling (default behavior usually works).
3. After login, subsequent requests should automatically include the `token` cookie.

### 2) Success vs Error behavior

- **Success** usually returns JSON like:
  - `success: true`
- **Auth errors**:
  - `401 { success:false, message:"Please Login First" }`
  - `401 { success:false, message:"Invalid Token" }`
- **Business errors** (not found, duplicates) return `success:false` and appropriate `message`.

---

## Routes (Test List)

### 1) Auth (NO JWT required)

#### Register
- **POST** `/auth/register`
- Body (JSON):
  ```json
  {
    "username": "string",
    "name": "string",
    "age": 18,
    "email": "user@example.com",
    "password": "string"
  }
  ```
- Success (201):
  - `success:true`
- Errors:
  - 400: `Email already exists`
  - 500: `Internal Server Error`

#### Login
- **POST** `/auth/login`
- Body (JSON):
  ```json
  { "email": "user@example.com", "password": "string" }
  ```
- Success (200):
  - `success:true`
  - sets `token` cookie
  - includes `redirect` (`/admin/dashboard` or `/dashboard`)
- Errors (401):
  - `Invalid Email or Password`

#### Logout
- **GET** `/auth/logout`
- Success:
  - redirects to `/login`
  - clears `token` cookie

---

### 2) Page Routes (JWT required)

These are browser pages rendered with EJS.

#### Login page (NOT protected)
- **GET** `/login`

#### Register page (NOT protected)
- **GET** `/register`

#### User dashboard (JWT required)
- **GET** `/dashboard`
- If not authenticated/invalid token:
  - redirect to `/login`

#### Admin dashboard (JWT required + admin role)
- **GET** `/admin/dashboard`
- If not authenticated/invalid:
  - redirect to `/login`
- If authenticated but not admin:
  - `403 JSON`: `success:false, message:"Access Denied"`

---

### 3) Projects API (JWT required)

> Protected by `authMiddleware` (JWT from cookie).

#### Create project
- **POST** `/projects/`
- Body (JSON):
  ```json
  {
    "title": "Project title",
    "stack": "JS/Node",
    "instruction": "Some instructions",
    "deadline": "2026-01-01"
  }
  ```
- Success (201): `success:true`
- Errors:
  - 401: `Please Login First` / `Invalid Token`

#### Get all projects (for logged-in user)
- **GET** `/projects/`
- Optional query:
  - `page`, `limit`, `search`
- Success:
  - `success:true`, `projects:[...]`
- Errors:
  - 401 auth errors

#### Get single project
- **GET** `/projects/:id`
- Success (200): `success:true`
- Errors:
  - 404: `Project Not Found`

#### Update project
- **PUT** `/projects/:id`
- Body: any updatable fields (same as model fields)
- Success (200): `success:true`
- Errors:
  - 404: `Project Not Found`

#### Delete project
- **DELETE** `/projects/:id`
- Success:
  - `success:true`, `message:"Project And Its Tasks Deleted"`
- Errors:
  - 404: `Project Not Found`

---

### 4) Tasks API (JWT required)

#### Create task
- **POST** `/tasks/:projectId`
- Body (JSON):
  ```json
  {
    "taskName": "Task 1",
    "description": "Details...",
    "completed": false
  }
  ```
- Success (201): `success:true`
- Errors:
  - 404: `Project Not Found`

#### Get tasks for a project
- **GET** `/tasks/:projectId`
- Optional query:
  - `completed=true` or `completed=false`
- Success:
  - `success:true`, `tasks:[...]`

#### Update task
- **PUT** `/tasks/:taskId`
- Body: updatable fields
- Success:
  - `success:true`
- Errors:
  - 404: `Task Not Found`

#### Delete task
- **DELETE** `/tasks/:taskId`
- Success:
  - `success:true`, `message:"Task Deleted"`

---

### 5) Admin API / Admin Pages (JWT required + admin role)

> Protected by `pageAuthMiddleware` + `adminMiddleware`.

#### Users list (admin page)
- **GET** `/admin/users`
- Requires admin role.

#### Delete user
- **DELETE** `/admin/users/:id`
- Success: `success:true, message:"User Deleted"`
- Errors:
  - 400: cannot delete own account

#### Delete project (admin)
- **DELETE** `/admin/projects/:id`
- Success: either redirect (if referer exists) or JSON

#### Admin projects/tasks pages (EJS)
- **GET** `/admin/users/:id/projects`
- **GET** `/admin/projects/:id/tasks`

---

## Common Test Scenarios

### Unauthenticated request to protected API
1. Don’t login / don’t include cookie.
2. Call any of:
   - `GET /projects/`
   - `GET /tasks/:projectId`
3. Expect:
   - 401 JSON (`Please Login First` or `Invalid Token`)

### Authenticated request (after login)
1. Login via `POST /auth/login`
2. Re-test protected endpoints
3. Expect `success:true`

---

## Notes

- JWT is stored as an HttpOnly cookie named `token`.
- Logging out uses `/auth/logout` which clears the cookie and redirects to `/login`.

important:
For checking Admin dashborad use these credentails:
email:admin@gmail.com
password:admin123