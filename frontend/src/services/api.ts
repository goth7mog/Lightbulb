import axios from 'axios';

// Determine the API URL based on environment (Docker vs local)
// Use explicit URL to avoid proxy issues
// const API_URL = import.meta.env.API_URL || 'http://localhost:8001/api';
const API_URL = import.meta.env.VITE_API_URL;

console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // // Increase timeout for slower connections
    // timeout: 15000,
    // Important: allow CORS
    withCredentials: false,
});

// Add request interceptor to inject token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method, config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.error('API Error:', error.message);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);

        // If error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const refreshResult = await refreshToken();
                const { access } = refreshResult;

                localStorage.setItem('accessToken', access);

                // Retry the original request
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log out user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const login = async (username: string, password: string) => {
    try {
        console.log('Login attempt for user:', username, 'to URL:', `${API_URL}/token/`);

        // Create a direct axios instance for login to avoid interceptors
        const loginResponse = await axios({
            method: 'post',
            url: `${API_URL}/token/`,
            data: { username, password },
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000,
            withCredentials: false, // Important for CORS
        });

        console.log('Login successful:', loginResponse.data);
        return loginResponse.data;
    } catch (error: any) {
        // Handle network errors specifically
        if (error.message.includes('Network Error')) {
            console.error('Network error during login:', error);
            throw new Error('Cannot connect to the server. Please check your internet connection and try again.');
        }

        // Handle other errors
        console.error('Login error details:', error);
        if (error.response) {
            if (error.response.status === 500) {
                throw new Error('Server error. The authentication service is currently unavailable. Please try again later.');
            } else if (error.response.status === 400 || error.response.status === 401) {
                throw new Error('Invalid username or password. Please try again.');
            }
        }

        throw new Error('Login failed. Please try again later.');
    }
};

export const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) throw new Error('No refresh token found');

    try {
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
        return response.data;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
};

// Accounts API

// TODO: Remove this mock function when backend is ready
export const createAccount = async (accountData: any) => {
    console.warn("Using mocked createAccount");

    return {
        id: Date.now().toString(),
        ...accountData,
    };
};

export const getAccounts = async () => {
    const response = await api.get('/accounts/');
    return response.data;
};

export const getAccount = async (id: string) => {
    const response = await api.get(`/accounts/${id}/`);
    return response.data;
};

export const getCurrentBalance = async (id: string) => {
    const response = await api.get(`/accounts/${id}/current_balance/`);
    return response.data;
};

export const toggleRoundUp = async (id: string) => {
    const response = await api.post(`/accounts/${id}/enable_roundup/`);
    return response.data;
};

export const reclaimRoundUp = async (id: string) => {
    const response = await api.post(`/accounts/${id}/reclaim_roundup/`);
    return response.data;
};

export const getSpendingTrends = async (id: string) => {
    const response = await api.get(`/accounts/${id}/spending_trends/`);
    return response.data;
};

// Transactions API
export const getTransactions = async () => {
    const response = await api.get('/transactions/');
    return response.data;
};

export const getAccountTransactions = async (accountId: string) => {
    const response = await api.get(`/transactions/account/${accountId}/`);
    return response.data;
};

export const createTransaction = async (transactionData: any) => {
    const response = await api.post('/transactions/', transactionData);
    return response.data;
};

export const getTop10Spenders = async () => {
    const response = await api.get('/transactions/top-10-spenders/');
    return response.data;
};

// Businesses API

//TODO: Remove this mock function when backend is ready
export const createBusiness = async (businessData: any) => {
    console.warn("Using mocked createBusiness");
    
    return {
        id: Date.now().toString(),
        ...businessData
    };
};


export const getBusinesses = async () => {
    const response = await api.get('/businesses/');
    return response.data;
};

export const getBusiness = async (id: string) => {
    const response = await api.get(`/businesses/${id}/`);
    return response.data;
};

export const updateBusinessSanction = async (id: string, sanctioned: boolean) => {
    const response = await api.patch(`/businesses/${id}/`, { sanctioned });
    return response.data;
};

export default api;
