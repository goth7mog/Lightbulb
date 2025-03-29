import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Accounts from './pages/Accounts';
import AccountDetail from './pages/AccountDetail';
import Transactions from './pages/Transactions';
import Businesses from './pages/Businesses';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial app loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <Header />
            <Container className="py-4">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/accounts" element={
                        <ProtectedRoute>
                            <Accounts />
                        </ProtectedRoute>
                    } />
                    <Route path="/accounts/:id" element={
                        <ProtectedRoute>
                            <AccountDetail />
                        </ProtectedRoute>
                    } />
                    <Route path="/transactions" element={
                        <ProtectedRoute>
                            <Transactions />
                        </ProtectedRoute>
                    } />
                    <Route path="/businesses" element={
                        <ProtectedRoute>
                            <Businesses />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Container>
        </AuthProvider>
    );
}

export default App;
