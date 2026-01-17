# 🏋️‍♂️ Trainer Portal (Frontend)

The professional dashboard for Fitness Trainers to manage clients, creates schedules, and track business performance.

## 🛠 Tech Stack

*   **Framework**: [React.js](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Scheduling**: [react-calendar](https://www.npmjs.com/package/react-calendar)
*   **Date Mgmt**: date-fns
*   **Reports**: jspdf & jspdf-autotable
*   **Charts**: Recharts
*   **Icons**: Lucide React

---

## ✨ Features

### 👥 Client Management
*   **Client List**: Searchable list of all active clients.
*   **Deep Dive**: View client's specific logs (Food, Workout, Sleep).
*   **PDF Export**: Download detailed progress reports for offline review.

### 📅 Scheduling & Sessions
*   **Calendar System**: Visual calendar to manage availability.
*   **Session Booking**: Schedule "Video Call" or "In-Person" sessions.
*   **Upcoming**: List of impending appointments.

### 📝 Program Builder
*   **Workout Plans**: Create daily/weekly routines.
*   **Rest Days**: Explicit flags for recovery days.
*   **Diet Plans**: Assign macro goals and meal suggestions.

### 💰 Finance Dashboard
*   **Earnings**: View total revenue and pending payouts.
*   **Charts**: Monthly income visualization.
*   **Payouts**: Request withdrawals to connected accounts.

### ⭐️ Profile & Reputation
*   **Reviews**: See feedback and ratings from clients.
*   **Profile Editor**: Update specializations and bio.

---

## 📂 Project Structure

```bash
frontend-trainer/
├── src/
│   ├── components/       # Reusable UI
│   │   ├── ExportButton.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── pages/            # Application Screens
│   │   ├── Clients.jsx
│   │   ├── Schedule.jsx
│   │   ├── Finance.jsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx
│   └── App.jsx
├── index.html
└── tailwind.config.js
```

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v18+
*   Backend Server running on port 5000

### Installation
1.  Navigate to directory: `cd frontend-trainer`
2.  Install dependencies: `npm install`
3.  Start development server: `npm run dev`
4.  Open `http://localhost:5174`

---
**Developed by Mohammed Ansari**
