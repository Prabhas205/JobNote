// TASK 1 — Spread: Student record system
const student = {
    name: "Ravi",
    grade: "A",
    score: 88
};
// a) Create updatedStudent with score changed to 95
// b) Add a new field 'rank': 1 without changing original
// c) Merge student with { school: "IIT", year: 2024 }
// Log original after each step — confirm it's unchanged
const updateStudent = { ...student, score: 95 };
console.log(updateStudent);
const rank = { ...student, rank: 1 };
console.log(rank);
const details = { school: "IIIT", year: 2024 };
const Bio = { ...student, ...rank, ...details };
console.log(Bio);
console.log(student);

// TASK 2 — Rest: Build a flexible expense logger
// Write a function: addExpense(category, ...items)
// - category = "Food", "Travel", etc.
// - items = any number of expense amounts
// - Calculate total of items
// - Return: "Food expenses: ₹250, ₹180, ₹320 | Total: ₹750"
function addExpense(category, ...items) {
    const total = items.reduce((sum, amount) => sum + amount, 0);
    const formatter = items.map(amount => `$amount`).join(", ");
    return `${category} expenses: ${formatter} | Total: ${total}`;
}
console.log(addExpense("food", 200, 300));
console.log(addExpense("Tarvel", 200, 300));

// TASK 3 — Array Methods on real data
const products = [
    { id: 1, name: "Laptop", price: 55000, inStock: true, category: "Electronics" },
    { id: 2, name: "T-Shirt", price: 499, inStock: true, category: "Clothing" },
    { id: 3, name: "Phone", price: 18000, inStock: false, category: "Electronics" },
    { id: 4, name: "Jeans", price: 1200, inStock: true, category: "Clothing" },
    { id: 5, name: "Tablet", price: 25000, inStock: true, category: "Electronics" },
];

// a) map()    — Create a new array of just product names
// b) filter() — Get only in-stock Electronics
// c) reduce() — Calculate total value of all in-stock products
// d) CHAIN    — Get total price of in-stock Electronics only
// e) map()    — Add a 'discountedPrice' field (10% off) to every product
const discountedPrice = products.filter(products => products.inStock === "Electronics")
    .reduce((total, inStock) => total + inStock.price, 0)
    .map(price => price * 0.10);
console.log(discountedPrice);
// TASK 4 — Mini React simulation (prepares you for Week 5)
// Simulate React state without React
let cartItems = [
    { id: 1, name: "Laptop", price: 55000 },
    { id: 2, name: "Mouse", price: 800 },
];

// Write these 3 functions using spread + array methods:
// addToCart(item)     — add new item, don't mutate cartItems
// removeFromCart(id)  — remove by id, don't mutate cartItems
// getCartTotal()      — return total price of all items

function addToCart(item) {
    return { ...cartItems, item };
}


function removeFromCart(id) {
    return { ...cartItems };
    cartItems.filter(item => item.id !== id);
    console.log(cartItems);
}

function getCartTotal() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    console.log(total);
}