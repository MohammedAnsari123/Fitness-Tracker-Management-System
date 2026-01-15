import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';

import Templates from './pages/Templates';
import ExerciseLibrary from './pages/ExerciseLibrary';
import FoodDatabase from './pages/FoodDatabase';

import ChallengeManager from './pages/ChallengeManager';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="users" element={<UserList />} />
                        <Route path="users/:id" element={<UserDetail />} />

                        <Route path="templates" element={<Templates />} />
                        <Route path="exercises" element={<ExerciseLibrary />} />
                        <Route path="foods" element={<FoodDatabase />} />
                        <Route path="challenges" element={<ChallengeManager />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
