# 🔌 Fitness Tracker API (Backend)

The powerhouse behind the Fitness Tracker Management System. This RESTful API handles authentication, data persistence, payment processing, real-time communication, and automated scheduling.

## 🛠 Tech Stack

*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Authentication**: JWT (JSON Web Tokens) & [bcryptjs](https://www.npmjs.com/package/bcryptjs)
*   **Payments**: [Stripe API](https://stripe.com/docs/api)
*   **Real-time**: [Socket.io](https://socket.io/)
*   **Email**: [Nodemailer](https://nodemailer.com/)
*   **Scheduling**: [node-cron](https://www.npmjs.com/package/node-cron)
*   **File Uploads**: [Multer](https://www.npmjs.com/package/multer)

---

## 📂 Directory Structure

```bash
backend/
├── config/
│   └── db.js              # MongoDB Connection Logic
├── controllers/           # Business Logic for Routes
│   ├── authController.js  # Login/Register
│   ├── trainerController.js
│   ├── financeController.js
│   └── ...
├── middleware/            # Custom Middleware
│   ├── authMiddleware.js  # Protect Routes (JWT verify)
│   ├── adminMiddleware.js # Admin role check
│   └── errorMiddleware.js
├── models/                # Mongoose Schemas
│   ├── User.js
│   ├── Session.js
│   ├── Payout.js
│   └── ...
├── routes/                # API Endpoints
│   ├── authRoutes.js
│   ├── sessionRoutes.js
│   ├── paymentRoutes.js
│   └── ...
├── uploads/               # Local storage for images
├── utils/                 # Helper functions (Email, Formats)
└── server.js              # Application Entry Point
```

---

## 🔑 Environment Variables

Create a `.env` file in the root of this directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/fitness_tracker

# Security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...

# Email Service (SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

---

## 📡 API Endpoints Overview

### Authentication
*   `POST /api/auth/register` - Register a new User.
*   `POST /api/auth/login` - Login User/Admin.
*   `POST /api/auth/trainer/login` - Login Trainer.

### User Management
*   `GET /api/users/profile` - Get current user profile.
*   `PUT /api/users/profile` - Update profile (bio, weight, etc).
*   `POST /api/users/upload` - Upload profile picture.

### Fitness Tracking
*   `POST /api/tracker/workouts` - Log a workout session.
*   `GET /api/tracker/dashboard` - Get daily stats (Calories, Water).
*   `POST /api/tracker/water` - Add water intake.

### Trainer & Sessions
*   `GET /api/sessions/my-sessions` - Get scheduled sessions (User/Trainer).
*   `POST /api/sessions` - Book a new session.
*   `GET /api/reviews/my-reviews` - Get trainer reviews.

### Finance (Trainer)
*   `GET /api/finance/stats` - Earnings overview.
*   `POST /api/finance/request-payout` - Withdraw funds.

---

## ⚡ Deployment

### Local Development
1.  Install dependencies: `npm install`
2.  Run with Nodemon: `npm run dev`

### Production
1.  Set `NODE_ENV=production`.
2.  Start server: `npm start`

---
**Developed by Mohammed Ansari**
