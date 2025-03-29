import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, refreshToken } from '../services/api';

interface AuthContextType {
    user: any | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => { },
    logout: () => { },
    isLoading: true,
    error: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('accessToken');

            if (storedUser && storedToken) {
                try {
                    setUser(JSON.parse(storedUser));
                    // Validate the token
                    await refreshToken();
                } catch (error) {
                    console.error('Token refresh failed during init', error);
                    logout();
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('AuthContext: Attempting login for', username);
            const response = await apiLogin(username, password);
            console.log('AuthContext: Login successful, setting tokens');

            // Store tokens
            localStorage.setItem('accessToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);

            // Create a simple user object
            const currentUser = { username };
            setUser(currentUser);
            localStorage.setItem('user', JSON.stringify(currentUser));

            return response;
        } catch (error: any) {
            console.error('Login failed in AuthContext:', error);
            setError(error.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            isLoading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};
