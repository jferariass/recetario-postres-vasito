// Menu Dinámico - App Core
document.addEventListener('DOMContentLoaded', () => {
    console.log('Menu Dinámico: App Initialized');

    // --- STATE ---
    let cart = [];
    const products = [
        { id: 1, name: 'Gourmet Burger Pro', price: 8500, desc: 'Double beef, cheddar cheese, caramelized onions...' },
        { id: 2, name: 'Truffle Pizza', price: 12200, desc: 'Artisanal dough, mozzarella, truffle oil...' }
    ];

    // --- DOM ELEMENTS ---
    const loadingScreen = document.getElementById('loading-screen');
    const cartBar = document.getElementById('floating-cart');
    const cartView = document.getElementById('cart-view');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartCountLabel = cartBar.querySelector('.cart-count');
    const cartTotalLabel = cartBar.querySelector('.cart-total');
    const subtotalLabel = document.getElementById('cart-subtotal');
    const finalTotalLabel = document.getElementById('cart-final-total');

    // --- INITIALIZATION ---
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.classList.add('hidden'), 500);
        }
    }, 1500);

    // --- UI ACTIONS ---

    // Toggle Cart View
    cartBar.addEventListener('click', () => {
        cartView.classList.remove('hidden');
        renderCart();
    });

    closeCartBtn.addEventListener('click', () => {
        cartView.classList.add('hidden');
    });

    // Category Navigation
    const catPills = document.querySelectorAll('.cat-pill');
    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const active = document.querySelector('.cat-pill.active');
            if (active) active.classList.remove('active');
            pill.classList.add('active');
        });
    });

    // Add to Cart
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const btn = card.querySelector('.add-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(products[index]);

            // Animation
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => btn.style.transform = 'scale(1)', 100);
        });
    });

    // --- CORE LOGIC ---

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCartUI();
    }

    function updateCartUI() {
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

        cartCountLabel.innerText = totalItems;
        cartTotalLabel.innerText = `$${totalPrice.toLocaleString('es-AR')}`;

        if (totalItems > 0) {
            cartBar.style.display = 'flex';
        } else {
            cartBar.style.display = 'none';
        }

        // Update Summary
        subtotalLabel.innerText = `$${totalPrice.toLocaleString('es-AR')}`;
        finalTotalLabel.innerText = `$${totalPrice.toLocaleString('es-AR')}`;
    }

    function renderCart() {
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
            return;
        }

        cartItemsList.innerHTML = cart.map(item => `
            <div class="cart-item-row">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name} x${item.qty}</span>
                    <span class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-AR')}</span>
                </div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }

    // Global helper for inline onclick (simplified for demo)
    window.updateQty = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            updateCartUI();
            renderCart();
        }
    };
});
