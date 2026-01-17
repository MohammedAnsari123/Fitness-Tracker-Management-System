import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const res = await axios.get('http://localhost:5000/api/auth/me', config);
                    setAdmin(res.data);
                } catch (error) {
                    localStorage.removeItem('adminToken');
                    setAdmin(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/admin/login', { email, password });
        localStorage.setItem('adminToken', res.data.token);
        setAdmin(res.data);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
