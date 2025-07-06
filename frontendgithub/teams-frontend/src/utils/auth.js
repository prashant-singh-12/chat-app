import { jwtDecode } from 'jwt-decode';

// Save token and decoded values (username + email) to localStorage
export const saveToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        const username = decoded.username || ''; // or use 'name' if backend sends it
        const email = decoded.sub || decoded.email || ''; // fallback to 'sub' or 'email'

        const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

        localStorage.setItem('token', token);
        localStorage.setItem('username', capitalizedUsername);
        localStorage.setItem('email', email);
    } catch (err) {
        console.error('Failed to decode token during saveToken:', err);
    }
};

// Get username from localStorage (capitalized for display)
export function getUserNameFromToken() {
    return localStorage.getItem('username') || null;
}

// Get email from localStorage (for use in message routing)
export function getEmailFromToken() {
    return localStorage.getItem('email') || null;
}

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
};
