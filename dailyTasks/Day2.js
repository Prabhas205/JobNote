// task-1
const add = (a, b) => {
    console.log(a + b);
}
add(9, 8);

// task-2
const greent = () => "Hello!";
console.log(greent());

// task-3
const square = (n) => n * n
console.log(square(7));

const calculate = (a, b) => {
    const result = a * b;
    return result;
}
console.log(calculate(3, 8));

const getUser = (name, age) => ({ name, age });
console.log(getUser("Radha", 24));

const timer = {
    seconds: 0,
    start: function () {
        setInterval(() => {
            this.seconds++;
            console.log(this.seconds);
        }, 1000);

    }
};

const user = {
    name: "John",
    greet: function () {
        console.log(`Hello ${this.name}`);
    }
};
console.log(user.greet());
const name = "Alice";
const age = 34;
console.log(`Hi my name is ${name} and ${age} old.`)

const agee = 49;
console.log(agee > 18);

const namee = "John"

const HTML = `
<div>
<p>Hello, ${namee}!</p>
</div>`;

//const userId = "11234qwe"
//console.log(res.json({ message: `userId is ${userId}` }));

const userr = { name: "Alice", age: 25 };

const { name: name1, age: age1 } = userr;
console.log(name1);
console.log(age1);

const obj = {
    nam: "Ajay",
    ag: 34,
    address: {
        town: "Pamidi",
        city: "Atp",

    }
};
console.log(obj);

const colors = ["red", "blue", "green"]
const [first, second, third] = colors
console.log(first);

let x = 1, y = 2;
[x, y] = [y, x]
console.log(x);
console.log(y);

function dispalyUser({ name, age }) {
    console.log(name, age);
}
dispalyUser({ name: "John", age: 25 });



