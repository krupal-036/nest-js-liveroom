import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { ChatApp } from './components/ChatApp';
import { AuthPage } from './components/AuthPage';
import { AdminPanel } from './components/AdminPanel';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { LoadingScreen } from './components/LoadingScreen';

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/auth" replace />;
    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <LoadingScreen />;

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={user ? <Navigate to="/chat" replace /> : <AuthPage />} />
            <Route path="/chat" element={<ProtectedRoute><ChatApp /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AlertProvider>
                    <BrowserRouter>
                        <ScrollToTop />
                        <AppRoutes />
                    </BrowserRouter>
                </AlertProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;