const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MENU,
  findMenuItem,
  addToCart,
  removeFromCart,
  cartTotal,
  cartCount,
  orderStatusLabel,
  formatPrice,
} = require("./app.js");

test("menu has 5 items with unique ids", () => {
  assert.equal(MENU.length, 5);
  assert.equal(new Set(MENU.map((item) => item.id)).size, MENU.length);
});

test("findMenuItem returns the matching item or null", () => {
  assert.equal(findMenuItem("pizza").name, "Margherita Pizza");
  assert.equal(findMenuItem("unknown"), null);
});

test("addToCart adds a new line with quantity 1", () => {
  const cart = addToCart([], "burger");
  assert.equal(cart.length, 1);
  assert.equal(cart[0].id, "burger");
  assert.equal(cart[0].price, 179);
  assert.equal(cart[0].quantity, 1);
});

test("addToCart increments quantity for an item already in the cart", () => {
  let cart = addToCart([], "fries");
  cart = addToCart(cart, "fries");
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
});

test("addToCart ignores unknown items", () => {
  assert.equal(addToCart([], "sushi").length, 0);
});

test("removeFromCart removes the matching line only", () => {
  let cart = addToCart(addToCart([], "pizza"), "cola");
  cart = removeFromCart(cart, "pizza");
  assert.equal(cart.length, 1);
  assert.equal(cart[0].id, "cola");
});

test("cartTotal and cartCount aggregate price, quantity and lines", () => {
  let cart = addToCart(addToCart([], "pizza"), "pizza");
  cart = addToCart(cart, "cola");
  assert.equal(cartTotal(cart), 299 * 2 + 59);
  assert.equal(cartCount(cart), 3);
});

test("orderStatusLabel maps known statuses and rejects unknown ones", () => {
  assert.equal(orderStatusLabel("pending"), "Pending");
  assert.equal(orderStatusLabel("accepted"), "Accepted");
  assert.equal(orderStatusLabel("declined"), "Declined");
  assert.equal(orderStatusLabel("something-else"), "Unknown");
});

test("formatPrice renders two decimals with the rupee sign", () => {
  assert.equal(formatPrice(299), "\u20B9299.00");
  assert.equal(formatPrice(59.5), "\u20B959.50");
});
