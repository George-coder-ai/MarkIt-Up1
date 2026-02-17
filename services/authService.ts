const API_URL = import.meta.env.VITE_API_URL || 'https://markitup-backend.onrender.com/api/auth';

export const authService = {
    async signup(userData: any) {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Signup failed');
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        return data;
    },

    async login(credentials: any) {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        return data;
    },

    async getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (!response.ok) {
            localStorage.removeItem('token');
            return null;
        }
        return data;
    },

    logout() {
        localStorage.removeItem('token');
    }
};
