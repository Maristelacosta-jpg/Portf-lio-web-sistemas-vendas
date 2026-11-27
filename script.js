document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productTableBody = document.querySelector('#productTable tbody');
    const productNameInput = document.getElementById('productName');
    const productPriceInput = document.getElementById('productPrice');

    if (!productForm || !productTableBody || !productNameInput || !productPriceInput) {
        return;
    }

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    function createProductRow(name, formattedPrice) {
        const newRow = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = name;

        const priceCell = document.createElement('td');
        priceCell.textContent = formattedPrice;

        const actionCell = document.createElement('td');
        const deleteBtn = document.createElement('button');

        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.setAttribute('aria-label', `Apagar ${name}`);
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i> Apagar';

        deleteBtn.addEventListener('click', () => {
            newRow.remove();
        });

        actionCell.appendChild(deleteBtn);
        newRow.append(nameCell, priceCell, actionCell);

        return newRow;
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

        const formattedPrice = currencyFormatter.format(numericPrice);
        const newRow = createProductRow(name, formattedPrice);

        productTableBody.appendChild(newRow);
        productForm.reset();
        productNameInput.focus();
    });
});
