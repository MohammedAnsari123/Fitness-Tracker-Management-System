import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('trainerToken');
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get('http://localhost:5000/api/auth/me', config);
                    if (res.data.role === 'trainer' || res.data.role === 'admin') {
                        setTrainer(res.data);
                    } else {
                        localStorage.removeItem('trainerToken');
                        setTrainer(null);
                    }
                } catch (error) {
                    localStorage.removeItem('trainerToken', error);
                    setTrainer(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/trainer/login', { email, password });

        const token = res.data.token;
        localStorage.setItem('trainerToken', token);

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const userRes = await axios.get('http://localhost:5000/api/auth/me', config);

        if (userRes.data.role !== 'trainer' && userRes.data.role !== 'admin') {
            localStorage.removeItem('trainerToken');
            throw new Error("Access Denied: Trainer privileges required.");
        }

        setTrainer(userRes.data);
    };

    const register = async (name, email, password, specialization = 'General Fitness', bio = '') => {
        const res = await axios.post('http://localhost:5000/api/auth/trainer/register', {
            name, email, password, specialization, bio
        });

        const token = res.data.token;
        localStorage.setItem('trainerToken', token);
        setTrainer(res.data);
    };

    const logout = () => {
        localStorage.removeItem('trainerToken');
        setTrainer(null);
    };

    return (
        <AuthContext.Provider value={{ trainer, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
