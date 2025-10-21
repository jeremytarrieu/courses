const reloadItemsInterval = 10000

function getToken() {
    return localStorage.getItem('token');
}

function setToken(value) {
    localStorage.setItem('token', value);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
        showModal();
    } else {
        hideModal();
        loadItems();
        setInterval(loadItems, reloadItemsInterval);
    }

    // Ajout d'un article
    document.getElementById('itemInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });

});

// Affichage du modal
function showModal() {
    document.getElementById('passwordModal').style.display = 'flex';
}

// Masquage du modal
function hideModal() {
    document.getElementById('passwordModal').style.display = 'none';
}

// Connexion
async function login() {
    const password = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = ''; // reset

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({password})
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setToken(data)
            hideModal();
            loadItems();
        } else {
            errorDiv.textContent = 'Mot de passe incorrect.';
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        errorDiv.textContent = 'Erreur réseau. Réessayez.';
    }
}

// Requête avec authentification
async function fetchWithAuth(url, options = {}) {
    let token = getToken();
    console.log('token', token);
    if (!token) {
        showModal();
        throw new Error('No token available');
    }
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
        showModal();
        throw new Error('');
    }

    return response;
}

async function addItem() {
    const input = document.getElementById('itemInput');
    const name = input.value.trim();
    if (!name) return;

    try {
        const response = await fetchWithAuth('/api/items/add', {
            method: 'POST',
            body: JSON.stringify({name})
        });

        if (response.ok) {
            input.value = '';
            loadItems();
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function toggleItem(name) {
    try {
        await fetchWithAuth('/api/items/toggle', {
            method: 'POST',
            body: JSON.stringify({name})
        });
        loadItems();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function deleteItem(name) {
    try {
        await fetchWithAuth('/api/items/delete', {
            method: 'POST',
            body: JSON.stringify({name})
        });
        loadItems();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function deleteAllItems() {
    if (!confirm('Supprimer tous les articles ?')) return;

    try {
        await fetchWithAuth('/api/items/deleteAll', {
            method: 'GET'
        });
        loadItems();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function loadItems() {
    try {
        const response = await fetchWithAuth('/api/items');
        const items = await response.json();

        const itemsList = document.getElementById('itemsList');

        if (items.length === 0) {
            itemsList.innerHTML = '<div class="empty-state"><p>Aucun article pour le moment</p><p>Ajoutez votre premier article !</p></div>';
        } else {
            // Trier les items : non cochés d'abord
            items.sort((a, b) => a.checked - b.checked);

            itemsList.innerHTML = items.map(item =>
                '<div class="item ' + (item.checked ? 'checked' : '') + '">' +
                '<input type="checkbox" ' + (item.checked ? 'checked' : '') + ' onchange="toggleItem(\'' + item.name + '\')">' +
                '<div class="item-content">' +
                '<div class="item-name">' + item.name + '</div>' +
                '</div>' +
                '<button class="delete-btn" onclick="deleteItem(\'' + item.name + '\')">✕</button>' +
                '</div>'
            ).join('');
        }

        const total = items.length;
        const checked = items.filter(i => i.checked).length;
        document.getElementById('stats').textContent = total + ' article(s) - ' + checked + ' acheté(s)';

    } catch (error) {
        console.error('Erreur:', error);
    }
}