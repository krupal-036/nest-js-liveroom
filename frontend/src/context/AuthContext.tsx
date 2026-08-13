import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../utils/getApiURL';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch(`${API_URL}users/me`, {
                credentials: 'include',
            });
            if (res.ok) {
                const storedUser = sessionStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error('Auth check failed');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        
        setUser(data.payload);
        sessionStorage.setItem('user', JSON.stringify(data.payload));
    };

    const signup = async (username: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role: 'user' }),
            credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
    };

    const logout = async () => {
        await fetch(`${API_URL}users/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
        sessionStorage.removeItem('user');
        localStorage.removeItem('joinedRoom');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};