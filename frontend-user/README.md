# 👤 User Portal (Frontend)

The client-facing application for the Fitness Tracker System. Designed for users to track their health journey, communicate with trainers, and manage their subscriptions.

## 🛠 Tech Stack

*   **Framework**: [React.js](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: React Router DOM
*   **State Management**: Context API
*   **HTTP Client**: Axios
*   **Payments**: @stripe/react-stripe-js
*   **Visualizations**: Recharts
*   **Icons**: Lucide React

---

## ✨ Features

### 📊 Dashboard
*   **Daily Overview**: Visual progress bars for Calories, Protein, Water, and Sleep.
*   **Upcoming Sessions**: Widget showing the next scheduled Video/In-Person session.
*   **Activity Feed**: Recent workouts and achievements.

### 💪 Workout Tracker
*   **Log Workout**: Interface to record sets, reps, and weights.
*   **AI Recommendations**: "Smart" suggestions based on past performance.
*   **History**: Calendar view of past activity.

### 🍎 Nutrition & Health
*   **Food Logger**: Database search for tracking meals.
*   **Water Tracker**: Simple tap-to-add interface.
*   **Body Metrics**: Weight and BMI tracking charts.

### 🤝 Social & Profile
*   **Rate Trainer**: Give star ratings and reviews to assigned trainers.
*   **Chat**: Real-time messaging implementation.
*   **Premium**: Stripe integration for upgrading subscription tiers.

---

## 📂 Project Structure

```bash
frontend-user/
├── src/
│   ├── assets/           # Static Images/Icons
│   ├── components/       # Reusable UI Components
│   │   ├── Navbar.jsx
│   │   ├── PaymentModal.jsx
│   │   └── ...
│   ├── context/          # Context Providers
│   │   └── AuthContext.jsx
│   ├── pages/            # Page Views
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Workouts.jsx
│   │   └── ...
│   ├── App.jsx           # Main Router
│   └── main.jsx          # Entry Point
├── index.html
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v18+
*   Backend Server running on port 5000

### Installation
1.  Navigate to directory: `cd frontend-user`
2.  Install dependencies: `npm install`
3.  Start development server: `npm run dev`
4.  Open `http://localhost:5173`

---
**Developed by Mohammed Ansari**
