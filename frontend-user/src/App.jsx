import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Diet from './pages/Diet';
import Water from './pages/Water';
import Sleep from './pages/Sleep';
import Weight from './pages/Weight';
import Goals from './pages/Goals';
import MyPlan from './pages/MyPlan';
import History from './pages/History';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import Gallery from './pages/Gallery';
import Analytics from './pages/Analytics';
import Social from './pages/Social';
import Tools from './pages/Tools';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import AIGenerator from './pages/AIGenerator';
import Wearables from './pages/Wearables';
import Support from './pages/Support';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="social" element={<Social />} />
                        <Route path="workouts" element={<Workouts />} />
                        <Route path="diet" element={<Diet />} />
                        <Route path="water" element={<Water />} />
                        <Route path="sleep" element={<Sleep />} />
                        <Route path="weight" element={<Weight />} />
                        <Route path="goals" element={<Goals />} />
                        <Route path="plans" element={<MyPlan />} />
                        <Route path="tools" element={<Tools />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="ai-coach" element={<AIGenerator />} />
                        <Route path="wearables" element={<Wearables />} />
                        <Route path="challenges" element={<Challenges />} />
                        <Route path="support" element={<Support />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="history" element={<History />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
