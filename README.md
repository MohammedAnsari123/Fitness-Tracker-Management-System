# 🏋️ Fitness Tracker Management System - System Documentation

**Version:** 1.0.0
**Status:** In Development
**License:** ISC

---

## 📖 Table of Contents
1.  [Project Overview](#-project-overview)
2.  [System Architecture](#-system-architecture)
3.  [Core Features](#-core-features)
4.  [Technology Stack](#-technology-stack)
5.  [Installation & Setup Guide](#-installation--setup-guide)
6.  [Directory Structure](#-directory-structure)
7.  [API Documentation Overview](#-api-documentation-overview)
8.  [Contribution Guidelines](#-contribution-guidelines)

---

## 🚀 Project Overview

The **Fitness Tracker Management System** is a robust, full-stack web application designed to bridge the gap between personal fitness tracking and administrative management. It serves two distinct user groups:
1.  **Fitness Enthusiasts**: Individuals who want to track their workouts, diet, hydration, sleep, and physical progress.
2.  **Administrators/Trainers**: System managers who curate exercise content, manage nutritional databases, oversee user challenges, and monitor system usage.

This project utilizes the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) to deliver a seamless, responsive, and real-time experience.

---

## 🏗 System Architecture

The application is built on a **Monorepo-style** structure with a separated frontend and backend approach, ensuring loosely coupled components for better scalability.

### High-Level Architecture
*   **Client Layer**:
    *   **Frontend-User**: React Application for end-users. Accesses the API to log data and view personal stats.
    *   **Frontend-Admin**: React Application for admins. Accesses the API to manage content and view global stats.
*   **Service Layer (Backend)**:
    *   **Express Server**: Handles all HTTP requests, business logic, authentication, and validation.
    *   **REST API**: Exposes endpoints for data retrieval and manipulation.
*   **Data Layer**:
    *   **MongoDB**: NoSQL database for flexible data storage (Users, Workouts, Exercises, etc.).
    *   **Cloudinary/Local Storage**: For storing image assets (Profile pictures, Gallery).

---

## ✨ Core Features

### 👤 User Portal (Frontend-User)
Designed for motivation and ease of use.
*   **Dashboard**: A summary view of daily logging status (Calories, Water, Sleep) and recent activity.
*   **Workout Tracker**:
    *   Custom Workout Logging (Sets, Reps, Weight).
    *   Duration Timer.
    *   Access to Global Exercise Library.
*   **Nutrition Manager**:
    *   Search Food Database.
    *   Log meals (Breakfast, Lunch, Dinner, Snacks).
    *   Calorie & Macro tracking.
*   **Vital Tracking**:
    *   **Hydration**: Tap to log water glasses.
    *   **Sleep**: Log sleep duration and quality.
    *   **Weight**: Track body weight changes with history.
*   **Social Hub**:
    *   **Community Feed**: See friends' activities.
    *   **Leaderboards**: Compete on XP and achievements.
    *   **Direct Messaging**: Real-time chat with Trainers.
*   **Analytics & Gamification**:
    *   **Badges**: Earn rewards for consistency.
    *   **PR Tracking**: Monitor Personal Records.
    *   **1RM Calculator**: Estimate max strength.

### 🏋️‍♂️ Trainer Portal (Frontend-Trainer)
Designed for coaching and client management.
*   **Client Management**: List of assigned clients with quick stats.
*   **Program Builder**: Create and assign custom Workout and Diet plans.
*   **Chat System**: Direct communication with clients.
*   **Content Creation**: Add custom exercises and templates.

### 🛡️ Admin Portal (Frontend-Admin)
Designed for content curation and user oversight.
*   **System Dashboard**: Global counts of users, workouts logged, and system health.
*   **Content Management Systems (CMS)**:
    *   **Exercise Library**: Add/Update/Delete standard exercises (e.g., "Bench Press", "Squat").
    *   **Food Database**: Manage nutritional info for common foods.
    *   **Workout Templates**: Create "Day 1" or "Full Body" templates for users.
*   **User Management**: View user list, detailed profiles, and activity logs.
*   **Challenge Management**: Create, Edit, and Delete system-wide challenges.

---

## 🛠 Technology Stack

### Backend
*   **Runtime**: Node.js (v18+)
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Authentication**: JSON Web Tokens (JWT), bcryptjs
*   **Middleware**: CORS, Dotenv, Multer (File Uploads)

### Frontend (User & Admin)
*   **Library**: React.js (v18)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **HTTP Client**: Axios
*   **Routing**: React Router DOM (v6)

---

## 📂 Directory Structure

A high-level view of the project:

```bash
New Fitness Tracker/
├── backend/                  # The API Server
│   ├── config/               # DB Connection logic
│   ├── controllers/          # Business logic for requests
│   ├── models/               # Mongoose Schemas (User, Workout, etc.)
│   ├── routes/               # API Endpoint Definitions
│   └── server.js             # Entry Point
├── frontend-user/            # User React App
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth State)
│   │   ├── pages/            # View/Screen Components
│   │   └── App.jsx           # Main Router
└── frontend-admin/           # Admin React App
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
```

---

## ⚙️ Installation & Setup Guide

### Prerequisites
1.  **Node.js**: Ensure Node.js is installed.
2.  **MongoDB**: A local instance or a connection string to MongoDB Atlas.

### Step 1: Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Variables**: Create a `.env` file in `backend/`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/fitness_tracker
    JWT_SECRET=your_super_secret_key_123
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```
    *Server should run on http://localhost:5000*

### Step 2: Frontend-User Setup
1.  Open a new terminal.
2.  Navigate to the folder:
    ```bash
    cd frontend-user
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the app:
    ```bash
    npm run dev
    ```
    *App should open at http://localhost:5173* (or similar)

### Step 3: Frontend-Admin Setup
1.  Open a new terminal.
2.  Navigate to the folder:
    ```bash
    cd frontend-admin
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the app:
    ```bash
    npm run dev
    ```
    *App should open at http://localhost:5174* (check terminal for exact port)

---

## � API Documentation Overview

The backend exposes a RESTful API. For full details, see the `backend/README.md`.

*   `POST /api/auth/register` - Create a new user.
*   `POST /api/auth/login` - Authenticate user & get Token.
*   `GET /api/tracker/dashboard` - Get user stats.
*   `POST /api/tracker/workouts` - Log a workout.

---

## 🤝 Contribution Guidelines

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
**Developed by [Your Name/Team]**
