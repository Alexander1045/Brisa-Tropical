// Esperamos a que el HTML esté listo
document.addEventListener('DOMContentLoaded', () => {

    // ====== DATOS DE PRODUCTOS ======
    const products = [
        {
            id: 1,
            name: 'Raíz Viva',
            description: 'Perfume capilar que previene la caída y aporta brillo natural al cabello.',
            fullDescription: 'Formulado con ingredientes 100% naturales, Raíz Viva estimula el crecimiento del cabello mientras previene su caída. Ideal para cabellos débiles y quebradizos.',
            ingredients: 'Romero, Vitamina E, Manzanilla',
            benefits: ['Estimula crecimiento', 'Previene caída', 'Aporta brillo', 'Suavidad natural', 'Fortalece raíces'],
            price: 25000,
            image: 'https://raw.githubusercontent.com/Gon-p/Galery/refs/heads/main/IMG-20251018-WA0116.jpg',
            category: 'Fortalecimiento',
            rating: 4.8,
            reviews: 124,
            stock: 45
        },
        {
            id: 2,
            name: 'Brisa de Vida',
            description: 'Protege tu cabello de los rayos UV mientras le da un brillo espectacular.',
            fullDescription: 'Brisa de Vida ofrece protección solar natural para tu cabello, evitando el daño por rayos UV. Además, hidrata profundamente sin engrasar.',
            ingredients: 'Sábila, Vitamina E, Agua mineral',
            benefits: ['Protección UV', 'Hidratación profunda', 'Brillo natural', 'No engrasa', 'Aroma fresco'],
            price: 25000,
            image: 'https://raw.githubusercontent.com/Gon-p/Galery/refs/heads/main/IMG-20251018-WA0114.jpg',
            category: 'Protección',
            rating: 4.9,
            reviews: 156,
            stock: 32
        },
        {
            id: 3,
            name: 'Lágrima de Rosa',
            description: 'Hidrata y controla el frizz para un cabello suave y manejable.',
            fullDescription: 'Con extracto de rosas naturales, este perfume hidrata profundamente tu cabello mientras controla el frizz. Perfecto para cabellos secos y con tendencia al encrespamiento.',
            ingredients: 'Agua de rosas, Lavanda, Aloe vera',
            benefits: ['Control frizz', 'Hidratación intensa', 'Aroma floral', 'Reduce caspa', 'Suaviza puntas'],
            price: 25000,
            image: 'https://raw.githubusercontent.com/Gon-p/Galery/refs/heads/main/IMG-20251018-WA0115.jpg',
            category: 'Hidratación',
            rating: 4.7,
            reviews: 98,
            stock: 28
        }
    ];

    // ====== ESTADO DE LA APP ======
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentProduct = null;

    // ====== SELECTORES DEL DOM ======
    const productsGrid = document.getElementById('productsGrid');
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartCount = document.querySelector('.cart-count');
    const productModal = document.getElementById('productModal');
    const closeProductBtn = document.getElementById('closeProductBtn');
    const productDetails = document.getElementById('productDetails');
    const productModalTitle = document.getElementById('productModalTitle');

    // ====== FUNCIONES DE RENDERIZADO ======

    /**
     * Dibuja todos los productos en la cuadrícula
     */
    function renderProducts() {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn-details" data-id="${product.id}">
                            <i class="fas fa-info-circle"></i> Detalles
                        </button>
                        <button class="btn-add" data-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Agregar
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }

    /**
     * Actualiza la vista del carrito
     */
    function updateCartView() {
        // Actualizar contador
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Actualizar items del carrito
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Tu carrito está vacío</p>
                    <p style="font-size: 0.9rem;">Agrega algunos productos</p>
                </div>
            `;
            cartSummary.innerHTML = '';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-action="remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Actualizar resumen
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50000 ? 0 : 8000;
        const total = subtotal + shipping;

        cartSummary.innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Envío:</span>
                <span>${shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${formatCurrency(total)}</span>
            </div>
        `;
    }

    /**
     * Muestra los detalles de un producto
     */
    function showProductDetails(productId) {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) return;

        currentProduct = product;
        productModalTitle.textContent = product.name;
        
        productDetails.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h3>${product.name}</h3>
                    <div class="product-detail-price">${formatCurrency(product.price)}</div>
                    <p class="product-detail-description">${product.fullDescription}</p>
                    
                    <div class="product-benefits">
                        <h4>Beneficios:</h4>
                        <ul class="benefit-list">
                            ${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="product-detail-actions">
                        <button class="btn-add-large" data-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        openModal(productModal);
    }

    // ====== FUNCIONES DE LÓGICA ======

    /**
     * Agrega un producto al carrito
     */
    function addToCart(productId) {
        const idNum = parseInt(productId);
        const product = products.find(p => p.id === idNum);
        const existingItem = cart.find(item => item.id === idNum);

        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
                showNotification('success', '¡Agregado!', `Se agregó otra unidad de ${product.name}`);
            } else {
                showNotification('error', 'Stock agotado', 'No hay más unidades disponibles');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                stock: product.stock
            });
            showNotification('success', '¡Agregado!', `${product.name} se agregó al carrito`);
        }
        
        saveToStorage();
        updateCartView();
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     */
    function updateQuantity(productId, change) {
        const idNum = parseInt(productId);
        const item = cart.find(item => item.id === idNum);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== idNum);
            showNotification('success', 'Eliminado', 'Producto removido del carrito');
        } else if (item.quantity > item.stock) {
            item.quantity = item.stock;
            showNotification('error', 'Stock agotado', 'No hay más unidades disponibles');
        }
        
        saveToStorage();
        updateCartView();
    }

    /**
     * Elimina un producto del carrito
     */
    function removeFromCart(productId) {
        const idNum = parseInt(productId);
        const item = cart.find(item => item.id === idNum);
        if (!item) return;

        cart = cart.filter(cartItem => cartItem.id !== idNum);
        showNotification('success', 'Eliminado', `${item.name} removido del carrito`);
        
        saveToStorage();
        updateCartView();
    }

    // ====== FUNCIONES DE UI ======

    /**
     * Abre un modal
     */
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Cierra un modal
     */
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    /**
     * Muestra una notificación
     */
    function showNotification(type, title, message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-left: 4px solid ${type === 'success' ? 'var(--success)' : '#dc2626'};
            z-index: 2000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" 
                   style="color: ${type === 'success' ? 'var(--success)' : '#dc2626'}; font-size: 1.2rem;"></i>
                <div>
                    <strong>${title}</strong>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: var(--gray);">${message}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ====== FUNCIONES UTILITARIAS ======

    /**
     * Formatea un número como moneda colombiana
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Guarda el estado en localStorage
     */
    function saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // ====== CONFIGURACIÓN DE EVENTOS ======

    /**
     * Configura todos los event listeners
     */
    function setupEventListeners() {
        // Botones del header
        cartBtn.addEventListener('click', () => openModal(cartModal));
        closeCartBtn.addEventListener('click', () => closeModal(cartModal));
        closeProductBtn.addEventListener('click', () => closeModal(productModal));

        // Cerrar modales al hacer click fuera
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) closeModal(cartModal);
        });
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) closeModal(productModal);
        });

        // Delegación de eventos para productos
        productsGrid.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const productId = button.dataset.id;
            if (button.classList.contains('btn-details')) {
                showProductDetails(productId);
            }
            if (button.classList.contains('btn-add')) {
                addToCart(productId);
            }
        });

        // Delegación de eventos para el carrito
        cartItems.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const productId = button.dataset.id;
            const action = button.dataset.action;

            if (action === 'increase') {
                updateQuantity(productId, 1);
            }
            if (action === 'decrease') {
                updateQuantity(productId, -1);
            }
            if (action === 'remove') {
                removeFromCart(productId);
            }
        });

        // Delegación de eventos para detalles del producto
        productDetails.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const productId = button.dataset.id;
            if (button.classList.contains('btn-add-large')) {
                addToCart(productId);
                closeModal(productModal);
            }
        });

        // Botón de checkout
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('error', 'Carrito vacío', 'Agrega productos antes de pagar');
                return;
            }
            
            showNotification('success', '¡Compra exitosa!', 'Gracias por tu compra en Brisa Tropical');
            cart = [];
            saveToStorage();
            updateCartView();
            closeModal(cartModal);
        });

        // Navegación suave
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ====== INICIALIZACIÓN ======

    /**
     * Inicializa la aplicación
     */
    function init() {
        renderProducts();
        updateCartView();
        setupEventListeners();
    }

    // Iniciar la aplicación
    init();

});
