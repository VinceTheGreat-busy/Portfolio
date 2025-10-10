// 🛒 Product Data
const products = [
    { id: 1, name: "Product 1", price: 10.0 },
    { id: 2, name: "Product 2", price: 20.0 },
    { id: 3, name: "Product 3", price: 30.0 },
    { id: 4, name: "Product 4", price: 40.0 },
    { id: 5, name: "Product 5", price: 50.0 },
    { id: 6, name: "Product 6", price: 60.0 },
    { id: 7, name: "Product 7", price: 70.0 },
    { id: 8, name: "Product 8", price: 80.0 },
    { id: 9, name: "Product 9", price: 90.0 },
    { id: 10, name: "Product 10", price: 100.0 },
];

// 🧩 State
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🌱 Elements
const root = document.getElementById("root");
const cartSection = document.getElementById("cart");
const cartItemsDiv = document.getElementById("cart-items");
const cartTotalDiv = document.getElementById("cart-total");
const msg = document.getElementById("msg");

// 🧾 Render all products
    root.innerHTML = ""; // Clear previous renders
    products.forEach(({ id, name, price }) => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h2>${name}</h2>
            <p>Price: $${price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${id}">Add to Cart</button>
        `;
        root.appendChild(div);
    });


// 💾 Save cart to localStorage
const saveCart = () => localStorage.setItem("cart", JSON.stringify(cart));

// 🔄 Render Cart
function loadCart() {
    cartSection.style.display = "block";
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        cartTotalDiv.innerHTML = "<h3>Total: $0.00</h3>";
        return;
    }

    // Sort cart items alphabetically
    const sortedCart = [...cart].sort((a, b) => a.name.localeCompare(b.name));

    sortedCart.forEach(({ id, name, price, quantity }) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <p>${name} - $${price.toFixed(2)} × ${quantity} = $${(price * quantity).toFixed(2)}</p>
            <div class="cart-actions">
                <button class="decrease" data-id="${id}">−</button>
                <button class="increase" data-id="${id}">+</button>
                <button class="remove-item" data-id="${id}">X</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    const total = cart.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
    cartTotalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

// 🧮 Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    loadCart();
    showMessage(`${product.name} added to your cart.`);
}

// 🧹 Remove item or decrease quantity
function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
        showMessage(`${item.name} removed from cart.`);
    } else {
        showMessage(`${item.name} quantity updated.`);
    }

    saveCart();
    loadCart();
}

// 🚮 Clear entire cart
function clearCart() {
    if (cart.length === 0) return showMessage("Your cart is already empty.");
    cart = [];
    saveCart();
    loadCart();
    showMessage("Your cart has been cleared.");
}

// 💳 Checkout
function checkout() {
    if (cart.length === 0) return showMessage("Your cart is empty.");

    if (!confirm("Proceed to checkout?")) return;

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);

    cart = [];
    saveCart();
    loadCart();
    showMessage("Checkout complete!");
}

// ✨ Show quick message
function showMessage(text) {
    msg.textContent = text;
    msg.style.opacity = 1;
    setTimeout(() => (msg.style.opacity = 0), 2000);
}

// ❌ Close cart
const closeCart = () => (cartSection.style.display = "none");

// 🎯 Event Listeners
root.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
        addToCart(+e.target.dataset.id);
    }
});

cartItemsDiv.addEventListener("click", e => {
    const id = +e.target.dataset.id;
    if (e.target.classList.contains("increase")) updateQuantity(id, +1);
    if (e.target.classList.contains("decrease")) updateQuantity(id, -1);
    if (e.target.classList.contains("remove-item")) updateQuantity(id, -9999);
});

document.getElementById("view-cart").addEventListener("click", loadCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("clear-cart").addEventListener("click", clearCart);
document.getElementById("checkout").addEventListener("click", checkout);

// 🚀 Initial render
renderProducts();
loadCart();
