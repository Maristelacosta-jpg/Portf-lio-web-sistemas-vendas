document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productTableBody = document.querySelector('#productTable tbody');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');
    const totalValueEl = document.getElementById('totalValue');

    if (!productForm || !productTableBody || !productNameInput || !productPriceInput || !totalValueEl) {
        return;
    }

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    let products = [];

    function calculateTotal() {
        return products.reduce((sum, item) => sum + item.price, 0);
    }

    function updateTotalDisplay() {
        const total = calculateTotal();
        totalValueEl.textContent = currencyFormatter.format(total);
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
            const row = createProductRow(product);
            productTableBody.appendChild(row);
        });

        updateTotalDisplay();
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

        const newProduct = {
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
            name,
            price: numericPrice
        };

        products.push(newProduct);
        renderProducts();

        productForm.reset();
        productNameInput.focus();
    });

    updateTotalDisplay();
});
