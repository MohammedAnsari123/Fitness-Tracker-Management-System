# 🛡️ Admin Portal (Frontend)

The command center for the Fitness Tracker Management System. Allows super-users to oversee operations, moderate content, and manage users.

## 🛠 Tech Stack

*   **Framework**: [React.js](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Reports**: jspdf & jspdf-autotable
*   **Charts**: Recharts
*   **Icons**: Lucide React

---

## ✨ Features

### 👥 User & Trainer Management
*   **User Directory**: View, edit, or delete any user account.
*   **Trainer Approval**: Verify and activate new trainer accounts.
*   **Ban System**: Suspend users violating platform rules.
*   **Export Data**: Generate PDFs of user lists.

### 📚 Content Management (CMS)
*   **Exercise Library**: Add, edit, or remove exercises from the global database.
*   **Food Database**: Manage nutritional information.
*   **Challenges**: Create system-wide community challenges.

### 📢 Communications
*   **Push Notifications**: Broadcast messages to all users/trainers.
*   **Support Tickets**: View and resolve helpdesk requests.

### 📈 Analytics & Finance
*   **System Health**: Dashboard showing active users, growth rates, and retention.
*   **Financial Oversight**: View all Stripe transactions and subscription statuses.

---

## 📂 Project Structure

```bash
frontend-admin/
├── src/
│   ├── components/       # UI Components
│   │   ├── Layout.jsx
│   │   ├── StatCard.jsx
│   │   └── ...
│   ├── pages/            # Admin Screens
│   │   ├── UserList.jsx
│   │   ├── TrainerList.jsx
│   │   ├── Exercises.jsx
│   │   └── ...
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
1.  Navigate to directory: `cd frontend-admin`
2.  Install dependencies: `npm install`
3.  Start development server: `npm run dev`
4.  Open `http://localhost:5175`

---
**Developed by Mohammed Ansari**
