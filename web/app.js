const MENU = [
  { id: "pizza", name: "Margherita Pizza", price: 299 },
  { id: "burger", name: "Classic Burger", price: 179 },
  { id: "pasta", name: "White Sauce Pasta", price: 219 },
  { id: "fries", name: "Peri Peri Fries", price: 99 },
  { id: "cola", name: "Cold Drink", price: 59 },
];

const ORDER_STATUS = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

function findMenuItem(id) {
  return MENU.find((item) => item.id === id) || null;
}

function addToCart(cart, id) {
  const item = findMenuItem(id);
  if (!item) {
    return cart;
  }

  const existing = cart.find((line) => line.id === id);
  if (existing) {
    return cart.map((line) =>
      line.id === id ? { ...line, quantity: line.quantity + 1 } : line
    );
  }

  return [...cart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
}

function removeFromCart(cart, id) {
  return cart.filter((line) => line.id !== id);
}

function cartTotal(cart) {
  return cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

function cartCount(cart) {
  return cart.reduce((count, line) => count + line.quantity, 0);
}

function orderStatusLabel(status) {
  return ORDER_STATUS[status] || "Unknown";
}

function formatPrice(amount) {
  return `\u20B9${amount.toFixed(2)}`;
}

function initPage() {
  const menuEl = document.getElementById("menu");
  const cartEl = document.getElementById("cart");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cart-count");
  const statusEl = document.getElementById("order-status");
  const placeOrderBtn = document.getElementById("place-order");

  let cart = [];

  function cartLineHtml(line) {
    return `<li>
      <span>${line.name} &times; ${line.quantity}</span>
      <span class="line-total">${formatPrice(line.price * line.quantity)}</span>
      <button class="remove" data-remove="${line.id}">Remove</button>
    </li>`;
  }

  function render() {
    menuEl.innerHTML = MENU.map(
      (item) => `<div class="card">
        <h3>${item.name}</h3>
        <p class="price">${formatPrice(item.price)}</p>
        <button data-add="${item.id}">Add to cart</button>
      </div>`
    ).join("");

    cartEl.innerHTML = cart.length
      ? cart.map(cartLineHtml).join("")
      : '<li class="empty">Cart is empty</li>';

    totalEl.textContent = formatPrice(cartTotal(cart));
    countEl.textContent = cartCount(cart);
  }

  menuEl.addEventListener("click", (event) => {
    const id = event.target.getAttribute("data-add");
    if (id) {
      cart = addToCart(cart, id);
      render();
    }
  });

  cartEl.addEventListener("click", (event) => {
    const id = event.target.getAttribute("data-remove");
    if (id) {
      cart = removeFromCart(cart, id);
      render();
    }
  });

  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      statusEl.textContent = "Cart is empty — add items before placing an order.";
      return;
    }
    statusEl.textContent = `Order ${orderStatusLabel("accepted")} — thank you for ordering!`;
    cart = [];
    render();
  });

  render();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initPage);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MENU,
    findMenuItem,
    addToCart,
    removeFromCart,
    cartTotal,
    cartCount,
    orderStatusLabel,
    formatPrice,
  };
}
