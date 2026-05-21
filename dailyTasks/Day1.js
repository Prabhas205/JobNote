//Task:-1
var x = 1;
let y = 2;
if (true) {
    var x = 10;
    let y = 20;
    console.log(x);
    console.log(y);
}
console.log(x);
console.log(y);
//Task-2
const name = "Radha"
console.log(name);
const age = 24
console.log(age);

var score = 100;
var score = 200;
console.log(score);

// Explanation of how this block executes:
// 1. The `for` loop uses `var i`, which means `i` is scoped globally (or to the current function), not to the block.
// 2. The loop runs synchronously and finishes almost instantly, leaving the final value of `i` as 3.
// 3. During the loop, `setTimeout` registers three callback functions to run after 100 milliseconds.
// 4. When the 100ms have passed and the callbacks execute, they look up the value of `i`, which is now 3.
// 5. Result: It prints "i:3", "i:3", and "i:3".
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log("i:" + i), 100)
}
for (var j = 0; j < 3; j++) {
    setTimeout(() => console.log("j:" + j), 100)
}



