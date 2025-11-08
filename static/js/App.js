// /static/js/App.js
import { AuthService } from './services/AuthService.js';
import { ItemService } from './services/ItemService.js';
import { UIManager } from './components/UIManager.js';

class ShoppingListApp {
    constructor() {
        this.RELOAD_INTERVAL = 10000;
        this.authService = new AuthService();
        this.itemService = new ItemService(this.authService);
        this.ui = new UIManager();
        this.reloadInterval = null;
    }

    init() {
        // Initialiser l'UI
        this.ui.init();

        // Attacher les event handlers
        this.ui.attachEventListeners({
            onLogin: () => this.login(),
            onAddItem: () => this.addItem(),
            onToggleItem: (name) => this.toggleItem(name),
            onDeleteItem: (name) => this.deleteItem(name),
            onDeleteAll: () => this.deleteAllItems()
        });

        // Vérifier l'authentification
        if (this.authService.isAuthenticated()) {
            this.ui.hideModal();
            this.loadItems();
            this.startAutoReload();
        } else {
            this.ui.showModal();
        }
    }

    async login() {
        const password = this.ui.getPasswordInput();
        this.ui.clearLoginError();

        try {
            await this.authService.login(password);
            this.ui.hideModal();
            this.ui.clearPasswordInput();
            this.loadItems();
            this.startAutoReload();
        } catch (error) {
            console.error('Erreur de connexion:', error);
            this.ui.showLoginError(
                error.message === 'Mot de passe incorrect'
                    ? 'Mot de passe incorrect.'
                    : 'Erreur réseau. Réessayez.'
            );
        }
    }

    async addItem() {
        const name = this.ui.getItemInput();
        if (!name) return;

        try {
            await this.itemService.addItem(name);
            this.ui.clearItemInput();
            this.loadItems();
        } catch (error) {
            this.handleError(error);
        }
    }

    async toggleItem(name) {
        try {
            await this.itemService.toggleItem(name);
            this.loadItems();
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteItem(name) {
        try {
            await this.itemService.deleteItem(name);
            this.loadItems();
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteAllItems() {
        // if (!confirm('Supprimer tous les articles ?')) return;

        try {
            await this.itemService.deleteAllItems();
            this.loadItems();
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadItems() {
        try {
            const items = await this.itemService.getItems();
            this.ui.renderItems(items);
        } catch (error) {
            this.handleError(error);
        }
    }

    startAutoReload() {
        if (this.reloadInterval) {
            clearInterval(this.reloadInterval);
        }
        this.reloadInterval = setInterval(() => this.loadItems(), this.RELOAD_INTERVAL);
    }

    stopAutoReload() {
        if (this.reloadInterval) {
            clearInterval(this.reloadInterval);
            this.reloadInterval = null;
        }
    }

    handleError(error) {
        console.error('Erreur:', error);
        if (error.message === 'Unauthorized' || error.message === 'No token available') {
            this.stopAutoReload();
            this.ui.showModal();
        }
    }
}

// Initialiser l'application
const app = new ShoppingListApp();
document.addEventListener('DOMContentLoaded', () => app.init());