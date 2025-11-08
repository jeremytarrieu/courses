// /static/js/services/AuthService.js
export class AuthService {
    constructor() {
        this.TOKEN_KEY = 'token';
    }

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    setToken(value) {
        localStorage.setItem(this.TOKEN_KEY, value);
    }

    clearToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    async login(password) {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password})
        });

        if (!response.ok) {
            throw new Error('Mot de passe incorrect');
        }

        const data = await response.json();
        this.setToken(data);
        return data;
    }

    async fetchWithAuth(url, options = {}) {
        const token = this.getToken();

        if (!token) {
            throw new Error('No token available');
        }

        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(url, options);

        if (response.status === 401) {
            this.clearToken();
            throw new Error('Unauthorized');
        }

        return response;
    }
}