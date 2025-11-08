// /static/js/components/LoginModal.js
export class LoginModal {
    constructor() {
        this.isVisible = false;
    }

    render() {
        return `
            <div id="passwordModal" class="modal" style="display: ${this.isVisible ? 'flex' : 'none'};">
                <div class="modal-content">
                    <h2>Connexion</h2>
                    <input type="password" id="passwordInput" placeholder="Mot de passe">
                    <div id="loginError" class="error-message"></div>
                    <button id="loginBtn">Se connecter</button>
                </div>
            </div>
        `;
    }

    attachEventListeners(onLogin) {
        const button = document.getElementById('loginBtn');
        const input = document.getElementById('passwordInput');

        button?.addEventListener('click', onLogin);
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onLogin();
            }
        });
    }

    show() {
        this.isVisible = true;
        const modal = document.getElementById('passwordModal');
        if (modal) modal.style.display = 'flex';
    }

    hide() {
        this.isVisible = false;
        const modal = document.getElementById('passwordModal');
        if (modal) modal.style.display = 'none';
        this.clearError();
    }

    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) errorDiv.textContent = message;
    }

    clearError() {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) errorDiv.textContent = '';
    }

    getPassword() {
        const input = document.getElementById('passwordInput');
        return input ? input.value : '';
    }

    clearPassword() {
        const input = document.getElementById('passwordInput');
        if (input) input.value = '';
    }
}