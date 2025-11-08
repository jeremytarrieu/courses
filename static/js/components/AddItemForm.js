// /static/js/components/AddItemForm.js
export class AddItemForm {
    render() {
        return `
            <div class="add-item">
                <input type="text" id="itemInput" placeholder="Ajouter un article...">
                <button id="addItemBtn">+</button>
            </div>
        `;
    }

    attachEventListeners(onAdd) {
        const input = document.getElementById('itemInput');
        const button = document.getElementById('addItemBtn');

        button.addEventListener('click', onAdd);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                onAdd();
            }
        });
    }
}