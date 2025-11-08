// /static/js/services/ItemService.js
export class ItemService {
    constructor(authService) {
        this.authService = authService;
    }

    async getItems() {
        const response = await this.authService.fetchWithAuth('/api/items');
        return await response.json();
    }

    async addItem(name) {
        const response = await this.authService.fetchWithAuth('/api/items/add', {
            method: 'POST',
            body: JSON.stringify({name})
        });
        return response.ok;
    }

    async toggleItem(name) {
        const response = await this.authService.fetchWithAuth('/api/items/toggle', {
            method: 'POST',
            body: JSON.stringify({name})
        });
        return response.ok;
    }

    async deleteItem(name) {
        const response = await this.authService.fetchWithAuth('/api/items/delete', {
            method: 'POST',
            body: JSON.stringify({name})
        });
        return response.ok;
    }

    async deleteAllItems() {
        const response = await this.authService.fetchWithAuth('/api/items/deleteAll', {
            method: 'GET'
        });
        return response.ok;
    }
}