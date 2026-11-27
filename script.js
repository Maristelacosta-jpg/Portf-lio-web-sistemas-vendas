document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'portfolio_vendas_produtos_v1';

    const productForm = document.getElementById('productForm');
    const productTableBody = document.querySelector('#productTable tbody');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const totalValueEl = document.getElementById('totalValue');
    const clearAllBtn = document.getElementById('clearAllBtn');

    if (!productForm || !productTableBody || !productNameInput || !productPriceInput || !totalValueEl) {
        return;
    }

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    function loadProducts() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (!savedData) return [];

            const parsed = JSON.parse(savedData);
            if (!Array.isArray(parsed)) return [];

            return parsed.filter(
                (item) =>
                    item &&
                    typeof item.id === 'string' &&
                    typeof item.name === 'string' &&
                    typeof item.price === 'number' &&
                    !Number.isNaN(item.price) &&
                    item.price > 0
            );
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            return [];
        }
    }

    function saveProducts(items) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Erro ao salvar produtos:', error);
        }
    }

    let products = loadProducts();

    function calculateTotal() {
        return products.reduce((sum, item) => sum + item.price, 0);
    }

    function updateTotalDisplay() {
        totalValueEl.textContent = currencyFormatter.format(calculateTotal());
    }

    function updateClearButtonState() {
        if (clearAllBtn) {
            clearAllBtn.disabled = products.length === 0;
        }
    }

    function createProductRow(product) {
        const newRow = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;

        const priceCell = document.createElement('td');
        priceCell.textContent = currencyFormatter.format(product.price);

        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');

        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', `Apagar ${product.name}`);
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i> Apagar';

        deleteBtn.addEventListener('click', () => {
            products = products.filter((item) => item.id !== product.id);
            renderProducts();
        });

        actionCell.appendChild(deleteBtn);
        newRow.append(nameCell, priceCell, actionCell);

        return newRow;
    }

    function renderProducts() {
        productTableBody.innerHTML = '';

        products.forEach((product) => {
            productTableBody.appendChild(createProductRow(product));
        });

        updateTotalDisplay();
        updateClearButtonState();
        saveProducts(products);
    }

    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (products.length === 0) return;

            const confirmed = confirm('Tem certeza de que deseja apagar todos os produtos?');
            if (!confirmed) return;

            products = [];
            localStorage.removeItem(STORAGE_KEY);
            renderProducts();
            productNameInput.focus();
        });
    }

    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = productNameInput.value.trim();
        const rawPrice = productPriceInput.value.replace(',', '.').trim();
        const numericPrice = Number(rawPrice);

        if (!name || rawPrice === '' || Number.isNaN(numericPrice) || numericPrice <= 0) {
            alert('Por favor, informe um nome válido e um preço maior que zero.');
            return;
        }

        products.push({
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
            name,
            price: numericPrice
        });

        renderProducts();
        productForm.reset();
        productNameInput.focus();
    });

    renderProducts();
});
