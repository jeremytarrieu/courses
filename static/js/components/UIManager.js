// /static/js/components/UIManager.js
import { Header } from './Header.js';
import { AddItemForm } from './AddItemForm.js';
import { ItemsList } from './ItemsList.js';
import { Stats } from './Stats.js';
import { LoginModal } from './LoginModal.js';

export class UIManager {
    constructor() {
        this.header = new Header();
        this.addItemForm = new AddItemForm();
        this.itemsList = new ItemsList();
        this.stats = new Stats();
        this.loginModal = new LoginModal();

        this.currentItems = [];
    }

    init() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="container">
                ${this.header.render()}
                ${this.addItemForm.render()}
                <div id="itemsListContainer"></div>
                <div id="statsContainer"></div>
            </div>
            ${this.loginModal.render()}
        `;
    }

    attachEventListeners(handlers) {
        this.addItemForm.attachEventListeners(handlers.onAddItem);
        this.loginModal.attachEventListeners(handlers.onLogin);
        this.itemsList.attachEventListeners(handlers.onToggleItem, handlers.onDeleteItem);
    }

    showModal() {
        this.loginModal.show();
    }

    hideModal() {
        this.loginModal.hide();
    }

    showLoginError(message) {
        this.loginModal.showError(message);
    }

    clearLoginError() {
        this.loginModal.clearError();
    }

    getPasswordInput() {
        return this.loginModal.getPassword();
    }

    clearPasswordInput() {
        this.loginModal.clearPassword();
    }

    getItemInput() {
        const input = document.getElementById('itemInput');
        return input ? input.value.trim() : '';
    }

    clearItemInput() {
        const input = document.getElementById('itemInput');
        if (input) input.value = '';
    }

    renderItems(items) {
        this.currentItems = items;

        const itemsContainer = document.getElementById('itemsListContainer');
        const statsContainer = document.getElementById('statsContainer');

        if (itemsContainer) {
            itemsContainer.innerHTML = this.itemsList.render(items);
            this.itemsList.attachEventListeners(
                this.itemsList.onToggle,
                this.itemsList.onDelete
            );
        }

        if (statsContainer) {
            statsContainer.innerHTML = this.stats.render(items);
        }
    }
}