const user = { name: "Prabhas", age: "21", state: "AP" };

const UserUpdate = { ...user, age: "20" };
const Username = { ...user, name: "P.Prabhas" };
console.log(UserUpdate);
console.log(Username);

const forntend = ["HTML", "CSS", "JS"];
const backend = ["Node,js", "Express.js", "Mongoose"];
const fullstack = [...forntend, ...backend];
console.log(fullstack);

// rest function

function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);

}

let va = sum(1, 2, 3, 4, 5, 6, 7, 7);
console.log(va);

function logAll(...agrs) {
    agrs.forEach(arg => console.log(arg));
}
logAll("MySelf", 404, { url: "//sjdosajdoi" }, "mysql");

function loggOf(level, ...messags) {
    messags.forEach(msg => console.log(`[${level}] ${msg}`));
}
loggOf("Not found", 505, "at.api/user");

/*const numbers = [1, 2, 3, 4, 5, 6]

const double = numbers.map(n => n * 2);
console.log(double);

const users = await User.find();
const safeUser = users.map(user => ({
    id: user.id,
    name: user, name,
    email: user.email


}));
res.json(safeUser);*/

const numberss = [1, 2, 3, 4, 5, 6, 7, 8];
const evens = numberss.filter(nums => nums % 2 === 0);
console.log(evens);

//const activeUser = user.filter(user => user.isActive === true);

const numss = [1, 2, 3, 4, 5, 6]

const tot = numss.reduce((sum, num) => sum + num, 0);

console.log(tot);

const Cart = [
    { item: "laptop", prize: 500000, qty: 1 },
    { item: "tap", prize: 5000, qty: 2 },
    { item: "mouse", prize: 500, qty: 3 },
];

const totalPrize = Cart.reduce((total, item) => {
    return total + (item.prize * item.qty);
}, 0);
console.log(totalPrize);

const orders = [
    { id: 1, amount: 1200, status: "completed" },
    { id: 2, amount: 850, status: "pending" },
    { id: 3, amount: 3000, status: "completed" },
    { id: 4, amount: 500, status: "cancelled" },
];

const totalRenuvu = orders.filter(order => orders.status === "completed")
    .map(order => order.amount)
    .reduce((sum, amount) => sum + amount, 0);

console.log(totalRenuvu);



