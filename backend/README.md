# 🛠️ Backend Documentation - Fitness Tracker API

This directory contains the server-side application logic, database models, and API endpoints for the Fitness Tracker system.

## 📋 Table of Contents
1.  [Overview](#overview)
2.  [Dependencies](#dependencies)
3.  [Environment Variables](#environment-variables)
4.  [Folder Structure Details](#folder-structure-details)
5.  [API Reference](#api-reference)

---

## Overview

The backend is built with **Node.js** and **Express.js**. It communicates with a **MongoDB** database via **Mongoose** to store and retrieve data. It handles:
*   User Authentication & Authorization (JWT)
*   Data validation
*   Complex querying for statistics and history
*   File uploading logic (via Multer)

---

## Dependencies

Key libraries used in this project:

*   `express`: The web framework.
*   `mongoose`: MongoDB object modeling.
*   `dotenv`: Loading environment variables.
*   `cors`: Handling Cross-Origin Resource Sharing.
*   `bcryptjs`: Password hashing.
*   `jsonwebtoken` (JWT): Generating auth tokens.
*   `multer`: Handling `multipart/form-data` (file uploads).
*   `nodemon` (Dev): Auto-restarting server during development.

---

## Environment Variables

The application requires a `.env` file in the `backend` root.

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitness_tracker

# Security
JWT_SECRET=super_secure_random_string_here
```

---

## Folder Structure Details

*   **`config/`**: Contains `db.js` which handles the connection to MongoDB.
*   **`models/`**: Defines the data structure (Schema) for the application.
    *   `User.js`: User profile, password, email.
    *   `Workout.js`: Exercises, sets, reps, user reference.
    *   `Diet.js`: Meals logged by users.
    *   `Challenge.js`: Admin-created challenges.
*   **`controllers/`**: The logic layer. Each function here responds to a route.
    *   `authController.js`: Registration, Login.
    *   `trackerController.js`: CRUD for workouts, diet, etc.
    *   `adminController.js`: System wide stats and user management.
*   **`middleware/`**: Functions that run during the request cycle.
    *   `authMiddleware.js`: Verifies the JWT token and adds `req.user`.
    *   `errorMiddleware.js`: Centralized error handling.
*   **`routes/`**: Associates URLs (endpoints) with Controller functions.

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint    | Description               | Protected |
| :----- | :---------- | :------------------------ | :-------- |
| POST   | `/register` | Register a new user       | No        |
| POST   | `/login`    | Login and receive Token   | No        |
| GET    | `/me`       | Get current user details  | Yes       |

### 🏋️ Tracker (`/api/tracker`)

| Method | Endpoint     | Description               | Protected |
| :----- | :----------- | :------------------------ | :-------- |
| GET    | `/dashboard` | Get daily stats summary   | Yes       |
| GET    | `/workouts`  | Get user's workout log    | Yes       |
| POST   | `/workouts`  | Log a new workout         | Yes       |
| POST   | `/diet`      | Log a meal                | Yes       |
| POST   | `/water`     | Log water intake          | Yes       |
| GET    | `/history`   | Get full activity history | Yes       |

### 💬 Chat (`/api/chat`)

| Method | Endpoint         | Description               | Protected |
| :----- | :--------------- | :------------------------ | :-------- |
| POST   | `/send`          | Send a message            | Yes       |
| GET    | `/:otherId`      | Get chat history          | Yes       |
| GET    | `/conversations` | Get active conversations  | Yes       |

### 👥 Social (`/api/social`)

| Method | Endpoint         | Description               | Protected |
| :----- | :--------------- | :------------------------ | :-------- |
| POST   | `/follow/:id`    | Follow a user             | Yes       |
| GET    | `/feed`          | Get activity feed         | Yes       |
| GET    | `/leaderboard`   | Get user rankings         | Yes       |

### 🏋️‍♂️ Trainer (`/api/trainer`)

| Method | Endpoint         | Description               | Role      |
| :----- | :--------------- | :------------------------ | :-------- |
| GET    | `/clients`       | Get assigned clients      | Trainer   |
| POST   | `/program`       | Assign a program          | Trainer   |
| POST   | `/invite`        | Invite a new client       | Trainer   |

### 🛡️ Admin (`/api/admin`)

*Requires Admin Privileges*

| Method | Endpoint          | Description               |
| :----- | :---------------- | :------------------------ |
| GET    | `/stats`          | Global system stats       |
| GET    | `/users`          | List all users            |
| POST   | `/content/create` | Create exercise/food item |

---

## Running Locally

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev
```
