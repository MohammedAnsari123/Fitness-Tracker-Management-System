import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Programs from './pages/Programs';
import ProgramBuilder from './pages/ProgramBuilder';
import ClientProgress from './pages/ClientProgress';
import Exercises from './pages/Exercises';
import Nutrition from './pages/Nutrition';
import Templates from './pages/Templates';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id/progress" element={<ClientProgress />} />
            <Route path="programs" element={<Programs />} />
            <Route path="programs/:id" element={<ProgramBuilder />} />
            <Route path="exercises" element={<Exercises />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="templates" element={<Templates />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
