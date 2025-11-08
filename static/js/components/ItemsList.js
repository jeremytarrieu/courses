// /static/js/components/ItemsList.js
export class ItemsList {
    constructor() {
        this.onToggle = null;
        this.onDelete = null;
    }

    render(items) {
        if (items.length === 0) {
            return `
                <div class="items-list">
                    <div class="empty-state">
                        <p>Aucun article</p>
                    </div>
                </div>
            `;
        }

        // Trier les items : non cochés d'abord
        const sortedItems = [...items].sort((a, b) => a.checked - b.checked);

        return `
            <div class="items-list">
                ${sortedItems.map(item => this.renderItem(item)).join('')}
            </div>
        `;
    }

    renderItem(item) {
        return `
            <div class="item ${item.checked ? 'checked' : ''}" data-item-name="${this.escapeHtml(item.name)}">
                <input type="checkbox" 
                       class="item-checkbox"
                       ${item.checked ? 'checked' : ''}>
                <div class="item-content">
                    <div class="item-name">${this.escapeHtml(item.name)}</div>
                </div>
                <button class="delete-btn item-delete"/>
            </div>
        `;
    }

    attachEventListeners(onToggle, onDelete) {
        this.onToggle = onToggle;
        this.onDelete = onDelete;

        // Event delegation pour les checkboxes
        document.querySelector('.items-list')?.addEventListener('change', (e) => {
            if (e.target.classList.contains('item-checkbox')) {
                const itemElement = e.target.closest('.item');
                const itemName = itemElement.dataset.itemName;
                this.onToggle(itemName);
            }
        });

        // Event delegation pour les boutons supprimer
        document.querySelector('.items-list')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('item-delete')) {
                const itemElement = e.target.closest('.item');
                const itemName = itemElement.dataset.itemName;
                this.onDelete(itemName);
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}